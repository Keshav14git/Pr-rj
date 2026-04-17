# Implementation Plan: 3-Core AI Intelligence System

This document outlines the architecture for a hybridized AI Assistant that combines the **Command Center**, **Context Tour Guide**, and **Blueprint Generator** into a single cohesive, highly-premium MINE AI experience. 

Instead of a chat interface, we are building a **Data Intelligence Overlay** suitable for a cutting-edge Project Manager.

---

## 1. Core Architecture (The Hybrid Overlay)

When the user clicks the Gyroscopic Trigger, instead of opening a traditional chatbot box, a sleek **Command Palette** (similar to Apple Spotlight or Raycast) slides into view, blurring the entire background.

### The Interface Layout
- **The Input Engine (Command Center):** A highly visible, sleek search bar reading *"Query Rohit's Project Data, or select a scenario below..."*
- **The Quick-Pitch Tags (Blueprint Generator):** Below the search, a series of instant-click tags representing common recruiter goals: 
  - `[ Hiring for High-Budget Retail ]`
  - `[ Need Fast-Track Execution ]`
  - `[ Seeking Multi-Site Rollout Expert ]`
- **Contextual Awareness (The Tour Guide):** If the user opens the AI while currently looking at the "About" section, the AI automatically pre-fills a dynamic suggestion underneath the search bar: *"You are viewing the Profile. Want a breakdown of the 11-year operational timeline?"*

---

## 2. Interaction Flow

### A. Dynamic Proposal Generation (If they click a Quick-Pitch Tag)
If a recruiter clicks `[ Hiring for High-Budget Retail ]`, the Command Center expands downwards. Seamlessly, a mini **Pitch Deck** is generated on-screen containing:
1. **The Assertion:** "Rohit has delivered 35+ high-end retail projects averaging $2M+ budgets."
2. **The Proof:** A carousel or grid of 3 relevant retail projects pulled directly from the portfolio data.
3. **The Call-to-Action:** "Download Retail-Specific Resume" or "Send Message".

### B. Natural Data Queries (If they type in the Command Center)
If a user types *"brands worked with"*, the UI dynamically filters Rohit's client roster and displays a beautiful grid of client logos/names, proving direct relevance instantly.

### C. Page Interaction (Tour Guide)
If the user is reading a specific project in the Experience section and opens the AI, the AI acknowledges the active project and offers deeper, unseen metrics: *"Viewing Project X: Want to see the budget variance report?"*

---

## 3. Technical Implementation Tasks

### Phase 1: Overhauling the UI
- Rename `AdvancedAssistant.tsx` to `IntelligenceCore.tsx`.
- Keep the existing 3D Gyroscopic Trigger.
- Delete the old "chat bubble" layout.
- Build the **Spotlight Command Palette** UI (Glassmorphic search bar, centered, responsive).
- Build the **Suggestion Chips** grid underneath the search bar.

### Phase 2: Building the Data Rendering Engine
- Instead of text responses, build a `DynamicReport` component. 
- Create static JSON placeholder data for 3 scenarios (Retail Pitch, Commercial Pitch, Speed/Execution Pitch).
- When a query is executed, animate the Command Palette expanding to reveal the `DynamicReport` layout (a mix of bold metrics, small graphs/numbers, and project cards).

### Phase 3: Scroll Context (Tour Guide)
- Connect a global `IntersectionObserver` or Lenis scroll-spy to track which section is currently centered on the viewport.
- Feed this context into the `IntelligenceCore` state so the AI can say *"I see you're looking at Key Achievements."*
