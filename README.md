# YouTube Clone

A full-stack YouTube clone that uses the Pub/Sub service to process videos.

## Project Structure

### @frontend

Next.js web app that provides the user interface for the YouTube clone.

- Built with Next.js 14, TypeScript, and Tailwind CSS / CSS Modules
- Firebase integration for authentication and data storage
- Real-time video playback and management

[View frontend documentation](./frontend/README.md)

### @video-processing-service

A microservice for processing and optimizing uploaded videos.

- Built with Node.js (express) and TypeScript.
- Handles video processing using FFmpeg and scales to 1080x1920.
- Integrates with Google Cloud Storage
- Processes videos via Google Cloud Pub/Sub
- Containerized with Docker for easy deployment

[View video processing service documentation](./video-processing-service/README.md)
