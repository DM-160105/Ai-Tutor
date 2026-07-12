# 🧠 AI Tutor DM

An intelligent web-based learning assistant that creates personalized lessons tailored to a student's age, goals, and learning style.

---

## 📚 Table of Contents

- [✨ Overview](#-overview)  
- [🧑‍💻 User Experience](#-user-experience)  
- [🔍 Features](#-features)  
- [🛠️ Technology Stack](#-technology-stack)  
- [📊 Languages & Usage](#-languages--usage)  
- [🚀 Getting Started](#-getting-started)  
- [🧪 How It Works](#-how-it-works)  
- [📆 Roadmap](#-roadmap)

---

## ✨ Overview

**AI Tutor DM** is a dynamic educational platform powered by AI that helps users learn any subject interactively. Whether you're a student needing structured lessons or a curious learner looking to explore new topics, this app provides guided, conversational tutoring experiences.

---

## 🧑‍💻 User Experience

### 🔹 Home Page
- Input: age, learning goals, subject
- Launch a personalized lesson with one click

### 📘 Lesson Page
- Custom AI-generated lesson based on inputs
- Step-by-step teaching with interactive responses

### 🧠 Q&A Support
- Ask natural-language questions any time
- Get contextual answers mid-lesson

### 📈 Session Recap
- Summary of covered material
- Optional quizzes or skill checks
- Option to continue, review, or restart

---

## 🔍 Features

- 🎯 **Personalized Lesson Plans**  
  Learners receive custom-tailored content based on goals and subject.
  
- 🤖 **Real-Time Conversational Tutoring**  
  Engage with the AI tutor using natural language interactions.
  
- 🧩 **Adaptive Learning Journey**  
  Content difficulty evolves based on progress and answers.
  
- ✍️ **Embedded Assessments**  
  Quick checks and quizzes built into every lesson.
  
- 📥 **Progress Summary per Session**  
  Review what you've learned and plan next steps easily.

---

## 🛠️ Technology Stack

| Technology | Description |
|------------|-------------|
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white) | Frontend UI Framework |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white) | Build Tool & Dev Server |
| ![Bun](https://img.shields.io/badge/-Bun-black?logo=bun&logoColor=white) | Package Manager & Runtime |
| ![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white) | Styling & Design System |
| ![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?logo=supabase&logoColor=white) | Database, Auth & Edge Functions |
| ![Vercel](https://img.shields.io/badge/-Vercel-000000?logo=vercel&logoColor=white) | Hosting & Deployment |

---

## 🚀 Getting Started

This project is built and optimized exclusively for **Bun**. Do not use `npm` or `yarn`.

### Prerequisites
Make sure you have [Bun](https://bun.sh) installed:
```bash
curl -fsSL https://bun.sh/install | bash
```

### Installation & Run
1. Clone the repository:
   ```bash
   git clone https://github.com/DM-160105/Ai-Tutor.git
   cd Ai-Tutor
   ```

2. Install dependencies using Bun:
   ```bash
   bun install
   ```

3. Create your local environment file:
   Copy the example file to `.env` (or `.env.local` which is ignored by git):
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and enter your Supabase Project credentials.

4. Start the local development server:
   ```bash
   bun run dev
   ```
   The application will be running at `http://localhost:8080`.

---

## ⚡ Deployment & Hosting

### Vercel Routing Configuration
Since this is a Single Page Application (SPA) utilizing `react-router-dom`, direct URL navigation or refreshing pages on Vercel would normally result in a **404: NOT_FOUND** error. 

We resolve this automatically with the [vercel.json](file:///Users/devang-makwana/Documents/Ai-Tutor/vercel.json) rewrite rule in the root of the project:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This rewrites all server-side requests to `index.html`, allowing React Router to handle the URL correctly.

### Vercel Environment Variables
Make sure to add the following Environment Variables in your Vercel Dashboard (**Settings -> Environment Variables**):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

