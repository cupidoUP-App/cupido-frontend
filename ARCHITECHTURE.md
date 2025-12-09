# Cupido Frontend Architecture

## Project Overview

Cupido is a modern dating application frontend built with React, TypeScript, and Vite. The project follows a feature-based architecture with a strong emphasis on shared components and utilities.

## Current Architecture Analysis

### Root Project Structure (Outside src/)

```
cupido-frontend/
├── package.json y package-lock.json    # Project dependencies and scripts |0|
├── index.html                   # Main HTML entry point |1| with meta tags
├── README.md                    # Project presentation and setup instructions
|-- tsconfig.json                # Entry point for TypeScript configuration redirects to tsconfig.app.json |0|
├── LICENSE                      # Project license
├── config/                      # Configuration directory |0|
|   |--env/                     # Enviroment Configuration and the env.example file
│   ├── vite.config.ts          # Vite bundler configuration
│   ├── tsconfig/               # TypeScript configurations for app and node
│   │   ├── tsconfig.app.json   # Application TS config and aliases
│   │   └── tsconfig.node.json  # Node/ tooling TS config
│   ├── eslint.config.ts        # ESLint configuration, actually it is not used
│   ├── tailwind.config.ts      # Tailwind CSS configuration
│   └── postcss.config.cjs      # PostCSS configuration entry point for tailwindcss
├── deploy/                      # Deployment configuration
│   ├── Dockerfile              # Docker deployment
│   └── nginx.conf              # Nginx configuration
└── public/                      # Static assets
    ├── placeholder.svg         # Placeholder image
    └── robots.txt              # SEO robots file
```

Actually in production the .env file is in the root directory, for this reason the vite.config.ts file in the config directory is using path.resolve(__dirname, 'env'), to load the .env file. In development the .env file is in the config directory.

#### Key Configuration Files Analysis

**package.json**: Modern React project with:
- **Framework**: Vite + React 18.3.1 with TypeScript
- **UI Library**: Radix UI components + shadcn/ui for accessible components
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query (React Query) v5
- **Styling**: Tailwind CSS with typography and animations
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM v6
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Testing**: Vitest with Testing Library
- **Development**: ESLint, TypeScript, PostCSS

**vite.config.ts**: Advanced Vite configuration with:
- **Path Aliases**: Comprehensive alias setup for features, shared components, and others. This is used to import components and features from other directories. In the same directory we don't need to use the alias, we used ./

The actual aliases are: 
        "@"  this point to src
        "@assets" this point to src/assets

        //Shared
        "@layout"
        "@modals"
        "@ui"
        "@hooks"
        "@lib"
        "@pages"
        "@store"

        //Features
        "@admin"
        "@auth"
        "@chat"
        "@filters"
        "@home"
        "@matching"
        "@notifications"
        "@photos"
        "@preferences"
        "@profile"
        "@sidebar"

- **Proxy Configuration**: API proxy to backend (Django Rest Framework) via `VITE_API_BASE_URL`
- **Development Server**: Configured for development and production environments
- **PostCSS Integration**: Tailwind CSS processing
- **Development Tools**: Lovable tagger for component tracking in dev mode

**TypeScript Configuration**:
- **Strict Mode**: Enabled with comprehensive type checking
- **Modern Targets**: ES2022 with ESNext modules
- **Path Mapping**: Type-safe imports with aliases
- **Composite Builds**: Optimized for better performance

### Current src/ Architecture

```
src/
├── app/                        # Application core
│   ├── App.tsx                # Main application component
│   ├── main.tsx               # Application entry point
│   └── index.css             # Global styles
│   ├── router.tsx             # Route configuration
│   ├── providers.tsx          # Context providers
|   |-- vite-env.d.ts          # Vite environment declarations
├── assets/                    # Static assets
├── features/                  # Feature-based modules
|   ├── admin/                 # Admin system
│   ├── auth/                 # Authentication system
|   ├── chat/                 # Chat system
│   ├── filters/              # Search filters
|   ├── home/                 # Landing page
│   ├── matching/             # Matching algorithm
|   |-- notifications/        # Notification system
|   ├── photos/               # Photo management
│   ├── preferences/          # User preferences
│   ├── profile/              # User profile management
|   |-- sidebar/              # Sidebar management
├── shared/  # Shared utilities and components                    
│   ├── components/           # Reusable components
│   ├── hooks/                # Global hooks
│   ├── lib/                  # Utility libraries
|   ├── pages/                # Page-level components
│   ├── store/                # Zustand stores
└── 
```
At the moment all before this message is implemented, but is necessary to implement the feature-based architecture to make the code more maintainable and scalable.By the way please check the README.md file of each feature to see the implementation details.

End of ARCHITECHTURE.md file

######
#####
####
###
##
#






























## Proposed Enhanced Architecture

THIS IS ONLY A PROPOSAL, IT IS NOT IMPLEMENTED YET

### Feature-Based Architecture Principles

The current structure already implements a feature-based approach, but we can enhance it with these principles:

#### 1. Feature Module Structure
Each feature should be self-contained with:

```
features/{feature-name}/
├── {FeatureName}.tsx              # Main feature component
├── components/                    # Feature-specific components
│   ├── {ComponentName}.tsx
│   └── index.ts                   # Barrel exports
├── hooks/                         # Feature-specific hooks
│   ├── use{FeatureName}.ts
│   └── index.ts
├── services/                      # API services
│   ├── {featureName}Service.ts
│   └── index.ts
├── types/                         # Feature-specific types
│   ├── {FeatureName}.types.ts
│   └── index.ts
├── utils/                         # Feature utilities
│   ├── {featureName}Utils.ts
│   └── index.ts
├── constants/                     # Feature constants
│   ├── {featureName}Constants.ts
│   └── index.ts
|---pages/                         # Feature-specific pages
│   ├── {PageName}.tsx
│   └── index.ts
├── {FeatureName}.module.css       # Feature-specific styles
└── README.md                      # Feature documentation
```

#### 2. Shared Module Enhancement

```
shared/
├── components/                    # Reusable UI components
│   ├── ui/                       # shadcn/ui base components
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── index.ts
│   ├── forms/                    # Form components
│   │   ├── Input.tsx
│   │   ├── Button.tsx
│   │   ├── Select.tsx
│   │   └── index.ts
│   └── index.ts                  # Barrel exports
├── hooks/                         # Global hooks
│   ├── useAuth.ts                # Authentication hook
│   ├── useTheme.ts               # Theme management
│   ├── useLocalStorage.ts        # Local storage hook
│   └── index.ts
├── lib/                          # Utility libraries
│   ├── api/                      # API utilities
│   │   ├── client.ts             # Axios configuration
│   │   ├── endpoints.ts          # API endpoints
│   │   └── index.ts
│   ├── utils/                    # General utilities
│   │   ├── formatters.ts         # Data formatters
│   │   ├── validators.ts         # Input validators
│   │   └── index.ts
│   ├── constants/                # Global constants
│   │   ├── api.ts                # API constants
│   │   ├── app.ts                # App constants
│   │   └── index.ts
│   └── recaptcha/  
|-- pages/                        # Page components
├── store/                        # State management
│   ├── authStore.ts              # Authentication state
│   ├── uiStore.ts                # UI state
│   ├── preferencesStore.ts       # User preferences
│   └── index.ts
├── types/                        # Global type definitions
│   ├── api.types.ts              # API response types
│   ├── user.types.ts             # User-related types
│   ├── ui.types.ts               # UI component types
│   └── index.ts
└── styles/                       # Global styles
    ├── globals.css               # Global CSS variables
    ├── components.css            # Component-specific styles
    └── utilities.css             # Utility classes
```

### Recommended Project Structure

```
src/
├── app/                          # Application core
│   ├── App.tsx                  # Root application component
│   ├── main.tsx                 # Application entry point
│   ├── router.tsx               # Route configuration
│   ├── providers.tsx            # Context providers
|   |-- index.css
├── features/                    # Feature modules
│   ├── feature/                # Feature 1
│   │   ├── components/
│   │   │   ├── forms/
│   │   │   ├── layout/
│   │   │   └── modals/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── constants/
│   │   └── index.ts             # Feature exports
├── shared/                      # Shared resources
│   ├── components/              # Reusable components
│   │   ├── ui/                  # Base UI components (shadcn)
│   │   ├── layout/              # Layout components
│   │   ├── forms/               # Form components
│   │   └── index.ts
│   ├── pages/                   # Page components
│   ├── hooks/                   # Global hooks
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   ├── lib/                     # Utility libraries
│   │   ├── api/                 # API utilities
│   │   ├── utils/               # General utilities
│   │   ├── constants/           # App constants
│   │   └── recaptcha/           # reCAPTCHA
│   ├── store/                   # State management
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   ├── themeStore.ts
│   │   └── index.ts
│   ├── types/                   # Global types
│   │   ├── api.types.ts
│   │   ├── user.types.ts
│   │   ├── app.types.ts
│   │   └── index.ts
│   └── styles/                  # Global styles
│       ├── globals.css
│       ├── components.css
│       └── utilities.css
└── assets/                      # Static assets
```

### Architecture Benefits

#### 1. **Modularity**
- Each feature is self-contained and independently testable
- Clear separation of concerns between features
- Easy to add, remove, or modify features without affecting others

#### 2. **Scalability**
- New features can be added following established patterns
- Shared components prevent code duplication
- Consistent structure across all modules

#### 3. **Maintainability**
- Easy to locate and modify code within features
- Clear dependency flow (features → shared → external)
- Consistent naming conventions and file organization

#### 4. **Developer Experience**
- Clear import paths with aliases
- Barrel exports for cleaner imports
- Consistent patterns across all features

#### 5. **Testing**
- Each feature can be tested in isolation
- Shared utilities have comprehensive test coverage
- Integration testing at feature boundaries

### Implementation Guidelines

#### 1. **Import Patterns**
```typescript
// Feature-specific imports
import { useAuth } from '@auth'
import { Button } from '@ui'

// Avoid cross-feature imports
// ❌ import { UserProfile } from '@/features/profile' (in auth feature)
// ✅ Pass data through props or global state
```

#### 2. **Component Organization**
- Keep components small and focused
- Use composition over inheritance
- Leverage React hooks for logic separation
- Implement proper TypeScript typing

#### 3. **State Management**
- Use Zustand for global state (auth, theme, UI state)
- Use React Query for server state
- Keep feature-specific state within feature modules
- Avoid prop drilling with context or global state

#### 4. **Styling Approach**
- Use Tailwind CSS for utility-first styling
- Create custom CSS variables for theme consistency
- Keep component-specific styles in feature modules
- Use shared design tokens from the shared module

### Migration Strategy

1. **Phase 1**: Refactor shared module structure
2. **Phase 2**: Migrate features to new structure one by one
3. **Phase 3**: Update imports and dependencies
4. **Phase 4**: Add comprehensive tests
5. **Phase 5**: Documentation and team training

This architecture provides a solid foundation for a scalable, maintainable, and developer-friendly dating application frontend.
