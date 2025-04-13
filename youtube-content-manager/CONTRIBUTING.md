# Contributing to YouTube Content Manager

Thank you for your interest in contributing to this project! Here's how you can help.

## Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/youtube-content-manager.git
   cd youtube-content-manager
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your YouTube API credentials.

5. Start the development server:
   ```bash
   npm run dev
   ```

## Coding Guidelines

- Follow the existing code style and patterns
- Use TypeScript for type safety
- Ensure your code passes linting (`npm run lint`)
- Write meaningful commit messages

## Pull Request Process

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git commit -m "Add feature X" 
   ```

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request against the `main` branch of the original repository

## API Keys and Credentials

- Never commit your API keys or credentials
- Use environment variables for sensitive information
- The `.env` file is listed in `.gitignore` and should never be committed

## Project Structure

- `app/` - Contains all pages and components
  - `components/` - Reusable UI components
  - `accounts/` - Account management pages
  - `api/` - API routes for backend functionality
  - `utils/` - Utility functions
  - `types.ts` - TypeScript type definitions
  - `data.ts` - Example/mock data
  
## License

By contributing, you agree that your contributions will be licensed under the project's MIT License. 