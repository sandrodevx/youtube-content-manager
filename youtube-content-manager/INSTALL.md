# Installation Guide

This guide will help you set up the YouTube Content Manager project locally.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Google account with access to Google Cloud Console (for API access)

## Step 1: Clone the repository

```bash
git clone https://github.com/your-username/youtube-content-manager.git
cd youtube-content-manager
```

## Step 2: Install dependencies

```bash
npm install
# or
yarn install
```

## Step 3: Set up environment variables

1. Copy the example environment file to create your own:
```bash
cp .env.example .env
```

2. Edit the `.env` file and add your YouTube API credentials:
```
NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CLIENT_ID=your_client_id_here
YOUTUBE_CLIENT_SECRET=your_client_secret_here
YOUTUBE_REDIRECT_URI=http://localhost:3000/api/youtube/callback
```

> **Note**: You need to create these credentials in the Google Cloud Console.

## Step 4: Run the development server

```bash
npm run dev
# or
yarn dev
```

The application will start on http://localhost:3000 (or the next available port).

## Step 5: Access the application

Open your browser and navigate to:
```
http://localhost:3000
```

## Troubleshooting

### Port already in use

If port 3000 is already in use, the application will automatically use the next available port (e.g., 3001, 3002).

### API connection issues

If you encounter issues connecting to the YouTube API:
- Verify your API credentials in the `.env` file
- Make sure your Google Cloud project has the YouTube Data API v3 enabled
- Check that your OAuth credentials are properly configured
- For development, add your email as a test user in Google Cloud Console

### Package installation errors

If you encounter errors during package installation, try:
```bash
npm cache clean --force
npm install
``` 