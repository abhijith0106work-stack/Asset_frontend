# Asset Ticketing System - Technical Documentation

This document provides a comprehensive overview of the Asset Ticketing System, covering its architecture, features, and technical stack across the Backend, Frontend, and Mobile applications.

---

## 1. System Overview
The Asset Ticketing System is a multi-company platform designed to track corporate assets (IT and Stationary), manage their lifecycle, and provide a streamlined ticketing system for reporting and resolving issues.

### Key Capabilities:
- **Asset Lifecycle Management**: Tracking from purchase to retirement.
- **QR Code Integration**: Scan-to-report issue and identification via QR labels.
- **Multi-Company Architecture**: Data isolation and branding for different organizations.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Super Admins, Admins, and Users.

---

## 2. Backend (Core Engine)
The backend is a RESTful API built with **Node.js** and **Express**, using **MongoDB** as the database.

### Tech Stack:
- **Language**: JavaScript (Node.js)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt for password hashing
- **File Handling**: Multer for image and document uploads

### Data Models:
1. **User**: Stores employee profiles, roles, and company affiliations.
2. **Asset**: Comprehensive tracking for items including serial numbers, MAC addresses, location, and images. Supports IT and Stationary subtypes.
3. **Ticket**: Manages issue reports, linking them to specific assets and users. Tracks status and priority.
4. **Company**: Stores company-specific data, including branding logos for QR labels.
5. **ActivityLog**: Persistent logging of all major actions (Logins, Asset updates, Ticket changes) for auditing.

---

## 3. Web Frontend (Management Dashboard)
The web application is a modern SPA (Single Page Application) built with **React** and **Vite**, featuring a premium dark-themed dashboard.

### Tech Stack:
- **Library**: React 18
- **Styling**: Vanilla CSS with modern Glassmorphism aesthetics
- **Routing**: React Router DOM
- **API Client**: Axios

### Key Features:
- **Dynamic Dashboard**: Overview of system health, recent activity, and asset stats.
- **Asset Management**: Full CRUD (Create, Read, Update, Delete) operations for assets with image previews.
- **QR Label Generator**: Generates and downloads print-ready QR labels containing company logos, asset names, and unique IDs.
- **Ticketing Center**: Role-filtered ticket management with attachment support and remark tracking.
- **User & Company Management**: Administrative tools for managing the organizational hierarchy.

---

## 4. Mobile Application (Employee Portal)
The mobile app is built with **React Native**, providing on-the-go access for employees and admins.

### Tech Stack:
- **Framework**: React Native
- **Storage**: AsyncStorage for local session management
- **Scanner**: VisionCamera (or equivalent) for QR code scanning
- **Platform**: Cross-platform (Android-optimized build provided)

### Key Features:
- **Instant QR Scanner**: Allows admins to identify assets instantly and users to report issues by scanning a physical label.
- **Issue Reporting**: Simple form to raise tickets directly from a mobile device, automatically linking the asset.
- **Mobile Dashboard**: Role-specific view showing assigned assets and open tickets.

---

## 5. Typical Workflows

### Asset Onboarding:
1. **Admin** creates an asset in the Web Dashboard.
2. **System** generates a unique ID and QR code.
3. **Admin** prints the QR label and attaches it to the physical item.

### Issue Reporting:
1. **Employee** scans the QR code on an asset using the **Mobile App**.
2. **Mobile App** opens the "Report Issue" form with asset details pre-filled.
3. **Admin** receives the ticket on the **Web Dashboard** and assigns it to a technician.

---

## 6. Local Server Deployment Configuration
- **Server IP**: 192.168.0.55 (Configured for Local Office Network)
- **Database**: Local MongoDB service
- **Process Management**: PM2 (Process Manager 2) for background execution and auto-restart on Windows Server.
