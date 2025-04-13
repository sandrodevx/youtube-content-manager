# YouTube Content Manager

**WORK IN PROGRESS**: This application is currently in development and not fully functional.

A dashboard application for managing and monitoring your YouTube channels.

## Current Status

This project is in active development. Some features are not yet fully implemented:

- **YouTube API Integration**: Currently using simulated data instead of real YouTube API connections
- **OAuth Authentication**: Authentication is mocked and does not connect to real Google accounts yet
- **Data Persistence**: Local storage is used for development purposes only

## Development Setup

```bash
npm install
npm run dev
```

The application will start on http://localhost:3000 (or the next available port).

## Planned Features

- Dashboard overview of all managed channels
- Channel performance metrics and statistics
- Video content management
- Scheduled uploads and publishing
- Audience analytics
- Comparative performance metrics

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS

## YouTube API Configuration

To work with the real YouTube API (when implemented):

1. Create a project in Google Cloud Platform
2. Enable the YouTube Data API v3
3. Configure OAuth credentials
4. Add your API Key, Client ID, and Client Secret to the application
5. Follow Google's verification process for OAuth applications

## License

This project is licensed under the MIT License.
