# Advertisement.lk

# Classified Advertisement Platform

## 1. Technology Stack

**Frontend:**
- React.js
- Redux (for state management)
- Tailwind CSS / Material-UI

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB with Mongoose ORM

**Authentication:**
- JWT (JSON Web Tokens)
- Google OAuth

**Storage:**
- Cloudinary / AWS S3 (for image & video uploads)

**Payment Integration:**
- Stripe / PayPal (for ad boosting)

**Hosting & Deployment:**
- Frontend: Vercel / Netlify
- Backend: AWS / Render / DigitalOcean
- Database: MongoDB Atlas

---

## 2. System Architecture

**Frontend (React.js):**  
UI for buyers, sellers, and admins.

**Backend (Node.js + Express.js):**  
Handles authentication, ad management, user management, and payment processing.

**Database (MongoDB):**  
Stores user accounts, advertisements, and transaction data.

**Cloud Storage (Cloudinary / AWS S3):**  
Handles image and video uploads.

**Authentication (JWT + OAuth):**  
Manages secure login, registration, and password recovery.

---

## 3. Implementation Steps

### Step 1: Project Setup
- Initialize a GitHub repository.
- Set up frontend (React + Vite/Create React App) and backend (Express.js + Node.js) in separate directories.
- Configure ESLint, Prettier, and Husky for code formatting.
- Set up MongoDB database (MongoDB Atlas/local instance).

### Step 2: User Authentication
- Implement JWT-based authentication (register, login, logout, password reset).
- Add Google OAuth authentication.
- Secure protected routes for buyers, sellers, and admins.

### Step 3: Customer Pages
- Home page
- About us
- Contact us
- Advertisement categories page
- Advertisement listing page
- Advertisement single view page
- Sign in
- Sign up
- Post Advertisement
- My advertisements
- Favorite advertisements
- Settings
- Compare advertisements
- Packages
- Package buying page
- Bought package details

### Step 4: Admin Pages
- Admin Login
- Admin dashboard
- Manage advertisement categories
- Manage packages
- Profile

### Step 5: Customer Functions
- Sign in
- Sign up
- Sign out
- Home page data loading
- Load advertisement categories
- List advertisements
- Advanced search
- Load single view of advertisement
- Load advertisements of the same advertiser
- Similar advertisements load
- Add new post
- List my advertisements
- Delete advertisements
- Update advertisements
- Add advertisement to favorite
- Remove advertisements from favorite
- Load details to settings page
- Update settings
- Add advertisements to compare
- Remove advertisements from compare
- Compare advertisements
- Post boosting
- Buy package
- View package details
- WhatsApp integration

### Step 6: Admin Functions
- Sign in
- Sign up
- Sign out
- Dashboard
- View advertisement categories
- Add new advertisement category
- Update advertisement category
- Disable/Delete advertisement category
- Add new package
- Update packages
- Disable/delete packages
- View package
- View package orders

### Step 7: Search & Filtering
- Implement keyword-based search.
- Add category-based filtering.
- Enable location-based filtering.
- Implement sorting (newest, price high to low, etc.).

### Step 8: Ad Boosting & Payments
- Set ad visibility duration (default: 3 days free, then hidden).
- Implement Stripe/PayPal payment gateway for ad boosting.
- Enable profile boosting for higher visibility.
- Add a manual social media promotion request feature.

### Step 9: User Dashboards
- **Buyer Dashboard:** View saved ads.
- **Seller Dashboard:** Manage ads and purchased packages.
- **Admin Panel:** Moderate ads, approve/suspend users, remove inappropriate content.

### Step 10: Additional Features
- Implement blog section for expert insights.
- Add a contact form and newsletter subscription.

### Step 11: Testing & Optimization
- Perform unit tests (Jest, Mocha, Chai).
- Conduct integration testing for API endpoints.
- Optimize performance and security (rate limiting, CORS, helmet, etc.).

### Step 12: Deployment
- Deploy frontend on Vercel/Netlify.
- Deploy backend on AWS/Render/DigitalOcean.
- Host database on MongoDB Atlas.

### Step 13: Maintenance & Updates
- Monitor logs and analytics.
- Release updates and fix bugs.
- Improve UX/UI based on user feedback.

---

## 4. API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/reset-password` - Password reset

### Ad Management
- `POST /api/ads` - Create an ad (seller only)
- `GET /api/ads` - Fetch all ads
- `GET /api/ads/:id` - Fetch a specific ad
- `PUT /api/ads/:id` - Update an ad (seller only)
- `DELETE /api/ads/:id` - Delete an ad (seller only)

### Search & Filtering
- `GET /api/ads?search=keyword` - Search ads by keyword
- `GET /api/ads?category=xyz` - Filter ads by category
- `GET /api/ads?location=xyz` - Filter ads by location

### Ad Boosting & Payments
- `POST /api/payments/boost-ad` - Purchase ad boosting package
- `POST /api/payments/profile-boost` - Purchase profile boost

### Admin Panel
- `GET /api/admin/users` - Manage users
- `PUT /api/admin/users/:id` - Approve/suspend user
- `DELETE /api/admin/users/:id` - Remove user
- `DELETE /api/admin/ads/:id` - Remove ad

### Blog & Contact
- `POST /api/blogs` - Add new blog post
- `GET /api/blogs` - Fetch all blog posts
- `POST /api/contact` - Submit contact form

---

## 5. Conclusion

This document outlines the technical architecture and development steps for the Classified Advertisement Platform using the MERN stack. By following these steps, we ensure a scalable, secure, and user-friendly marketplace for buyers and sellers.
