import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import Conversation from '../models/Conversation.js';

// Track processed email UIDs to avoid duplicates within a session
const processedUIDs = new Set<number>();

async function syncInboundEmails() {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
        return;
    }

    const client = new ImapFlow({
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
        auth: { user: emailUser, pass: emailPass },
        logger: false
    });

    try {
        await client.connect();
        await client.mailboxOpen('INBOX');
        
        // Search ALL emails that arrived in the last 48 hours (ignoring Read/Unread status)
        // This prevents the CRM from missing emails if you accidentally open them on your phone first
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const recentMessages = await client.search({ 
            since: twoDaysAgo 
        });

        if (!recentMessages || recentMessages.length === 0) {
            await client.logout();
            return;
        }

        for (const uid of recentMessages) {
            if (processedUIDs.has(uid)) continue;

            try {
                const message = await client.fetchOne(uid, { source: true }, { uid: true });
                if (!message || !message.source) continue;

                const parsed = await simpleParser(message.source);
                const senderAddress = (parsed.from?.value?.[0]?.address || '').toLowerCase();
                const senderName = parsed.from?.value?.[0]?.name || senderAddress;
                // email internal unique identifier
                const messageIdHeader = parsed.messageId || `no-id-${uid}-${Date.now()}`;

                // Skip our own outbound emails completely
                if (senderAddress === emailUser.toLowerCase()) {
                    processedUIDs.add(uid);
                    continue;
                }

                // ONLY import if sender already has a conversation in our CRM
                const conversation = await Conversation.findOne({ 
                    contactEmail: senderAddress 
                });

                if (!conversation) {
                    processedUIDs.add(uid);
                    continue; // Not a portfolio contact — ignore
                }

                // Strictly Dedup against the Database by the exact Email Header ID
                // If it exists anywhere in the conversation, skip it!
                const alreadyImported = conversation.messages.some(msg => 
                    msg.messageId === messageIdHeader || 
                    (msg.body.includes(parsed.text?.substring(0, 50) || 'xyz123')) 
                );

                if (alreadyImported) {
                    processedUIDs.add(uid);
                    continue; 
                }

                // Extract clean body text
                const body = parsed.text || (parsed.html ? parsed.html.replace(/<[^>]*>/g, '') : '') || '(No body)';
                const cleanBody = body.split(/\r?\n/).reduce((acc: string[], line: string) => {
                    if (line.startsWith('>') || line.match(/^On .+ wrote:$/)) return acc;
                    acc.push(line);
                    return acc;
                }, []).join('\n').trim() || body.trim();

                // Append uniquely verified inbound reply to the thread
                conversation.messages.push({
                    direction: 'inbound',
                    messageId: messageIdHeader,
                    body: cleanBody,
                    subject: parsed.subject || '',
                    attachments: [],
                    createdAt: new Date()
                });
                conversation.lastMessageAt = new Date();
                conversation.unreadCount += 1;
                await conversation.save();

                console.log(`[EMAIL SYNC] Threaded reply from ${senderName} into conversation`);

                // Mark as read in Gmail (optional but clean)
                await client.messageFlagsAdd(uid, ['\\Seen'], { uid: true });
                processedUIDs.add(uid);

            } catch (msgError) {
                console.error(`[EMAIL SYNC] Error processing UID ${uid}:`, msgError);
            }
        }

        await client.logout();

    } catch (error: any) {
        console.error('[EMAIL SYNC] Connection error:', error.message);
        try { await client.logout(); } catch (_) {}
    }
}

export function startEmailSync(intervalMs: number = 60000) {
    console.log(`[EMAIL SYNC] Service active (polling every ${intervalMs / 1000}s)`);
    setTimeout(() => syncInboundEmails(), 5000);
    setInterval(() => syncInboundEmails(), intervalMs);
}
