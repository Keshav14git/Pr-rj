# The "Context-Aware Global Assistant" 
**AI Integration Concept for Project Management Portfolio**

## 1. The Core Concept
Instead of a generic, free-floating chatbot that says *"How can I help you?"*, the portfolio will feature a **Context-Aware AI Assistant** powered by the **Groq API** (for near-instantaneous, streaming generation). 

This AI acts as a highly specialized museum curator or technical interviewer. It constantly "listens" to which section (`currentScreen`) the user is looking at and dynamically updates its internal System Prompt to become an absolute expert on *that specific section*. 

## 2. Section-by-Section Behavior

### Hero Section (The "Concierge" Mode)
* **Goal:** Hook the recruiter/client immediately upon landing.
* **Behavior:** General synthesizer of the entire career.
* **User prompt:** *"tl;dr"* or *"Summarize his profile."*
* **AI Output:** *"Keshav is a highly technical Project Manager with 8+ years executing multi-million dollar retail fit-outs for brands like Nike, Reliance, and Cars24. Are you looking to hire for a specific role, or do you want to see his core projects?"*

### About Section (The "Interview" Mode)
* **Goal:** Pre-emptively answer HR screening questions.
* **Behavior:** Trained entirely on soft skills, personality, management style, and career trajectory.
* **User prompt:** *"Why did he transition from Site Engineer to Project Manager?"*
* **AI Output:** Answers exactly how the candidate would in a professional interview, proving soft skills, adaptability, and leadership capabilities.

### Core Expertise (The "Technical Consultant" Mode)
* **Goal:** Prove technical depth beyond simple resume buzzwords.
* **Behavior:** Dives deep into civil engineering, MEP coordination, and vendor workflows.
* **User prompt:** *"Explain how he handles Vendor Management."*
* **AI Output:** *"Keshav relies on ISO-9001 quality matrices. When evaluating vendor quotes, he cross-checks BOQs against standard industry rates and enforces strict SLA penalties. Want an example of how he handles a delayed HVAC shipment?"*

### Projects Gallery (The "Project Analyst" Mode)
* **Goal:** Add immense depth and real-world context to visual portfolio pieces.
* **Behavior:** The AI knows *which specific project card* the user is actively viewing.
* **User prompt:** *(While looking at the Nike Brand Store, Surat)* *"What was hard about this?"*
* **AI Output:** *"Executing a premium layout for Nike in Surat required precise joinery and electrical routing for bespoke shelving displays. Do you want to know how Keshav managed the tight mall timeline for this specific site?"*

### Skills (The "Workflow" Mode)
* **Goal:** Demonstrate *how* tools are used in practice, not just that they exist.
* **Behavior:** Explains the practical application of software and methodologies.
* **User prompt:** *"How advanced is his AutoCAD?"*
* **AI Output:** *"He uses AutoCAD extensively to review shop drawings, resolve site clashes before execution, and extract precise quantities for billing validation."*

## 3. Technical Implementation Strategy

1. **Global AI Component:** Create `<GlobalAIAssistant currentSection={currentScreen} />` sitting at the root [App.tsx](file:///d:/pr-rj/client/src/App.tsx) level so it persists across transitions.
2. **Context Provider:** The assistant tracks the `currentSection` prop and uses it to select a specific `System Prompt` before sending user messages to the Groq API.
3. **Data Retrieval (RAG):** The AI will have access to [experience.json](file:///d:/pr-rj/client/src/data/experience.json) and a hidden `knowledge_base.md` to ground its answers perfectly in the user's actual history, preventing hallucinations.
4. **Instant Streaming UI:** Because Groq utilizes specialized LPUs (Language Processing Units), the AI's responses will stream onto the screen at hundreds of words per second, matching the portfolio's cinematic, fast-paced animations.

## 4. Value Proposition
* **Active Lead Generation:** Turns a passive portfolio into an interactive consulting tool.
* **Unmatched Professionalism:** Gives recruiters exactly what they want instantly, saving them time.
* **Technical Flex:** Demonstrates advanced, cutting-edge software integration capabilities.
