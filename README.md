# Real-Time Chat Application

A modern real-time chat application built with React, TypeScript, Socket.IO, and Vite.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Building for Production](#building-for-production)
- [Architecture](#architecture)
  - [Frontend](#frontend)
  - [Authentication](#authentication)
  - [Real-time Communication](#real-time-communication)
  - [Error Handling](#error-handling)
- [Testing](#testing)
  - [Test Structure](#test-structure)
  - [Running Tests](#running-tests)
  - [Writing Tests](#writing-tests)
- [Development Guide](#development-guide)
  - [Adding New Components](#adding-new-components)
  - [State Management](#state-management)
  - [Environment Configuration](#environment-configuration)

## Features

- Real-time messaging with Socket.IO
- Username-based authentication
- Message status tracking (sending, sent, error)
- Error tracking and logging
- Responsive UI with TailwindCSS
- TypeScript for type safety
- Context API for state management
- Environment-specific configuration

## Project Structure

The project follows a feature-based structure with clear separation of concerns:

```
src/
├── components/         # UI components
│   ├── __tests__/      # Component tests
│   ├── message-input/  # Message input component
│   ├── message-list/   # Message list component
│   ├── ui/             # Reusable UI components
│   └── username-form/  # Username form component
├── context/            # React Context providers
│   ├── auth-context/   # Authentication context
│   └── message-context/# Message handling context
├── environments/       # Environment configuration
├── hooks/              # Custom React hooks
├── pages/              # Application pages
│   ├── home/           # Home page (chat)
│   └── login.tsx       # Login page
├── router/             # Routing configuration
├── services/           # Service layer
│   ├── __tests__/      # Service tests
│   ├── api/            # API service
│   ├── error-tracking/ # Error tracking service
│   ├── socket/         # Socket.IO service
│   └── storage/        # Local storage service
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
    └── __tests__/      # Utility tests
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies using npm ci to preserve the dependency tree:

```bash
npm ci
```

This ensures that the exact versions of dependencies specified in package-lock.json are installed, maintaining consistency across development environments.

If you're using yarn:

```bash
yarn install --frozen-lockfile
```

### Running the Application

To start the development server:

```bash
npm run dev
# or
yarn dev
```

This will start the application in development mode at `http://localhost:5173`.

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

To preview the production build:

```bash
npm run preview
# or
yarn preview
```

## Architecture

### Frontend

The application is built with React and TypeScript, using Vite as the build tool. The UI is styled with TailwindCSS.

Key frontend technologies:
- React 19
- TypeScript
- Vite
- TailwindCSS
- React Router

### Authentication

The application uses a simple username-based authentication system:

1. Users enter their username on the login page
2. The username is stored in local storage
3. The authentication state is managed by the `AuthContext`
4. Protected routes redirect unauthenticated users to the login page

### Real-time Communication

Real-time messaging is implemented using Socket.IO:

1. The `SocketService` manages the Socket.IO connection
2. Messages are sent and received through socket events
3. The `MessageContext` handles message state management
4. Message status (sending, sent, error) is tracked and displayed

Socket events:
- `connect`: Socket connection established
- `disconnect`: Socket connection closed
- `connect_error`: Socket connection error
- `new-message`: New message received
- `send-message`: Send a new message

### Error Handling

The application includes comprehensive error handling:

1. The `ErrorTrackingService` logs errors and important events
2. Form validation with clear error messages
3. Error states in contexts with automatic clearing
4. Visual feedback for message status and errors

## Testing

The application uses Vitest and Testing Library for unit and integration testing.

### Test Structure

Tests are co-located with the code they test in `__tests__` directories at each logical level:

```
src/
├── components/
│   └── __tests__/          # Component tests
│       ├── message-input/  # Tests for message input components
│       ├── message-list/   # Tests for message list components
│       ├── ui/             # Tests for UI components
│       └── username-form/  # Tests for username form components
├── services/
│   └── __tests__/          # Service tests
│       ├── api/            # Tests for API service
│       ├── error-tracking/ # Tests for error tracking service
│       ├── socket/         # Tests for socket service
│       └── storage/        # Tests for storage service
└── utils/
    └── __tests__/          # Utility tests
```

This co-location approach makes it easy to find tests related to specific components or services, and encourages developers to write tests alongside their implementation code.

### Running Tests

To run all tests:

```bash
npm test
# or
yarn test
```

To run tests in watch mode:

```bash
npm test -- --watch
# or
yarn test --watch
```

To run tests with coverage:

```bash
npm test -- --coverage
# or
yarn test --coverage
```

### Writing Tests

Each test file should follow these conventions:

1. Import the necessary testing utilities
2. Use descriptive test names that explain what is being tested
3. Group related tests using `describe` blocks
4. Use `beforeEach` and `afterEach` for setup and teardown
5. Mock external dependencies when necessary

Example test for a service:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { myService } from '../service';

describe('MyService', () => {
  beforeEach(() => {
    // Setup code
    vi.clearAllMocks();
  });

  describe('myMethod', () => {
    it('should return expected result', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = myService.myMethod(input);
      
      // Assert
      expect(result).toBe('expected result');
    });
  });
});
```

## Development Guide

### Adding New Components

1. Create a new directory in `src/components/`
2. Implement the component with TypeScript and React
3. Export the component from `src/components/index.ts`
4. Use the component in your pages or other components

### State Management

The application uses React Context API for state management:

1. `AuthContext`: Manages authentication state
2. `MessageContext`: Manages message state

Each context includes:
- A context file (`context.tsx`)
- A reducer file (`reducer.ts`)
- Types (`types.ts`)
- Hooks for easy access (`hooks.ts`)

### Environment Configuration

The application supports different environments:

1. `environment.ts`: Base environment configuration
2. `environment.local.ts`: Local development configuration
3. `environment.prod.ts`: Production configuration

To add a new environment variable:
1. Add it to the `Environment` interface in `environment.ts`
2. Add the value to each environment file
3. Access it via `environment.VARIABLE_NAME`

Example:
```typescript
// In environment.ts
export interface Environment {
  VITE_NEW_VARIABLE: string;
}

// In environment.local.ts
export const environment: Environment = {
  VITE_NEW_VARIABLE: 'local-value',
};

// Usage
import { environment } from '#environments/environment';
console.log(environment.VITE_NEW_VARIABLE);
