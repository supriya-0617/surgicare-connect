
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



## Tech Stack

### **Frontend**

* React + Vite + TypeScript
* Tailwind CSS (custom pastel theme)
* React Router
* Mobile-first responsive UI

### **Backend**

* Node.js + Express + TypeScript
* In-memory JSON data (no database)
* Simple mock API endpoints
* CORS enabled


## 🚀 Features — SurgiConnect: Pre/Post-Surgery Patient Support Platform

SurgiConnect is a digital healthcare platform designed to support patients and families through every stage of surgical recovery. It bridges the communication gap between hospitals and homes while empowering users with personalized, data-driven care tools.

### 🩺 Core Modules

#### **1. Patient Dashboard**
- Personalized recovery timelines and care goals.  
- Wound and medication tracking with daily entry logs.  
- Upload wound images with
- AI-assisted detection for monitoring healing progress.  
- Automated alerts for missed care tasks or abnormal entries.  
- Downloadable medical and progress reports for hospital review.  

#### **2. Family Dashboard**
- Assign and manage shared care responsibilities among family members.  
- Access tailored video guides for wound care and rehabilitation.  
- Upload images or questions for medical review.  
- Secure chat and telehealth integration for remote check-ins.  
- Emotional health and support resource center.  

#### **3. AI Video Library**
- Smart search and filter by surgical procedure and user type (patient, family, or clinician).  
- Adaptive video recommendations based on recovery progress.  
- Community-driven Q&A and discussion threads.  
- Sentiment tagging for highlighting top-rated peer support responses.  

#### **4. Pre-Surgery Preparation**
- Educational guides and checklists for upcoming procedures.  
- Anonymous Q&A sessions with verified professionals and past patients.  
- Tools and techniques for anxiety management before surgery.  

#### **5. Directory & Calls**
- Search nearby hospitals





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


