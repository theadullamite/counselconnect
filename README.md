# CounselConnect

### Connecting people with professional counsellors for meaningful support and personal growth.

CounselConnect is a web platform designed to make it easier for clients to discover counsellors, book counselling sessions, manage appointments, and communicate securely with their counsellors.

 **Live Demo:** https://counselconnect-bice.vercel.app/

---

## What is CounselConnect?

Finding the right counsellor and managing counselling sessions shouldn't have to be complicated.

**CounselConnect** provides a simple digital experience where clients can:

- 🔎 Discover counsellors
- 👤 View counsellor profiles
- 📅 Check availability
- 🕐 Book available counselling sessions
- 📋 Manage appointments
- 💬 Communicate with counsellors
- 👤 Manage their profile

Counsellors can also manage their professional profiles, availability, appointments, and client communication from their dashboard.

---

## 🚀 Features

### 👥 Client Experience

- Client registration and authentication
- Role-based client dashboard
- Counsellor directory
- Counsellor profiles
- Real-time availability-based booking
- 60-minute appointment slots
- Appointment history
- Appointment cancellation
- Client profile management
- Secure counsellor messaging

### 🧑‍💼 Counsellor Experience

- Counsellor registration and authentication
- Role-based counsellor dashboard
- Professional profile management
- Specialty and experience information
- Availability management
- Appointment management
- Confirm, cancel, and complete sessions
- Session history
- Secure client messaging

### 🔐 Security

CounselConnect uses **Supabase Row Level Security (RLS)** to control access to sensitive application data.

The application includes protected access for:

- User profiles
- Appointments
- Availability
- Conversations
- Messages

Users can only perform actions permitted by their role and relationship to the data.

---

## 💬 Secure Messaging

CounselConnect includes a private messaging system that allows clients and counsellors to communicate through their appointment relationship.

Messages are associated with conversations between:

**Client ↔ Counsellor**

and access is protected through database-level security policies.



## 🛠️ Tech Stack

### Frontend

- ⚛️ React
- ⚡ Vite
- 🧭 React Router
- 🎨 CSS

### Backend & Database

- 🟩 Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)

### Deployment

- ▲ Vercel
- 🐙 GitHub

## Future Improvements
- Password recovery / Forgot - Password
- Email verification
- Appointment reminders
- Rescheduling
Enhanced real-time messaging
Profile photographs
Advanced counsellor search and filtering
Improved notifications
Payment integration
Admin dashboard
Help Centre
Contact/support functionality
Additional accessibility improvements

## 🏗️ Application Architecture

CounselConnect
│
├── Public Experience
│   ├── Home
│   ├── About
│   ├── Counsellor Directory
│   └── Counsellor Profiles
│
├── Authentication
│   ├── Register
│   └── Login
│
├── Client Experience
│   ├── Client Dashboard
│   ├── Client Profile
│   ├── Appointments
│   └── Chat
│
├── Counsellor Experience
│   ├── Counsellor Dashboard
│   ├── Professional Profile
│   ├── Availability
│   ├── Sessions
│   └── Chat
│
└── Supabase
    ├── Authentication
    ├── Profiles
    ├── Appointments
    ├── Availability
    ├── Conversations
    └── Messages
