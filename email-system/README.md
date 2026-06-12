# Gmail SMTP & Nodemailer Send System Guide

This is a complete, production-ready, security-hardened email notification system using **Node.js, Express, and Nodemailer** with **Gmail SMTP App Password authentication**.

---

## Folder Structure

```text
email-system/
├── public/
│   └── index.html      # Responsive Frontend HTML Form
├── .env                # Secret Environment Variables
├── package.json        # Project Manifest & NPM Scripts
├── README.md           # Step-by-Step System Documentation
└── server.js           # Express Backend Server (Nodemailer setup & input validation)
```

---

## 1. How to Install Dependencies

To set up and run this email sending system locally:

1. Open your terminal and navigate to the project directory:
   ```bash
   cd email-system
   ```

2. Run the NPM install command to install the required packages:
   ```bash
   npm install
   ```

This installs:
* **express**: High-performance HTTP server backend.
* **nodemailer**: Direct connection client for SMTP email dispatch.
* **dotenv**: Loads secret credentials from a `.env` file into process memory.
* **cors**: Safely enables cross-origin resource sharing.

---

## 2. Generating your Gmail App Password

Google no longer supports "Less Secure Apps" authentication using your standard Gmail login password due to security risks. To connect Nodemailer, you must generate a **Gmail App Password**.

### Step-by-Step App Password Generation:
1. Log into your [Google Account Console](https://myaccount.google.com/).
2. Select **Security** from the left navigation panel.
3. Under *How you sign in to Google*, verify that **2-Step Verification** is enabled. (This is required to generate App Passwords).
4. Click on **2-Step Verification**.
5. Scroll down to the bottom and click on **App Passwords**.
6. Enter an identification name for this application (e.g., `NodeMailer Service`).
7. Click **Create**.
8. Copy the generated **16-character code** (displayed in a yellow/blue popup box). *Do not include spaces when adding it to your `.env` config.*

---

## 3. Placement of Credentials

Create a `.env` file in the root of the `email-system` directory and enter your credentials.

> [!WARNING]
> Never commit your `.env` file containing secret keys or App Passwords to GitHub or source control. Always add `.env` to your `.gitignore` file.

Inside your `email-system/.env` file:
```env
# Server Configuration
PORT=5000

# Gmail SMTP Configuration
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=your16characterapppassword
```

---

## 4. Difference: Gmail SMTP vs. Specialized Email APIs (e.g., Resend, SendGrid)

| Feature | Gmail SMTP + Nodemailer | Dedicated Email APIs (Resend, SendGrid) |
| :--- | :--- | :--- |
| **Setup Cost** | Free (integrated inside your personal or workspace Gmail) | Free tiers available, paid scaling packages |
| **Sending Limits** | 500 emails/day (personal), 2,000/day (Google Workspace) | Scale to millions/day |
| **IP Reputation** | High (utilizes Gmail's shared premium sending IPs) | Variable (shared pools can be blacklisted; paid dedicated IPs) |
| **Domain Setup** | None required (uses your @gmail.com address) | Requires configuring DNS records (SPF, DKIM, DMARC) |
| **Best Used For** | Small utilities, contact forms, testing, personal alerts | High-volume SaaS apps, transactional emails, newsletters |

---

## 5. Gmail Sending Limits & Security Precautions

* **Daily Limits**: Google limits sending to **500 emails/day** for standard accounts and **2,000 emails/day** for Google Workspace accounts.
* **Block Risks**: If you send spam or trigger multiple bounces, Google will temporarily block your SMTP interface (usually for 24 hours).
* **Why App Passwords?**: An App Password is a unique token that bypasses Two-Factor authentication but **only grants access to send mail**. If compromised, the attacker cannot access your drive, account settings, or change your passwords. You can revoke it instantly in your Google Account security panel.

---

## 6. How to Run Locally

1. Launch your dev or start script using npm:
   ```bash
   npm run dev
   ```
2. Open your web browser and navigate to:
   ```text
   http://localhost:5000
   ```
3. Type an email address and click **Send Email**. 
4. Check the backend node terminal for success logs and look in your email inbox!

---

## 7. Production Deployment Recommendations

When deploying this system to live hosting (like Vercel, Render, or Heroku):

1. **Environment Variables**: Configure your host's Dashboard Settings (under *Environment Variables* or *Config Vars*) with `EMAIL_USER` and `EMAIL_PASS`. Do not upload `.env` files.
2. **Secure HTTPS CORS**: Configure the CORS middleware in `server.js` to whitelist your frontend domain only, preventing other sites from sending API requests to your backend:
   ```javascript
   app.use(cors({ origin: 'https://yourfrontenddomain.com' }));
   ```
3. **Rate Limiting**: Install and configure `express-rate-limit` to prevent denial-of-service (DoS) attacks or automated script abuse:
   ```javascript
   const rateLimit = require("express-rate-limit");
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 5 // limit each IP to 5 requests per window
   });
   app.use("/send-email", limiter);
   ```
