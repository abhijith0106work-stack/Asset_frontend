# Ubuntu Local Server Deployment - Asset Ticketing System

This guide outlines the steps to deploy the system on a local Ubuntu Linux server for internal company use.

---

## 1. System Preparation
Update your Ubuntu server and install necessary tools:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl nginx mongodb-server
```

### Install Node.js (via NVM)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
```

---

## 2. Backend Deployment (Node.js)

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/abhijith0106work-stack/Asset_backend.git
    cd Asset_backend
    npm install
    ```
2.  **Configure Environment**:
    Create a `.env` file:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/asset-ticketing
    JWT_SECRET=your_secure_random_key
    NODE_ENV=production
    ```
3.  **Process Management (PM2)**:
    ```bash
    npm install -g pm2
    pm2 start server.js --name "asset-backend"
    pm2 save
    pm2 startup  # Follow the instructions printed by this command
    ```

---

## 3. Frontend Deployment (Nginx)

1.  **Build the Project**:
    On your development machine or the server:
    ```bash
    cd Asset_frontend
    npm install
    npm run build
    ```
2.  **Move to Web Root**:
    ```bash
    sudo mkdir -p /var/www/asset-system
    sudo cp -r dist/* /var/www/asset-system/
    ```
3.  **Configure Nginx**:
    Create a new site configuration: `sudo nano /etc/nginx/sites-available/asset-system`
    ```nginx
    server {
        listen 80;
        server_name 192.168.0.55; # Replace with your Ubuntu Server IP

        location / {
            root /var/www/asset-system;
            index index.html;
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
4.  **Enable and Restart**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/asset-system /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

---

## 4. Firewall & Networking
Ensure the Ubuntu firewall allows web traffic:
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow 5000
sudo ufw enable
```

---

## 5. Mobile App Configuration
Update `mobile-app/src/api/client.js` to point to your Ubuntu server's local IP:
```javascript
baseURL: 'http://192.168.0.55/api' # Nginx handles the /api prefix
```

---

## 6. Files to Change (Summary)
- **Backend**: `.env` (Set `MONGO_URI` and `JWT_SECRET`).
- **Frontend**: `src/api/` calls (Ensure they use the relative path `/api` or the server IP).
- **Mobile**: `src/api/client.js` (Set `baseURL` to the server IP).
- **Nginx**: `/etc/nginx/sites-available/asset-system` (Set `server_name` to your server IP).
