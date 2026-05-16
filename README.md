# JobSphere — AI-Powered Job Portal Platform
## Live: https://jobsphere-pi.vercel.app
JobSphere is a full-stack AI-powered job portal platform built to connect job seekers and employers through intelligent recruitment workflows, resume analysis, real-time communication, and advanced hiring tools. The platform combines modern web technologies with Generative AI to create a scalable recruitment ecosystem similar to LinkedIn, Indeed, and modern AI recruitment systems.

The project supports secure authentication, role-based access control, resume parsing, AI-powered job matching, employer-side resume analysis, real-time notifications, analytics, interview question generation, and persistent AI chat features.

---

# Live Features

## Authentication & Authorization

* Secure authentication using [Clerk Authentication]
* Role-based onboarding system
* Separate dashboards for:

  * Job Seekers
  * Employers
  * Admins
* Protected frontend and backend routes
* RBAC (Role-Based Access Control)

---

# Employer Features

## Employer Dashboard

* Create job postings
* Update jobs
* Delete jobs
* Manage all posted jobs
* View applicants for specific jobs only

## Applicant Management

* View applicants who applied to a specific job
* Access applicant profile details
* View uploaded resume directly from Cloudinary
* Accept or reject applications
* Real-time applicant updates

## AI Resume Analysis

Employers can:

* Analyze applicant resumes using Gemini AI
* Get AI-generated:

  * Match percentage
  * Candidate rating
  * Skill gap analysis
  * Hiring recommendations
  * Resume insights
* Chat with AI regarding a specific applicant and job

## AI Interview Question Generator

* Generate interview questions automatically
* Questions generated according to:

  * Resume
  * Skills
  * Applied job
  * Experience level

---

# Job Seeker Features

## Seeker Dashboard

* Browse all jobs
* Advanced search and filtering
* Apply directly to jobs
* Prevent duplicate applications
* View application history
* Track application status:

  * Pending
  * Accepted
  * Rejected

## Resume Management System

* Upload resume once
* Resume stored separately in dedicated Resume collection
* Resume PDF uploaded to [Cloudinary]
* Resume text extracted using:

  * multer
  * pdf-parse
  * streamifier
* Resume replacement/update support

## AI Job Match System

Using Gemini AI:

* Matches resume against available jobs
* Returns:

  * Top matched jobs
  * Match percentage
  * AI recommendations
  * Skill gap analysis
* Direct apply option from AI results

## AI Career Assistant Chat

Persistent AI chat system with:

* Resume-aware context
* Career guidance
* Resume suggestions
* Job recommendations
* Interview preparation
* Chat history stored in MongoDB

---

# AI Integration

Integrated with Google Gemini models:

* Gemini 3 Flash Preview
* Gemini 3.1 Flash Lite Preview
* Automatic fallback architecture for model reliability

AI Features Include:

* Job matching
* Resume analysis
* Career assistant chat
* Interview question generation
* Employer-side candidate analysis

---

# Notification System

Persistent notification system with:

* MongoDB-based notifications
* Real-time Socket.io updates
* Employer notifications
* Seeker notifications
* Application status alerts

---

# Email Notification System

Integrated with [Resend] for transactional emails:

* Application updates
* Acceptance/rejection notifications
* Employer interactions
* Platform alerts

---

# Real-Time Features

Implemented using [Socket.IO]:

* Live notifications
* Real-time application updates
* Instant employer/seeker communication events

---

# Analytics Dashboard

Analytics system for:

* Total jobs
* Total applicants
* Application statistics
* User activity
* Hiring trends
* Platform insights

---

# Tech Stack

## Frontend

* React.js
* Vite
* Redux Toolkit
* Tailwind CSS
* Clerk Authentication
* Socket.io Client

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.io
* Multer
* Cloudinary
* pdf-parse
* streamifier

## AI & APIs

* Google Gemini API
* Resend API

---

# Advanced Architecture

## Database Design

Separate collections for:

* Users
* Jobs
* Applications
* Resumes
* Profiles
* Notifications
* AI Chats

## Scalable Resume System

Applications store:

* resumeId
* resumeUrl

while full resume text remains centralized in Resume collection for:

* AI processing
* analytics
* future RAG integration

---

# Search & Filtering

Advanced search system inspired by Indeed:

* Keyword search
* Dynamic filters
* Debounced search
* Redux-based filter state management

---

# Deployment

## Frontend

Deployed on:

[Vercel]

## Backend

Deployed on:

[Render]

## Database

Hosted on:

[MongoDB Atlas]

---

# Key Highlights

* Full-stack production-ready SaaS architecture
* AI-powered recruitment workflows
* Real-time communication system
* Resume parsing and intelligent analysis
* Persistent AI memory/chat system
* Scalable MongoDB schema design
* Modern responsive UI
* Cloud deployment architecture
* Enterprise-style role management

---

# Future Enhancements

* Full RAG implementation
* AI-powered recruiter recommendations
* Video interview integration
* AI-generated resume builder
* Team collaboration tools
* Advanced recruiter analytics
* Payment/subscription system
* Company verification system

---

# Developed By

S M Huzaifa Riaz

Built as an advanced AI-powered recruitment platform demonstrating modern full-stack development, scalable backend architecture, real-time systems, and Generative AI integration.
