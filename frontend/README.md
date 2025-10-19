# QtConnect Admin Frontend

A modern React-based admin dashboard for user management with cryptographic verification capabilities.

##  Quick Start

### Prerequisites
- **Node.js** >= 24.3.0
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8000`

##  Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

##  Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

##  Key Features

###  **Dashboard**
- **User Statistics**: Total users, admins, regular users, active/inactive counts
- **Interactive Charts**: User registration trends with customizable time periods (3, 7, 14, 30, 90 days)
- **Real-time Data**: Live updates from backend API
- **Responsive Design**: Optimized for desktop and mobile

###  **User Management**
- **User Table**: View all users with verification status
- **Add Users**: Create new user accounts with form validation
- **Edit Users**: Update existing user information
- **Cryptographic Verification**: 
  - Base64-encoded JSON signatures with embedded public keys
  - SHA-384 email hashing
  - Real-time signature verification
  - Protobuf data integration

###  **Security Features**
- **Digital Signature Verification**: Verify user email authenticity
- **Protobuf Integration**: Secure data exchange with backend
- **Error Handling**: Graceful fallbacks for API failures
- **Input Validation**: Secure form handling

##  Technology Stack

### **Frontend Framework**
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation

### **State Management**
- **Redux Toolkit** for global state management
- **React Redux** for component integration

### **UI Components**
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Recharts** for data visualization

### **Cryptography**
- **Crypto-JS** for hashing algorithms
- **Elliptic** for cryptographic operations
- **Node Forge** for digital signatures
- **ProtobufJS** for data serialization

### **Development Tools**
- **TypeScript** for type safety
- **ESLint** for code quality
- **PostCSS** for CSS processing

##  Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, cards, etc.)
│   ├── UsersTable.tsx  # User data table
│   ├── UserForm.tsx    # Add user form
│   └── UserEditForm.tsx # Edit user form
├── pages/              # Application pages
│   ├── Dashboard.tsx   # Main dashboard
│   └── Users.tsx      # User management page
├── store/              # Redux store configuration
│   ├── slices/         # Redux slices
│   └── api/            # API integration
├── utils/              # Utility functions
│   ├── crypto.ts       # Cryptographic functions
│   └── protobuf.ts     # Protobuf utilities
└── types/              # TypeScript type definitions
```

##  Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=QtConnect Admin
```

### Backend Integration
The frontend expects a backend API running on `http://localhost:3000` with the following endpoints:
- `GET /api/users` - Fetch user statistics
- `GET /api/users/export` - Export users as Protobuf
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user


### Production Build
```bash
# Build for production
npm run build

# The built files will be in the 'dist' directory
# Serve with any static file server (nginx, Apache, etc.)
```

##  Troubleshooting

### Common Issues

1. **Node Version Error**
   ```bash
   # Ensure you're using Node.js >= 24.3.0
   node --version
   ```

2. **Port Already in Use**
   ```bash
   # Kill process on port 8000
   npx kill-port 8000
   ```

3. **Dependencies Issues**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

##  Development Notes

- **Hot Reload**: Changes are automatically reflected in the browser
- **Type Safety**: Full TypeScript support with strict type checking
- **Code Quality**: ESLint configuration for consistent code style
- **Performance**: Lazy loading for route components
- **Error Boundaries**: Graceful error handling throughout the app

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.