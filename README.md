
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

 • Patient Dashboard: Personalized recovery timeline, wound and medication logging,
photo uploads with real-time alerts, downloadable doctor reports, and automated
reminders for care tasks.
• Family Dashboard: Assignable care tasks, tailored video guides for wound
management and rehab, upload portals for questions and images, secure chat and
telehealth options, and emotional support resources.
• AI Video Library: Search/filter by procedure and user group, adaptive video guides,
moderated community advice, and sentiment highlights for top peer support.
• Pre-Surgery Preparation: Guides, anonymous Q&A answered by professionals and
peers, and anxiety management resources.
• Directory & Calls: Search for nearby hospitals and specialists by procedure,
emergency contacts, click-to-call, and profile details.
• Notification Center: Real-time alerts for missed care, abnormal wound entries, and
medication reminders.
• Settings/Profile: Role management and privacy controls for patients, caregivers, and
staff.
• Downloadable progress and care reports for medical staff
• AI Based Wound Detection: Mechanism to identify stages of wound and specific recovery plan.



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
npm install
npm run dev
cd server
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


