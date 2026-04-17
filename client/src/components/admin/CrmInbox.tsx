import { useState, useEffect, useRef } from 'react';
import {
  Send, Paperclip, X, FileText, Clock, ArrowUpRight,
  MessageCircle, Trash2, Sparkles, CheckCheck, User2,
} from 'lucide-react';

interface Attachment {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
}

interface ThreadMessage {
    _id: string;
    direction: 'inbound' | 'outbound';
    body: string;
    subject: string;
    attachments: Attachment[];
    createdAt: string;
}

interface Conversation {
    _id: string;
    contactName: string;
    contactEmail: string;
    messages: ThreadMessage[];
    lastMessageAt: string;
    unreadCount: number;
    status: string;
    messageCount?: number;
    lastMessagePreview?: string;
    lastMessageDirection?: 'inbound' | 'outbound';
}

const templates = [
    { title: "Intro", text: "Thank you for reaching out! I've reviewed your message and would love to connect further. Could we schedule a quick call sometime next week?" },
    { title: "Resume", text: "Thanks for the interest. I have attached my latest Architectural Portfolio and Structural Engineering Resume for your review. Let me know if you need any other credentials." },
    { title: "Unavailable", text: "Thank you for the opportunity. I am currently fully booked on active structural projects, but I will keep your contact information on file for future collaboration." }
];

const CrmInbox = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null);
    const [fullConversation, setFullConversation] = useState<Conversation | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState<File[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchConversations = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/crm/conversations', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });
            const data = await res.json();
            if (data.success) setConversations(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchFullConversation = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/crm/conversations/${id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });
            const data = await res.json();
            if (data.success) {
                setFullConversation(data.data);
                setConversations(prev => prev.map(c => c._id === id ? { ...c, unreadCount: 0 } : c));
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (selectedConvoId) {
            fetchFullConversation(selectedConvoId);
            setReplyText('');
            setFiles([]);
        } else {
            setFullConversation(null);
        }
    }, [selectedConvoId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [fullConversation?.messages]);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Permanently delete this conversation?")) {
            await fetch(`http://localhost:5000/api/crm/conversations/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });
            setConversations(prev => prev.filter(c => c._id !== id));
            if (selectedConvoId === id) setSelectedConvoId(null);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            if (files.length + newFiles.length > 5) {
                alert('Maximum 5 attachments allowed.');
                return;
            }
            setFiles([...files, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSendReply = async () => {
        if (!replyText.trim() && files.length === 0) return;
        if (!fullConversation) return;
        setIsSending(true);

        const formData = new FormData();
        formData.append('text', replyText);
        formData.append('subject', `Re: Your Inquiry - Rohit Jangra Architecture`);
        files.forEach(file => formData.append('attachments', file));

        try {
            const res = await fetch(`http://localhost:5000/api/crm/conversations/${fullConversation._id}/reply`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setFullConversation(data.data);
                setReplyText('');
                setFiles([]);
                if (fileInputRef.current) fileInputRef.current.value = '';
                fetchConversations();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Failed to send reply. Please check your network.");
        } finally {
            setIsSending(false);
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffH = diffMs / (1000 * 60 * 60);

        if (diffH < 1) return `${Math.round(diffMs / (1000 * 60))}m ago`;
        if (diffH < 24) return `${Math.round(diffH)}h ago`;
        if (diffH < 48) return 'Yesterday';
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <div className="w-full flex h-full font-sans">
            {/* ── Left: Conversation List ── */}
            <div className="w-80 shrink-0 border-r border-gray-200 flex flex-col overflow-hidden bg-white">
                <div className="px-5 py-4 border-b border-gray-200 shrink-0 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MessageCircle size={16} className="text-gray-500" />
                        <h3 className="text-sm font-semibold text-gray-900">Inbox</h3>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{conversations.length}</span>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin mx-auto" />
                            <p className="text-xs text-gray-400 mt-3">Loading messages...</p>
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="p-8 text-center">
                            <MessageCircle size={24} className="text-gray-200 mx-auto mb-3" />
                            <p className="text-xs text-gray-400">No conversations yet</p>
                        </div>
                    ) : (
                        conversations.map(convo => (
                            <div
                                key={convo._id}
                                onClick={() => setSelectedConvoId(convo._id)}
                                className={`px-5 py-4 flex gap-3 border-b border-gray-100 cursor-pointer transition-none group ${
                                    selectedConvoId === convo._id
                                        ? 'bg-gray-100 border-l-2 border-l-gray-900'
                                        : 'bg-white hover:bg-gray-50 border-l-2 border-l-transparent'
                                }`}
                            >
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                                    convo.unreadCount > 0
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {getInitials(convo.contactName)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-[13px] truncate ${convo.unreadCount > 0 ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'}`}>
                                            {convo.contactName}
                                        </h4>
                                        <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                                            {formatTime(convo.lastMessageAt)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        {convo.lastMessageDirection === 'outbound' && (
                                            <CheckCheck size={12} className="text-blue-400 shrink-0" />
                                        )}
                                        <p className="text-xs text-gray-400 truncate">
                                            {convo.lastMessagePreview || 'Attachment'}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        {convo.unreadCount > 0 ? (
                                            <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                                                {convo.unreadCount} NEW
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-gray-400">{convo.messageCount} messages</span>
                                        )}
                                        <button
                                            onClick={(e) => handleDelete(convo._id, e)}
                                            className="opacity-0 group-hover:opacity-100 transition-none cursor-pointer"
                                        >
                                            <Trash2 size={13} className="text-gray-400 hover:text-gray-900" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ── Right: Chat View ── */}
            <div className="flex-1 flex flex-col bg-[#FAFAFA] overflow-hidden">
                {fullConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-white shrink-0 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                                    {getInitials(fullConversation.contactName)}
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-gray-900">{fullConversation.contactName}</h2>
                                    <a href={`mailto:${fullConversation.contactEmail}`} className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-none flex items-center gap-1">
                                        {fullConversation.contactEmail}
                                        <ArrowUpRight size={10} className="text-gray-400" />
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-700 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-sm uppercase tracking-wider">
                                    Active
                                </span>
                            </div>
                        </div>

                        {/* Message Thread */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5 no-scrollbar">
                            {fullConversation.messages.map((msg, idx) => (
                                <div key={msg._id || idx} className={`flex flex-col max-w-[75%] ${msg.direction === 'outbound' ? 'self-end items-end' : 'self-start items-start'}`}>
                                    {/* Sender */}
                                    <div className={`flex items-center gap-1.5 mb-1.5 ${msg.direction === 'outbound' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-5 h-5 rounded flex items-center justify-center ${
                                            msg.direction === 'outbound' ? 'bg-gray-200' : 'bg-gray-200'
                                        }`}>
                                            <User2 size={10} className={msg.direction === 'outbound' ? 'text-gray-900' : 'text-gray-500'} />
                                        </div>
                                        <span className="text-[11px] font-bold text-gray-500">
                                            {msg.direction === 'outbound' ? 'You' : fullConversation.contactName.split(' ')[0]}
                                        </span>
                                    </div>

                                    {/* Bubble */}
                                    <div className={`px-4 py-3 text-[13px] font-medium leading-relaxed whitespace-pre-wrap ${
                                        msg.direction === 'outbound'
                                            ? 'bg-gray-900 text-white rounded-xl rounded-br-sm'
                                            : 'bg-white text-gray-900 border border-gray-200 rounded-xl rounded-bl-sm shadow-sm'
                                    }`}>
                                        {msg.body}
                                    </div>

                                    {/* Attachments */}
                                    {msg.attachments && msg.attachments.length > 0 && (
                                        <div className={`flex flex-wrap gap-1.5 mt-2 ${msg.direction === 'outbound' ? 'justify-end' : ''}`}>
                                            {msg.attachments.map((file, fIdx) => (
                                                <a
                                                    key={fIdx}
                                                    href={`http://localhost:5000${file.path}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700 transition-none shadow-sm"
                                                >
                                                    <FileText size={13} className="text-gray-500" />
                                                    <span className="truncate max-w-[120px]">{file.originalName}</span>
                                                    <span className="text-[10px] font-medium text-gray-400">({(file.size / 1024).toFixed(0)}kb)</span>
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    {/* Time */}
                                    <span className={`text-[10px] font-bold text-gray-400 mt-1 flex items-center gap-1 ${msg.direction === 'outbound' ? 'flex-row-reverse' : ''}`}>
                                        <Clock size={10} />
                                        {new Date(msg.createdAt).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>

                        {/* ── Compose ── */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-white shrink-0 flex flex-col gap-3">
                            {/* Quick Templates */}
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                                <Sparkles size={13} className="text-gray-400 shrink-0" />
                                {templates.map((tpl, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setReplyText(tpl.text)}
                                        className="text-[11px] px-3 py-1.5 rounded border border-gray-200 text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900 font-bold transition-none whitespace-nowrap cursor-pointer shadow-sm"
                                    >
                                        {tpl.title}
                                    </button>
                                ))}
                            </div>

                            {/* Staged Files */}
                            {files.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {files.map((file, i) => (
                                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600">
                                            <FileText size={12} className="text-gray-400" />
                                            <span className="truncate max-w-[100px]">{file.name}</span>
                                            <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-400 cursor-pointer">
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Input */}
                            <div className="flex items-end gap-2">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="flex-1 h-20 min-h-[48px] max-h-[160px] bg-white border border-gray-200 rounded-lg px-4 py-3 text-[13px] font-medium resize-none outline-none focus:border-gray-900 focus:ring-0 text-gray-900 placeholder:text-gray-400 transition-none no-scrollbar shadow-sm"
                                    placeholder={`Reply to ${fullConversation.contactName.split(' ')[0]}...`}
                                />

                                <div className="flex flex-col gap-1.5 shrink-0">
                                    <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mp3,.zip" />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isSending}
                                        className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-40"
                                        title="Attach Files"
                                    >
                                        <Paperclip size={16} />
                                    </button>
                                    <button
                                        onClick={handleSendReply}
                                        disabled={(!replyText.trim() && files.length === 0) || isSending}
                                        className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-40"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3">
                        <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                            <MessageCircle size={24} className="text-gray-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-gray-900">Select a conversation</p>
                            <p className="text-xs font-medium text-gray-500 mt-1">Choose a thread from the inbox to view messages</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CrmInbox;
