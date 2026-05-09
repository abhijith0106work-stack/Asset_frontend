# AWS Deployment Guide - Asset Ticketing System

This guide outlines the professional steps to deploy your system on Amazon Web Services (AWS) using industry best practices.

---

## 1. Database Setup (MongoDB Atlas)
For AWS deployments, it is highly recommended to use **MongoDB Atlas** (Managed MongoDB) instead of hosting it yourself on EC2.

1.  **Create a Cluster**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free or paid cluster.
2.  **Network Access**: Add `0.0.0.0/0` to the IP Access List (or specifically your AWS resource IPs).
3.  **Database Name**: You can name it `asset_ticketing_prod`.
4.  **Connection String**: Copy your connection string. It will look like this:
    `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/asset_ticketing_prod?retryWrites=true&w=majority`

---

## 2. Backend Deployment (AWS App Runner or EC2)

### Option A: AWS App Runner (Easiest)
1.  Connect your **Asset_backend** GitHub repository.
2.  Set the **Start Command** to `npm start`.
3.  Add **Environment Variables** (see section 4 below).
4.  App Runner will provide a URL like `https://abc123xyz.us-east-1.awsapprunner.com`.

### Option B: AWS EC2 (Virtual Server)
1.  Launch a **Linux (Ubuntu)** or **Windows Server** instance.
2.  Install **Node.js** and **PM2**.
3.  Clone the repo and run `pm2 start server.js`.

---

## 3. Frontend Deployment (AWS S3 + CloudFront)

1.  **Build Locally**: Run `npm run build` in the `frontend` folder.
2.  **Upload to S3**: Create an S3 bucket and upload the contents of the `dist` folder.
3.  **Static Website Hosting**: Enable this in the S3 bucket settings.
4.  **CloudFront (Recommended)**: Create a CloudFront distribution pointing to your S3 bucket to enable **HTTPS** and faster global access.

---

## 4. Production Environment Variables (.env)
When deploying to AWS, you must configure these variables in the **AWS Console** (App Runner Environment section or EC2 `.env` file):

| Variable | Value for AWS | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | The port your backend listens on. |
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string. |
| `JWT_SECRET` | `[Your_Strong_Random_String]` | A secure key for user sessions. |
| `NODE_ENV` | `production` | Enables production optimizations. |

---

## 5. Critical AWS Adjustments

### CORS Configuration
Your backend must allow requests from your AWS Frontend URL. I have already set the backend to allow all origins (`cors()`), which works for AWS, but for maximum security, you should update `server.js` later to only allow your specific CloudFront/S3 URL.

### Mobile App Update
Once your AWS Backend is live, you **must** update the `client.js` in your mobile app with the new AWS URL:
```javascript
// mobile-app/src/api/client.js
baseURL: 'https://your-aws-backend-url.com/api'
```

---

## 6. Deployment Checklist
- [ ] MongoDB Atlas Cluster created and "Network Access" configured.
- [ ] Backend deployed to App Runner/EC2.
- [ ] Frontend built and uploaded to S3.
- [ ] Mobile App updated with the new AWS API URL.
- [ ] **Firewall**: Ensure AWS Security Groups allow traffic on port 5000 (if using EC2).
