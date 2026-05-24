# 🚀 Nexus Task Manager — Deployment Guide

This guide details the step-by-step instructions to deploy your full-stack Task Manager application (React frontend + Node/Express backend + MongoDB Atlas + Paystack + Socket.io) and make it live.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Database: MongoDB Atlas](#2-database-mongodb-atlas)
3. [Backend Deployment: Render](#3-backend-deployment-render)
4. [Frontend Deployment: Vercel / Netlify](#4-frontend-deployment-vercel--netlify)
5. [Paystack: Switching to Live Mode](#5-paystack-switching-to-live-mode)
6. [Post-Deployment Checklist](#6-post-deployment-checklist)

---

## 1. Prerequisites

1. Ensure your codebase is pushed to a remote repository on **GitHub** (private or public).
   - *Recommended folder structure:* You can push the entire folder containing `frontend/` and `backend/` subdirectories.
2. Sign up for accounts on the following platforms (all have generous free tiers):
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Database - *already configured*)
   - [Render](https://render.com) (Backend API Hosting)
   - [Vercel](https://vercel.com) or [Netlify](https://netlify.com) (Frontend React Hosting)
   - [Paystack](https://paystack.com) (Payment Gateway)

---

## 2. Database: MongoDB Atlas

Since you are already using a MongoDB Atlas connection string (`mongodb+srv://...`), your database is already hosted in the cloud. You only need to ensure the database accepts connections from your production backend:

1. Log in to **MongoDB Atlas**.
2. Go to **Network Access** (under the Security tab on the left).
3. Click **Add IP Address**.
4. Select **Allow Access from Anywhere** (adds `0.0.0.0/0`) or whitelist your production backend's static IP if you use a paid proxy.
5. Click **Confirm**.

---

## 3. Backend Deployment: Render

Render is excellent for hosting Node.js + Socket.io apps. Follow these steps:

1. Log in to [Render](https://render.com) and click **New +** → **Web Service**.
2. Connect your **GitHub repository**.
3. Configure the service settings:
   - **Name:** `nexus-backend` (or similar)
   - **Region:** Choose the region closest to your target audience.
   - **Branch:** `main` (or your active branch)
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free` (or any paid tier for 24/7 uptime without spin-downs)
4. Add the following **Environment Variables** under the "Environment" tab:

   > **IMPORTANT:** Copy the actual values from your local `.env` file or from the respective dashboards. Do NOT paste real keys in public documents.

   | Key | Where to find the value |
   | :--- | :--- |
   | `PORT` | Set to `10000` |
   | `MONGO_URI` | Copy from your MongoDB Atlas → Connect → Drivers string |
   | `JWT_SECRET` | Use any long random string (min 32 chars) |
   | `EMAIL_USER` | Your Gmail address |
   | `EMAIL_PASS` | Your 16-character Gmail App Password (from Google Account settings) |
   | `PAYSTACK_SECRET_KEY` | Copy from Paystack Dashboard → Settings → API Keys (Secret Key) |
   | `PAYSTACK_PUBLIC_KEY` | Copy from Paystack Dashboard → Settings → API Keys (Public Key) |
   | `FRONTEND_URL` | Your deployed Vercel/Netlify frontend URL |

5. Click **Deploy Web Service**.
6. Once deployed, note down your backend's live URL (e.g., `https://nexus-backend.onrender.com`).

---

## 4. Frontend Deployment: Vercel

Vercel is the easiest place to host your React frontend.

1. Log in to [Vercel](https://vercel.com) and click **Add New** → **Project**.
2. Connect your **GitHub repository** and import it.
3. Configure the build settings:
   - **Project Name:** `nexus-taskmanager`
   - **Framework Preset:** `Create React App`
   - **Root Directory:** `frontend`
4. Expand **Environment Variables** and add:

   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `REACT_APP_API_URL` | `https://your-backend-url.onrender.com/api` | Your Render backend URL + `/api` |
   | `REACT_APP_SOCKET_URL` | `https://your-backend-url.onrender.com` | Your Render backend URL (no `/api`) |

5. Click **Deploy**.
6. Once built, Vercel will give you a live domain (e.g., `https://nexus-taskmanager.vercel.app`).
7. **Important:** Go back to your Render Web Service settings and update the `FRONTEND_URL` environment variable to match this live Vercel domain!

---

## 5. Paystack: Switching to Live Mode

To accept real payments:

1. Log in to your **Paystack Dashboard**.
2. Ensure you toggle the dashboard from **Test Mode** to **Live Mode** (you must submit your compliance documents to activate Live Mode).
3. Go to **Settings** → **API Keys & Webhooks**.
4. In the **Webhooks** section:
   - Set the URL to: `https://your-backend-url.onrender.com/api/subscriptions/webhook`
   - Ensure you toggle to save this URL for both **Test** and **Live** events.
5. In the **API Keys** section:
   - Copy your live **Secret Key** and **Public Key** from the Paystack dashboard.
   - Paste these keys into your Render environment variables (`PAYSTACK_SECRET_KEY` and `PAYSTACK_PUBLIC_KEY`).

---

## 6. Post-Deployment Checklist

- [ ] **Auth Check:** Sign up a new user, check if you receive the verification OTP email, verify it, and log in.
- [ ] **Role Guard Check:** Ensure normal users are routed to `/user-dashboard` and managers to `/manager-dashboard`.
- [ ] **Socket.io Check:** Open the dashboard in two different browsers (or incognito). Assign a task to a user and check if the real-time notification banner appears instantly.
- [ ] **Paystack Subscription Check:** Perform a trial subscription upgrade to verify redirection to Paystack checkout, payment verification, and automatic redirection to the dashboard as a premium user.
- [ ] **Task Creation Check:** Verify that premium users can create tasks, while free users are locked.
