# Delivery User Panel

A modern React-based user interface for the delivery application where customers can browse products, manage their cart, place orders, and track deliveries.

## Features

- **User Authentication**: Register, login, and profile management
- **Product Browsing**: Browse products by categories with search and filters
- **Shopping Cart**: Add/remove items, update quantities
- **Order Management**: Place orders, view order history, track deliveries
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **State Management**: Redux Toolkit for efficient state management

## Tech Stack

- **Frontend**: React 19, Redux Toolkit, React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on port 2020

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`:
```
REACT_APP_API_URL=http://localhost:2020/api
REACT_APP_APP_NAME=Delivery App
PORT=3001
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3001`

## Project Structure

```
src/
├── api/                 # API configuration and services
│   ├── services/        # API service functions
│   ├── axios.config.js  # Axios configuration
│   └── endpoints.js     # API endpoints
├── components/          # Reusable components
│   ├── common/          # Common UI components
│   ├── layout/          # Layout components (Header, Footer)
│   ├── product/         # Product-related components
│   └── cart/            # Cart-related components
├── pages/               # Page components
│   ├── auth/            # Authentication pages
│   ├── home/            # Home page
│   ├── products/        # Product pages
│   ├── cart/            # Cart and checkout pages
│   ├── orders/          # Order pages
│   └── profile/         # Profile pages
├── redux/               # Redux store and slices
│   └── slices/          # Redux slices
├── routes/              # Route configuration
├── utils/               # Utility functions
└── hooks/               # Custom React hooks
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Features Overview

### Authentication
- User registration with email verification
- Secure login with JWT tokens
- Profile management
- Password reset functionality

### Product Catalog
- Browse products by categories
- Search functionality
- Product filtering and sorting
- Product detail views with images

### Shopping Cart
- Add/remove products
- Update quantities
- Persistent cart (localStorage)
- Cart sidebar for quick access

### Order Management
- Secure checkout process
- Order history
- Order tracking
- Order cancellation

### User Profile
- Update personal information
- Manage delivery addresses
- View order history
- Account settings

## API Integration

The user panel integrates with the backend API for:
- User authentication and profile management
- Product catalog and search
- Order placement and tracking
- Cart synchronization (optional)

## Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)

## State Management

Uses Redux Toolkit for:
- Authentication state
- Product catalog
- Shopping cart
- Order management
- UI state (modals, loading states)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.