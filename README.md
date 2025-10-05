# Business Authentication API

A robust Node.js API built with TypeScript, implementing Domain-Driven Design (DDD) architecture for user authentication with SSO and Google Login support.

## 🏗️ Architecture

This project follows **Domain-Driven Design (DDD)** principles with clean architecture:

- **Domain Layer**: Core business logic, entities, value objects, and domain services
- **Application Layer**: Use cases, DTOs, and application services
- **Infrastructure Layer**: Database repositories, external services, and technical implementations
- **Presentation Layer**: REST API controllers, routes, and middleware

## 🚀 Features

### Authentication
- ✅ Local user registration and login
- ✅ Google OAuth 2.0 integration
- ✅ JWT-based authentication (access & refresh tokens)
- ✅ Password hashing with bcrypt
- ✅ Email verification
- ✅ User status management (active, pending, suspended, inactive)

### Security
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Rate limiting
- ✅ Input validation with class-validator
- ✅ Password strength validation
- ✅ Secure session management

### Database
- ✅ PostgreSQL with Prisma ORM
- ✅ Database migrations
- ✅ Audit logging
- ✅ Connection pooling

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT, Google OAuth 2.0
- **Validation**: class-validator, class-transformer
- **Security**: Helmet, CORS, bcrypt
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd business-auth-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL="postgresql://app:app@localhost:5432/auth"
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Setup the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   ```

## 🏃‍♂️ Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Database Operations
```bash
# Generate Prisma client
npm run db:generate

# Create and apply migration
npm run db:migrate

# Reset database (development only)
npm run db:reset

# Open Prisma Studio
npm run db:studio
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Authenticate with Google
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/health` - Health check

### Health
- `GET /health` - Application health check

## 📝 API Usage Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Google Authentication
```bash
curl -X POST http://localhost:3000/api/auth/google \\
  -H "Content-Type: application/json" \\
  -d '{
    "token": "google-id-token"
  }'
```

## 🏗️ Project Structure

```
src/
├── domain/                 # Domain layer (business logic)
│   ├── base/              # Base classes (AggregateRoot, ValueObject, etc.)
│   └── user/              # User domain
│       ├── entities/      # Domain entities
│       ├── valueObjects/  # Value objects
│       ├── services/      # Domain services
│       ├── repositories/  # Repository interfaces
│       └── events/        # Domain events
├── application/           # Application layer (use cases)
│   ├── dtos/             # Data Transfer Objects
│   └── usecases/         # Application use cases
├── infrastructure/       # Infrastructure layer (external concerns)
│   ├── database/         # Database configuration
│   ├── repositories/     # Repository implementations
│   ├── services/         # Service implementations
│   └── external/         # External service integrations
├── presentation/         # Presentation layer (API)
│   ├── controllers/      # REST controllers
│   ├── middleware/       # Express middleware
│   ├── routes/           # Route definitions
│   └── App.ts           # Express application setup
├── shared/               # Shared utilities
│   ├── Config.ts        # Configuration management
│   └── Container.ts     # Dependency injection
└── index.ts             # Application entry point
```

## 🔒 Security Features

- **Password Security**: bcrypt hashing with configurable salt rounds
- **JWT Security**: Separate access and refresh tokens with configurable expiration
- **Rate Limiting**: Configurable request limits per IP
- **CORS Protection**: Configurable allowed origins
- **Security Headers**: Helmet.js for security headers
- **Input Validation**: Comprehensive validation with class-validator
- **SQL Injection Protection**: Prisma ORM with parameterized queries

## 🧪 Testing

The project is set up with Jest for testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Deployment

### Environment Variables for Production

Ensure all required environment variables are set:

```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Docker Support

```dockerfile
# Example Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🎯 What's Next

### Frontend Integration with React

The next phase of this project involves building a comprehensive React frontend that demonstrates enterprise-level authentication patterns:

#### 🌟 **Planned React Frontend Features**

**Authentication Flow Management (MVP)**
- **Login/Register Forms**: Clean, responsive forms with real-time validation
- **Google OAuth Integration**: One-click Google sign-in with seamless UX
- **Token Management**: Automatic token storage, refresh, and cleanup
- **Session Persistence**: Remember user sessions across browser tabs/refreshes

**User Experience Patterns**
- **Protected Routes**: Route-level access control with authentication guards
- **Authenticated vs Unauthenticated States**: Dynamic UI based on user status
- **Loading States**: Elegant loading indicators during authentication processes
- **Error Handling**: User-friendly error messages and recovery flows

**Advanced Authentication Features**
- **Automatic Token Refresh**: Background token renewal without user interruption
- **Token Expiration Handling**: Graceful logout when tokens expire
- **Role-Based Access Control**: Different UI components based on user roles
- **Security Headers**: Proper token handling in HTTP requests

#### 🛠️ **Technical Implementation**

**State Management**
- **Authentication Context**: React Context for global auth state
- **Persistent Storage**: Secure token storage with proper cleanup
- **API Integration**: Axios interceptors for automatic token attachment

**Security Best Practices**
- **HTTP-Only Cookies**: Secure token storage (alternative to localStorage)
- **CSRF Protection**: Cross-site request forgery prevention
- **XSS Prevention**: Secure token handling and sanitization
- **Automatic Logout**: Session cleanup on tab close/browser exit

**User Interface Components**
- **Navigation Guards**: Dynamic navigation based on authentication status
- **User Profile Management**: View and edit user information
- **Dashboard Layout**: Authenticated user dashboard with user controls
- **Authentication Modals**: Non-intrusive login/register overlays

#### 📱 **Demo Scenarios**

**Authentication Workflows**
1. **New User Journey**: Registration → Email verification → Dashboard access
2. **Returning User**: Login → Token validation → Protected content access
3. **Google OAuth**: Single-click authentication → Auto-registration → Dashboard
4. **Session Management**: Token refresh → Logout → Re-authentication

**Access Control Demonstrations**
- **Public Pages**: Landing page, about, contact (accessible to all)
- **Protected Pages**: Dashboard, profile, settings (requires authentication)
- **Role-Based Pages**: Admin panel, user management (role-specific access)
- **Conditional Components**: Different UI elements for different user types

#### 🎨 **UI/UX Highlights**

**Modern Design Patterns**
- **Material-UI/Chakra UI**: Professional, accessible component library
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Dark/Light Mode**: Theme switching with user preference persistence
- **Animation & Transitions**: Smooth state transitions and loading animations

**Developer Experience**
- **TypeScript Integration**: Full type safety between frontend and backend
- **API Documentation**: Interactive API explorer with authenticated requests
- **Error Boundaries**: Graceful error handling and user feedback
- **Performance Optimization**: Code splitting and lazy loading for auth components

This frontend will serve as a **production-ready template** for implementing secure authentication patterns in modern React applications, showcasing best practices for token management, user experience, and security.

Stay tuned for the React frontend repository that will complement this authentication API! 🚀
