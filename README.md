# BudgetWise | Budget Tracker  

BudgetWise is a modern budget-tracking app designed to help users efficiently manage their finances. Built with cutting-edge technologies, it offers a seamless and user-friendly experience for tracking expenses, setting budgets, and gaining insights into financial habits.  

## 🚀 Features  
- 💰 Expense Tracking – Log and categorize your expenses effortlessly.
- 📊 Budget Management – Set monthly budgets and track your spending.
- 🔄 Real-time Updates – Data is updated dynamically using TanStack Query.
- 📸 Media Uploads – Upload profile image via Cloudinary.
- 📂 Export Data – Export transactions as CSV files with Export-to-CSV.
- 🛠 Robust Validation – Ensures data integrity with Zod.
- 📏 Currency Formatting – Uses Intl.NumberFormat and Numeral.js for accurate number formatting.
- 🎨 Modern UI – Styled with Tailwind CSS and ShadCN components.
- 🔐 Authentication – Firebase authentication for secure access.
- 🌎 Deployed on Vercel – Optimized for performance and scalability.  

## 🛠️ Tech Stack  
- Frontend: Next.js 14 (App Router) with TypeScript
- State Management: TanStack Query
- Styling: Tailwind CSS, ShadCN UI
- Validation: Zod
- Database: SQLite (development) → PostgreSQL (production via Neon)
- Data Export: Export-to-CSV
- ORM: Prisma
- Media Management: Cloudinary
- Authentication: Firebase
- Deployment: Vercel
- APIs: RESTful API design

## 📦 Installation  
1. Clone the repository:  
   ```bash
   git clone https://github.com/Mikael-duru/budget-tracker.git
   cd budget-tracker
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:  
   ```env
   # Firebase
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

    # Firebase Admin
    FIREBASE_PROJECT_ID=
    FIREBASE_CLIENT_EMAIL=
    FIREBASE_PRIVATE_KEY=
    
    # Clodinary
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
    CLOUDINARY_API_SECRET=
    CLOUDINARY_API_KEY=
    
    # Neon Postgresql
    DATABASE_URL=
   ```
4. Run database migrations:  
   ```bash
   npx prisma migrate dev --name <commit message>
   ```
5. Run the development server:  
   ```bash
   npm run dev
   ```
   Your app will be available at `http://localhost:3000` in your browser.  
---  
Built with ❤️ by MikaelDuru.  
