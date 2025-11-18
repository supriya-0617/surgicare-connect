
## SurgiConnect: Pre/Post-Surgery Patient Support Platform
## About the Project
SurgiConnect is an AI-enhanced digital platform designed to empower surgical patients and their families through every step of the recovery journey. It transforms traditional, passive discharge processes into an active, interactive, and personalized care ecosystem that reduces complications, improves outcomes, and eases caregiver burdens.

## Features
Personalized patient and family dashboards with surgery profiles and care timelines
AI-driven wound photo uploads with real-time infection risk alerts and risk prediction
Interactive milestone-based checklists, medication and pain tracking
Adaptive, scenario-based AI video guides and an AI-moderated community video library with comments and upvotes
Secure chat and telehealth for direct communication with medical staff
Emotional support videos and Q&A forums
Pre-surgery emotional preparation modules
Searchable directory of local hospitals, specialists, and direct call buttons
Real-time notifications and reminders
Modular patient, family, and staff management with privacy controls

## Tech Stack
Frontend: React, Vite, TypeScript, Tailwind CSS, Framer Motion
Backend: Node.js, Express, TypeScript, mock API endpoints (in-memory JSON)
Version control with Git and GitHub for efficient development and collaboration



## 🚀 Tech Stack

### **Frontend**

* React + Vite + TypeScript
* Tailwind CSS (custom pastel theme)
* React Router
* Framer Motion
* Mobile-first responsive UI

### **Backend**

* Node.js + Express + TypeScript
* In-memory JSON data (no database)
* Simple mock API endpoints
* CORS enabled

## 🎨 Features

* Pastel, medical-themed UI
* Patient Dashboard & Family Dashboard
* Video Library (fetching from backend)
* Pre-op Checklist with toggle
* Pain Slider
* Photo Upload (client preview)
* Notifications UI (mark as read)
* Progress Ring component
* Responsive layouts with reusable components


## 📁 Structure

```
frontend/
  src/
    components/
    pages/
    App.tsx
    router.tsx

server/
  src/
    routes/
    data/
    index.ts
```


## 🧪 API Routes

```
GET  /api/videos
GET  /api/checklist
POST /api/checklist
GET  /api/notifications
POST /api/upload-photo
```


## ▶️ Local Development

**Backend**

```
cd server
npm install
npm run dev
```

**Frontend**

```
cd frontend
npm install
npm run dev
```


## 🌍 Deployment

* Frontend → Vercel / Netlify
* Backend → Render / Railway


