# Centralized API Configuration Guide

This document explains how to manage and update the API connection settings for the Asset Ticketing System using the new centralized configuration system.

---

## 1. Overview
Previously, the API Base URL was hardcoded in every component (Login, Dashboard, etc.). I have refactored the entire frontend to use a single configuration file. This allows you to switch between **Localhost**, **Ubuntu**, and **AWS** environments by changing just **one line of code**.

---

## 2. The Configuration File
The central configuration file is located at:
`frontend/src/config.js`

### Current Content:
```javascript
export const API_BASE_URL = 'http://localhost:5000/api'; 
```

---

## 3. How to Switch Environments

### A. Local Development (Current)
If you are running the project on your laptop for testing:
```javascript
export const API_BASE_URL = 'http://localhost:5000/api';
```

### B. Ubuntu Local Server (Nginx)
If you are deploying to your company's Ubuntu server using the Nginx proxy method:
```javascript
export const API_BASE_URL = '/api'; 
```
*Note: Using `/api` is the professional way to handle proxying as it automatically uses the server's IP.*

### C. Manual Server IP (No Nginx)
If you want to point directly to a specific server IP (e.g., your office server):
```javascript
export const API_BASE_URL = 'http://192.168.0.55:5000/api';
```

---

## 4. Technical Implementation
- **Constant**: `API_BASE_URL` is exported from `config.js`.
- **Usage**: All components now import this constant and use template literals for requests:
  ```javascript
  import { API_BASE_URL } from '../config';
  
  // Example call:
  const res = await axios.post(`${API_BASE_URL}/auth/login`, data);
  ```
- **Axios Client**: I have also provided a pre-configured Axios instance in `src/api/apiClient.js` that uses this base URL and automatically handles the Authorization token.

---

## 5. Deployment Checklist
1. Open `frontend/src/config.js`.
2. Set the `API_BASE_URL` for your target environment.
3. Run `npm run build` in the `frontend` directory.
4. Deploy the generated `dist` folder to your server.
