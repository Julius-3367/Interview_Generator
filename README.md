# AI Interview Question Generator

A high-performance, modern web application built as a technical demonstration for the Founding Engineer / Technical Co-Founder role. This project leverages Google's Gemini AI to generate role-specific interview questions with a focus on speed, security, and a polished user experience.

## 🚀 Live Demo
[Insert your Netlify/Vercel URL here]

## 🛠️ Technical Stack
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **AI Engine**: [Google Gemini 1.5 Flash](https://ai.google.dev/)
- **Styling**: Modern CSS with Glassmorphism and Responsive Design
- **Hosting**: Netlify / Vercel (Serverless)

## ✨ Key Features
- **Intelligent Generation**: Tailored interview questions using structured prompting.
- **Glassmorphism UI**: A sleek, modern aesthetic that stands out from standard technical screens.
- **Server-Side Security**: API keys are managed via environment variables and never exposed to the client.
- **Optimized Performance**: Built with a unified full-stack architecture for near-instant response times.
- **UX Touches**: Integrated "Copy to Clipboard" and smooth entry animations.

## 🧠 Architectural Decisions
### Why Next.js?
I chose Next.js to provide a unified full-stack environment. By using **Next.js API Routes**, I eliminated the need for a separate proxy server, allowing the entire application to be hosted as a single serverless entity. This reduces complexity and ensures the app is highly scalable and cost-effective for an early-stage startup.

### Why Gemini 1.5 Flash?
For a real-time interview tool, latency is key. I selected the `gemini-1.5-flash` model because it offers the best balance of speed and reasoning capabilities. It provides high-quality questions while maintaining the "snappiness" users expect from modern AI tools.

### Security First
Even in a 30-minute build, security matters. The AI communication is handled in a server-side route handler, ensuring that the `GEMINI_API_KEY` remains strictly confidential.

## 📖 Building Philosophy
I believe in **Speed to Value**. In an early-stage startup, the goal is to build robust, clean architectures that allow for rapid iteration without incurring technical debt. I write code that is readable, maintainable, and designed for a non-technical founder to understand and trust.

---
Built with ❤️ by Julius
