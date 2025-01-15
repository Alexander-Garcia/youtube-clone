# YouTube Clone

A full-stack YouTube clone that uses Google Cloud for the infrastructure.

## Project Structure

### @frontend

Next.js web app that provides the user interface for the YouTube clone.

- Built with Next.js 14 and TypeScript
- Firebase integration for authentication and user db

[View frontend documentation](./frontend/README.md)

### @video-processing-service

A microservice for processing and optimizing uploaded videos.

- Built with Node.js (express) and TypeScript.
- Handles video processing using FFmpeg and scales to 1080x1920.
- Integrates with Google Cloud Storage
- Runs on Google Cloud Run
- Processes videos via Google Cloud Pub/Sub
- Containerized with Docker

[View video processing service documentation](./video-processing-service/README.md)

### @api-service

- Built with Node.js (express) and TypeScript.
- Uses Firebase and Google Functions

[View api docs](./api-service/README.md)
