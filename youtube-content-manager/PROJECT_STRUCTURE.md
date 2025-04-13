# Project Structure

This document provides an overview of the YouTube Content Manager application structure.

## Directory Structure

```
youtube-content-manager/
├── app/                   # Main application code
│   ├── accounts/          # Account management pages
│   │   ├── import/        # Account import functionality
│   │   ├── new/           # New account creation
│   │   └── page.tsx       # Accounts listing page
│   ├── api/               # API routes
│   │   └── youtube/       # YouTube API integration
│   ├── components/        # Reusable UI components
│   ├── utils/             # Utility functions
│   ├── data.ts            # Example/mock data
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage/dashboard
│   └── types.ts           # TypeScript type definitions
├── public/                # Static assets
│   ├── avatars/           # Profile images
│   ├── icons/             # UI icons
│   └── favicon.ico        # Site favicon
├── .env                   # Environment variables (not committed)
├── .env.example           # Example environment variables
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies and scripts
├── README.md              # Project overview
└── tsconfig.json          # TypeScript configuration
```

## Key Components and Files

### API Integration

- `app/api/youtube/route.ts` - YouTube API endpoints
- `app/api/youtube/callback/route.ts` - OAuth callback handling

### Core Features

- `app/accounts/page.tsx` - Account listing and management
- `app/accounts/import/page.tsx` - Account import functionality
- `app/components/YouTubeApiConnect.tsx` - YouTube API authentication
- `app/utils/accountStorage.ts` - Account data persistence

### Data and Types

- `app/types.ts` - TypeScript interfaces
- `app/data.ts` - Mock data for development

## Key Technical Decisions

1. **Next.js App Router**: Uses the latest Next.js structure with the app directory
2. **Client Components**: Most components are client-side with 'use client' directive
3. **TypeScript**: Full type safety across the application
4. **Tailwind CSS**: For styling
5. **Environment Variables**: Sensitive data stored in environment variables
6. **Local Storage**: Simple data persistence using browser localStorage 