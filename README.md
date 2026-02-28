# Earnings Analyzer 🔬

A research portal that analyzes earnings call transcripts and management commentary using Gemini AI. Upload a PDF and get a structured summary instantly.

---

## Folder Structure

```
earnings-analyzer/
├── frontend/          # Next.js app
├── backend/           # FastAPI app
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have these installed on your machine:

- Node.js
- Python 3.10+
- Tesseract OCR → [Download here](https://github.com/UB-Mannheim/tesseract/wiki)
- Poppler → [Download here](https://github.com/oschwartz10612/poppler-windows/releases/) (Windows)

---

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> Get your free Gemini API key from [Google AI Studio](https://aistudio.google.com)

Start the backend:

```bash
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## Deployment

- **Backend** → [Render](https://render.com) — set root directory to `backend` and add `GEMINI_API_KEY` in environment variables
- **Frontend** → [Vercel](https://vercel.com) — set root directory to `frontend` and add `NEXT_PUBLIC_API_URL` pointing to your Render backend URL

---

## Limitations

- PDF max size: 10MB
- OCR on scanned PDFs may be slow on free tier
- Render free tier spins down after 15 mins of inactivity — first request may take 30-50 seconds
