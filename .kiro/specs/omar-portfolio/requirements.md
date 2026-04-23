# Requirements Document

## Introduction

A high-performance, dark-themed portfolio website for Omar Elshamy — a 3rd-year Computer Science student at MIU and AI specialist. The site follows a "Recruiter's Co-Pilot" philosophy: utility over novelty. Every section is designed to help recruiters quickly understand Omar's technical value, culminating in an interactive AI chat interface that acts as a live technical agent answering questions about Omar's background with cited evidence.

The site is a single-page application built with Tailwind CSS, using the "Neural Noir" color palette, with five navigable sections: Home, The AI Sandbox, Project Vault, The Journey, and Contact.

## Glossary

- **Portfolio_Site**: The complete single-page portfolio website for Omar Elshamy
- **Hero_Section**: The landing section containing the headline, sub-headline, and background animation
- **AI_Sandbox**: The interactive RAG-powered chat interface section styled as a terminal
- **RAG_Agent**: The AI persona that answers recruiter questions about Omar using cited sources
- **Project_Vault**: The section displaying Omar's three featured project cards
- **Journey_Section**: The section narrating Omar's academic and competitive programming timeline
- **Contact_Section**: The section providing ways to reach Omar
- **Neural_Network_Animation**: The subtle grain/particle animation in the hero background
- **Project_Card**: A single interactive card displaying one project's details
- **Terminal_UI**: The visual aesthetic mimicking a command-line interface for the AI chat
- **Nav_Bar**: The top navigation bar with links to all five sections
- **Deep_Link**: A direct URL reference to a specific file or line in a GitHub repository
- **Backend_API**: The lightweight server-side layer (Node.js or Python/FastAPI) that proxies requests to Gemini and GitHub APIs
- **Gemini_API**: Google's Gemini 1.5 Flash model used as the LLM backend for the RAG_Agent
- **GitHub_REST_API**: GitHub's public REST API used to fetch real-time repository and file data from Omar's GitHub account
- **Knowledge_Context**: A structured text document containing Omar's CV and personal background, injected as system context into every Gemini request
- **Omar_GitHub**: Omar's GitHub profile at https://github.com/O-Abdelghany
- **Omar_LinkedIn**: Omar's LinkedIn profile at https://www.linkedin.com/in/omarabdelghany/

## Requirements

### Requirement 1: Navigation Bar

**User Story:** As a recruiter, I want a persistent navigation bar, so that I can jump to any section of the portfolio instantly without scrolling.

#### Acceptance Criteria

1. THE Nav_Bar SHALL display five links: "Home", "The AI Sandbox", "Project Vault", "The Journey", and "Contact"
2. WHEN a navigation link is clicked, THE Portfolio_Site SHALL smooth-scroll to the corresponding section
3. WHILE a user scrolls the page, THE Nav_Bar SHALL remain fixed at the top of the viewport
4. WHEN a section enters the viewport, THE Nav_Bar SHALL highlight the corresponding link with the active accent color (#a855f7)
5. THE Nav_Bar SHALL use background color #080810 with a subtle bottom border of #1e1e3a to separate it from page content

---

### Requirement 2: Hero Section

**User Story:** As a recruiter, I want a compelling hero section, so that I can immediately understand who Omar is and what he specializes in.

#### Acceptance Criteria

1. THE Hero_Section SHALL display the headline "Omar Elshamy: Building Autonomous Intelligence."
2. THE Hero_Section SHALL display the sub-headline "Specializing in Agentic RAG and LLM Optimization. ECPC Competitor. Future UAE AI Engineer."
3. THE Hero_Section SHALL render a Neural_Network_Animation as the background using a dark canvas with animated nodes and connecting edges on color #080810
4. WHEN the page loads, THE Hero_Section SHALL animate the headline and sub-headline into view with a fade-in transition of no more than 800ms
5. THE Hero_Section SHALL display a primary call-to-action button labeled "Explore My Work" that smooth-scrolls to the Project_Vault section when clicked
6. THE Hero_Section SHALL display a secondary call-to-action button labeled "Ask My AI Agent" that smooth-scrolls to the AI_Sandbox section when clicked
7. THE Hero_Section SHALL use text color #ffffff for the headline and #94a3b8 for the sub-headline

---

### Requirement 3: AI Sandbox — Terminal Chat Interface

**User Story:** As a recruiter, I want to interact with an AI agent that answers questions about Omar, so that I can quickly verify his skills and experience with cited evidence.

#### Acceptance Criteria

1. THE AI_Sandbox SHALL render a Terminal_UI styled chat interface with background color #0f0f1a and a border of #1e1e3a
2. THE Terminal_UI SHALL display a header bar showing a terminal title such as "omar-agent ~ recruiter-session" with three decorative window-control dots (red, yellow, green)
3. WHEN a recruiter types a message and submits, THE RAG_Agent SHALL send the message to the Backend_API, which SHALL query the Gemini_API with the Knowledge_Context as system context and return a response
4. WHEN the RAG_Agent is asked about a skill Omar possesses, THE RAG_Agent SHALL confirm confidently, list the names of relevant projects, provide a brief description of the skill, and include at least one Deep_Link to a specific GitHub repository and one Deep_Link to a specific file where that skill is demonstrated
5. WHEN the RAG_Agent is asked about a skill Omar does not possess, THE RAG_Agent SHALL respond attractively (e.g. "Not yet, but he knows [top 3 closest related skills]"), listing a project name beside each related skill without elaborating further unless the recruiter asks a follow-up question
6. WHEN a recruiter asks a follow-up question about a skill Omar does not possess, THE RAG_Agent SHALL progressively expand the response with more detail about the related skills and projects
7. THE RAG_Agent SHALL maintain the persona: "You are Omar's technical agent. Answer questions about Omar's skills, projects, and experience using cited evidence."
8. WHEN the AI_Sandbox loads, THE Terminal_UI SHALL display a welcome message: "Connected to omar-agent v1.0. Ask me anything about Omar's technical background."
9. THE Terminal_UI SHALL display user messages right-aligned with accent color #7c3aed and agent responses left-aligned with text color #94a3b8
10. WHEN the RAG_Agent is generating a response, THE Terminal_UI SHALL display an animated typing indicator (blinking cursor or ellipsis)
11. THE AI_Sandbox SHALL include a text input field and a submit button styled to match the Terminal_UI aesthetic
12. IF the RAG_Agent cannot answer a question, THEN THE RAG_Agent SHALL respond with a fallback message directing the recruiter to the Contact_Section
13. THE Backend_API SHALL fetch real-time repository and file data from Omar_GitHub using the GitHub_REST_API to supply up-to-date Deep_Link citations in responses

---

### Requirement 4: Project Vault

**User Story:** As a recruiter, I want to browse Omar's featured projects, so that I can assess the depth and relevance of his technical work.

#### Acceptance Criteria

1. THE Project_Vault SHALL display exactly three Project_Cards in a responsive grid layout
2. WHEN a recruiter hovers over a Project_Card, THE Project_Card SHALL elevate with a box-shadow glow using color #7c3aed and a subtle upward translate animation
3. EACH Project_Card SHALL display: a project title, a "Technical Challenge" description, a "Solution" description, and a Deep_Link button labeled "View Code"
4. WHEN the "View Code" button is clicked, THE Portfolio_Site SHALL open the corresponding GitHub Deep_Link in a new browser tab
5. THE Project_Card SHALL use background color #0f0f1a, border color #1e1e3a, and title text color #ffffff
6. WHEN Project_Cards enter the viewport during scroll, THE Project_Vault SHALL animate each card into view with a staggered fade-up transition

---

### Requirement 5: The Journey Section

**User Story:** As a recruiter, I want to understand Omar's academic and competitive programming journey, so that I can evaluate his growth mindset and resilience.

#### Acceptance Criteria

1. THE Journey_Section SHALL present Omar's timeline as a vertical or horizontal sequence of milestone entries
2. THE Journey_Section SHALL include an entry for the ECPC competition result framed as: "50th Place — ECPC Regional" with a description emphasizing the skills gained: "Algorithmic Optimization" and "Stress-Management under competitive conditions"
3. THE Journey_Section SHALL frame the ECPC result as a technical crucible and learning milestone, not as a loss or failure
4. THE Journey_Section SHALL include Omar's enrollment at MIU as a 3rd-year Computer Science student as a milestone entry
5. WHEN a milestone entry enters the viewport, THE Journey_Section SHALL animate the entry into view with a fade-in-left or fade-in-right transition
6. THE Journey_Section SHALL use accent color #7c3aed for milestone markers and timeline connectors

---

### Requirement 6: Contact Section

**User Story:** As a recruiter, I want a clear and accessible contact section, so that I can reach out to Omar directly after reviewing his portfolio.

#### Acceptance Criteria

1. THE Contact_Section SHALL display Omar's name and a brief invitation to connect
2. THE Contact_Section SHALL provide a contact form with fields for: name, email address, and message
3. WHEN a recruiter submits the contact form with all required fields filled, THE Contact_Section SHALL display a confirmation message indicating the message was sent
4. IF a recruiter submits the contact form with any required field empty, THEN THE Contact_Section SHALL display an inline validation error for each empty field
5. THE Contact_Section SHALL display a link to Omar_GitHub (https://github.com/O-Abdelghany) and a link to Omar_LinkedIn (https://www.linkedin.com/in/omarabdelghany/) as icon buttons
6. THE Contact_Section SHALL use background color #0f0f1a and border color #1e1e3a for the form container

---

### Requirement 7: Visual Design System

**User Story:** As a recruiter, I want a visually consistent and professional design, so that the portfolio feels polished and trustworthy.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL apply the Neural Noir color palette consistently: background #080810, surface #0f0f1a, border #1e1e3a, primary accent #7c3aed, active/glow #a855f7, text primary #ffffff, text secondary #94a3b8
2. THE Portfolio_Site SHALL use Tailwind CSS as the sole styling framework
3. THE Portfolio_Site SHALL apply smooth CSS transitions of 200ms–400ms duration to all interactive elements including buttons, cards, and navigation links
4. THE Portfolio_Site SHALL be fully responsive, rendering correctly on viewport widths from 320px to 1920px
5. WHEN any interactive element receives keyboard focus, THE Portfolio_Site SHALL display a visible focus ring using accent color #a855f7 to ensure keyboard accessibility
6. THE Portfolio_Site SHALL use a monospace or code-style font for all Terminal_UI elements and a clean sans-serif font for all other text

---

### Requirement 8: Performance

**User Story:** As a recruiter, I want the portfolio to load quickly, so that I am not deterred by slow performance before seeing Omar's work.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL achieve a Lighthouse performance score of 80 or above on desktop
2. THE Neural_Network_Animation SHALL use requestAnimationFrame for rendering and SHALL NOT cause the main thread frame rate to drop below 30fps on modern hardware
3. THE Portfolio_Site SHALL lazy-load any images or heavy assets that are not visible in the initial viewport
4. IF the user's device has the "prefers-reduced-motion" media feature enabled, THEN THE Portfolio_Site SHALL disable or reduce all animations including the Neural_Network_Animation

---

### Requirement 9: Backend API Layer

**User Story:** As a developer, I want a lightweight backend API layer, so that the frontend can securely communicate with the Gemini API and GitHub REST API without exposing credentials.

#### Acceptance Criteria

1. THE Backend_API SHALL expose an HTTP endpoint that accepts a recruiter message and returns a RAG_Agent response
2. WHEN the Backend_API receives a request, THE Backend_API SHALL inject the Knowledge_Context (Omar's CV and personal background text) as the system prompt in every request sent to the Gemini_API
3. THE Backend_API SHALL use the Gemini 1.5 Flash model via the Google Gemini API free tier as the sole LLM backend
4. WHEN constructing a response that references a skill or project, THE Backend_API SHALL query the GitHub_REST_API for Omar_GitHub repositories and file paths to generate accurate Deep_Link citations
5. THE Backend_API SHALL store all API keys (Gemini API key, GitHub token) as server-side environment variables and SHALL NOT expose them to the client
6. IF the Gemini_API returns an error, THEN THE Backend_API SHALL return a structured error response with an HTTP 502 status code and a human-readable message
7. IF the GitHub_REST_API returns an error or rate-limit response, THEN THE Backend_API SHALL fall back to cached repository metadata and continue generating a response
8. THE Backend_API SHALL accept Cross-Origin Resource Sharing (CORS) requests from the Portfolio_Site's origin domain
9. THE Backend_API SHALL be implementable as either a Node.js (Express) or Python (FastAPI) service with no more than three external dependencies beyond the LLM and GitHub client libraries
