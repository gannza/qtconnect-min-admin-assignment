# Admin Panel - Mini Dashboard

A modern, full-stack admin panel built with React, TypeScript, and Node.js featuring user management, cryptographic security, and protobuf integration.

## Features

### ✅ Core Requirements
- **User Management (CRUD)**: Create, read, update, and delete users
- **User Graph**: Chart showing users created per day over the last 7 days
- **Protobuf Integration**: Export/import users in protobuf format
- **Cryptographic Security**: SHA-384 email hashing with RSA digital signatures

### 🎨 Frontend Features
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Design**: Mobile-first approach with clean, professional interface
- **Lazy Loading**: Optimized routing with React.lazy() for better performance
- **Error Handling**: Comprehensive error boundaries and user feedback
- **State Management**: Redux Toolkit for predictable state management

### 🔐 Security Features
- **Email Hashing**: SHA-384 algorithm for secure email hashing
- **Digital Signatures**: RSA keypair generation and signature verification
- **Signature Validation**: Only display users with valid cryptographic signatures

### 📊 Data Visualization
- **Interactive Charts**: Recharts integration for user statistics
- **Real-time Updates**: Live data updates with Redux state management
- **Export/Import**: Protobuf-based data serialization

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for client-side routing
- **Redux Toolkit** for state management
- **shadcn/ui** for beautiful, accessible components
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

### Cryptography & Data
- **crypto-js** for SHA-384 hashing
- **node-forge** for RSA key generation and signing
- **protobufjs** for Protocol Buffers serialization

## Getting Started

### Prerequisites
- Node.js v24.3.0 (specified in .nvmrc)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qtconnect-fte-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   ├── Layout.tsx     # Main layout wrapper
│   ├── Sidebar.tsx    # Navigation sidebar
│   └── Header.tsx     # Top header
├── pages/              # Route components
│   ├── Dashboard.tsx  # Main dashboard
│   ├── Users.tsx      # User management
│   └── NotFound.tsx   # 404 page
├── store/             # Redux store
│   ├── slices/        # Redux slices
│   └── api/           # API layer
├── utils/             # Utility functions
│   ├── crypto.ts      # Cryptographic functions
│   └── protobuf.ts    # Protobuf utilities
├── types/             # TypeScript type definitions
├── hooks/             # Custom React hooks
└── proto/             # Protocol Buffer schemas
```

## Key Components

### User Management
- **UsersTable**: Displays users in a sortable, filterable table
- **UserForm**: Create new users with validation
- **UserEditForm**: Edit existing users with modal dialog

### Security & Verification
- **CryptoVerification**: Verify digital signatures for all users
- **Automatic Hashing**: Email hashing on user creation
- **Signature Validation**: Real-time signature verification

### Data Export/Import
- **ProtobufExport**: Export users in protobuf format
- **ProtobufImport**: Import users from protobuf files
- **Schema Definition**: Complete protobuf schema for User objects

## API Integration

The frontend expects a backend API with the following endpoints:

```
GET    /api/users          # Fetch all users
POST   /api/users          # Create new user
PUT    /api/users/:id      # Update user
DELETE /api/users/:id      # Delete user
GET    /api/users/stats    # Get user statistics
GET    /api/users/export   # Export users (protobuf)
```

## Cryptographic Implementation

### Email Hashing
- Uses SHA-384 algorithm for secure email hashing
- Hash is generated when creating new users
- Stored alongside user data for verification

### Digital Signatures
- RSA 2048-bit keypair generation
- Private key used for signing email hashes
- Public key used for signature verification
- Keys stored in browser localStorage

### Signature Verification
- Real-time verification of user signatures
- Only users with valid signatures are displayed
- Cryptographic integrity ensures data authenticity

## Development

### Code Quality
- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code linting and style enforcement
- **Error Boundaries**: Graceful error handling
- **Loading States**: User-friendly loading indicators

### Performance
- **Lazy Loading**: Route-based code splitting
- **Memoization**: Optimized re-renders
- **Bundle Optimization**: Vite's built-in optimizations

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For questions or support, please open an issue in the repository.
