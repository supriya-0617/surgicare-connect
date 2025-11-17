
# 🌟 SurgiConnect — Pastel Surgery Preparation Assistant

SurgiPrep is a clean, pastel-themed surgery preparation assistant built with **React + Vite + TypeScript** on the frontend and **Node.js + Express + TypeScript** on the backend.
It is a beginner-friendly full-stack prototype with simple UI, light interactivity, and a mock API.

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


