# API Service

Firebase functions service

## Cloud Functions

### `createUser`

Automatically creates a user profile in Firestore when a new user signs up.

- Trigger: `beforeUserCreated`
- Storage: Creates document in `users` collection
- Fields stored:
  - `uid`: User's unique identifier
  - `email`: User's email address
  - `photoURL`: User's profile picture URL
