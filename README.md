# MANYA E-Commerce Client

## Overview
Modern, high-performance e-commerce storefront with a badass UI design. This client application works seamlessly with the MANYA E-Commerce Admin panel to provide a complete shopping experience.

## Features
- Responsive, modern UI with dark mode support
- Smooth animations and transitions using Framer Motion
- Product catalog with filtering and search
- User authentication and account management
- Shopping cart and wishlist functionality
- Checkout process with payment integration
- Order tracking and history
- Product reviews and ratings

## Tech Stack
- React.js
- Firebase (Authentication, Firestore, Storage)
- Tailwind CSS
- Framer Motion
- Swiper
- React Router
- Cloudinary (Image optimization)

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Firebase account
- Cloudinary account

### Installation
1. Clone the repository
```bash
git clone https://github.com/your-username/ecommerce-client.git
cd ecommerce-client
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

REACT_APP_CLOUDINARY_CLOUD_NAME=dsveonbhj
REACT_APP_CLOUDINARY_API_KEY=x1UMZABM4dFVWc8SBvizhBxiovI
REACT_APP_CLOUDINARY_UPLOAD_PRESET=Ecommerce website
```

4. Start the development server
```bash
npm start
# or
yarn start
```

### Building for Production
```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory.

## Deployment
The application can be deployed to various hosting services:

### Firebase Hosting
1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

2. Login to Firebase
```bash
firebase login
```

3. Initialize Firebase project
```bash
firebase init
```
Select Hosting and follow the prompts.

4. Deploy to Firebase
```bash
firebase deploy
```

### Netlify
1. Create a `netlify.toml` file in the root directory:
```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Deploy using Netlify CLI or connect your GitHub repository to Netlify.

## Integration with Admin Panel
This client application is designed to work with the MANYA E-Commerce Admin panel. The admin panel manages:
- Product catalog
- Orders
- User management
- Content management
- Analytics

Ensure both applications use the same Firebase project for seamless integration.

## Known Issues and Fixes
- If you encounter Swiper component errors, ensure you're using the correct import syntax for Swiper modules
- For Cloudinary image optimization, use the `getOptimizedImageUrl` function with proper parameters
- Avoid nested Link components in React Router to prevent DOM nesting issues
- When using CartContext, reference `cartItems.length` instead of `cart.length`

## License
[MIT](LICENSE)
