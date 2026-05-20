# Coleren

An AI-powered CRM platform for sales teams and product managers. Coleren centralizes sales pipeline management, customer feedback, team collaboration, and AI-driven insights in one place.

---

## Features

- **Dashboard & Analytics** — Sales metrics, conversion rates, product scoring, monthly trends, and rep performance
- **Feedback Management** — Collect and track feedback from sales reps and call summaries with phase/outcome tracking
- **Meeting Management** — Log and classify sales calls and rep interviews
- **Team Management** — Invite members by email, assign roles (Owner, Product, Sales), and manage access levels
- **Surveys & Email Campaigns** — Create surveys and send custom HTML emails in batch
- **Sequences** — Configure sales rep sequences with rules and frequency settings
- **AI Assistant** — Conversational AI (Gemini 2.5 Flash via LangGraph) for platform Q&A and sales insights

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Redux Toolkit, React Router |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Auth | Firebase Authentication + Firebase Admin SDK |
| Email | Nodemailer (Gmail SMTP) |
| AI Agent | Python, FastAPI, LangGraph, Google Gemini 2.5 Flash |

---

## Project Structure

```
coleren-app/
├── coleren-frontend/     # React/Vite SPA
├── coleren-backend/      # Node.js/Express REST API
└── ai-agent/             # Python FastAPI AI service
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB instance (local or Atlas)
- Firebase project
- Google AI API key (Gemini)
- Gmail account with an app password

---

### Backend

```bash
cd coleren-backend
npm install
npm run dev
```

Runs on `http://localhost:5050`.

Create `coleren-backend/.env`:

```env
PORT=5050
MONGO_URI=your_mongodb_connection_string
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key"
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

---

### Frontend

```bash
cd coleren-frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`.

Create `coleren-frontend/.env`:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_BASE=http://localhost:5050
```

---

### AI Agent

```bash
cd ai-agent
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python api.py
```

Runs on `http://localhost:8000`.

Create `ai-agent/.env`:

```env
GOOGLE_API_KEY=your_google_ai_api_key
```

---

## Available Scripts

### Backend
| Command | Description |
|---|---|
| `npm run dev` | Start with Nodemon (hot reload) |
| `npm start` | Start in production mode |

### Frontend
| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Data Models

| Model | Description |
|---|---|
| `User` | Firebase UID, name, email, auth method |
| `Profile` | Job title, team size, subscription, onboarding state |
| `Team` | Team name and owner reference |
| `TeamMember` | Role, access level, invite token |
| `Feedback` | Client, rep, phase, outcome, positives/negatives |
| `Meeting` | Rep name, company, product, meeting type |
| `Lead` | Client, rep, status, outcome |
| `Product` | Name, market-fit score, competitor score |

---

## Architecture Overview

```
Browser (React)
  │
  ├─── Firebase Auth ──────────────► Firebase (Google)
  │
  ├─── REST API ───────────────────► Express Backend
  │                                    │
  │                                    ├── MongoDB
  │                                    └── Gmail SMTP
  │
  └─── AI Chat ────────────────────► FastAPI Agent
                                       └── Gemini 2.5 Flash
```

Authentication flow: The frontend obtains a Firebase ID token and sends it in the `Authorization` header. The backend verifies the token using Firebase Admin SDK before processing any request.
