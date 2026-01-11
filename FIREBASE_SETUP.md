# Firebase Setup Guide

This guide will help you set up Firebase for the AI Blockchain DApp.

## 🚀 Quick Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name
   - Enable/disable Google Analytics (optional)
   - Click "Create project"

### 2. Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Register your app (give it a nickname)
6. Copy the Firebase configuration object

### 3. Add Configuration to Environment Variables

Create or update your `.env` file in the root directory:

```bash
# OpenAI API Key (existing)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration (new)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id  # Optional, for Analytics
```

### 4. Enable Firestore Database

1. In Firebase Console, go to "Build" → "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development) or set up security rules
4. Select a location for your database
5. Click "Enable"

### 5. Set Up Firestore Security Rules (Recommended)

Go to Firestore Database → Rules and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /chatMessages/{messageId} {
      allow read, write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    match /contractAnalyses/{analysisId} {
      allow read, write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    match /riskAssessments/{assessmentId} {
      allow read, write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Note:** For production, implement proper authentication and more restrictive rules.

### 6. Enable Firebase Storage (Optional)

If you want to store files:

1. Go to "Build" → "Storage"
2. Click "Get started"
3. Start in test mode or set up rules
4. Choose a location

### 7. Install Dependencies

```bash
npm install
```

## 📦 What Firebase Adds

### Features Enabled:

1. **Cloud Storage for Chat History**
   - Chat messages saved to Firestore
   - Sync across devices
   - Persistent storage

2. **Contract Analysis History**
   - Save analysis results
   - View past analyses
   - Track analysis patterns

3. **Risk Assessment History**
   - Save transaction assessments
   - Review past risk analyses
   - Learn from patterns

4. **User Preferences**
   - Save user settings
   - Theme preferences
   - Custom configurations

5. **Analytics** (Optional)
   - Track app usage
   - User behavior insights
   - Performance metrics

## 🔧 Usage in Code

The Firebase service is already integrated. It will:
- Automatically check if Firebase is configured
- Fall back to localStorage if Firebase is not available
- Handle errors gracefully

### Example Usage:

```javascript
import { saveChatMessage, getChatHistory } from './services/firebaseService'

// Save a message
await saveChatMessage(userId, {
  role: 'user',
  content: 'Hello!'
})

// Get chat history
const history = await getChatHistory(userId)
```

## 🔒 Security Notes

1. **Never commit `.env` file** to version control
2. **Set up proper Firestore security rules** before production
3. **Use Firebase Authentication** for user management
4. **Enable App Check** for production to prevent abuse
5. **Monitor usage** in Firebase Console

## 📊 Firebase Console

Access your Firebase Console at: https://console.firebase.google.com/

Here you can:
- View database contents
- Monitor usage and quotas
- Set up authentication
- Configure security rules
- View analytics

## 🚨 Troubleshooting

### "Firebase not configured" warning
- Check that all environment variables are set in `.env`
- Restart the dev server after adding `.env` variables
- Verify variable names start with `VITE_`

### Permission denied errors
- Check Firestore security rules
- Ensure user is authenticated (if using auth)
- Verify user ID matches in queries

### Connection issues
- Check internet connection
- Verify Firebase project is active
- Check browser console for detailed errors

## 📝 Next Steps

1. **Add Firebase Authentication** (optional)
   - Enable email/password auth
   - Add Google sign-in
   - Implement user management

2. **Set up Cloud Functions** (optional)
   - Server-side processing
   - Scheduled tasks
   - Webhooks

3. **Enable Analytics** (optional)
   - Track user behavior
   - Monitor app performance
   - Get insights

## 💡 Tips

- Start with test mode for development
- Use Firebase Emulator Suite for local development
- Set up proper security rules before production
- Monitor your Firebase usage to stay within free tier limits
- Use Firebase Console to view and manage your data

---

**Note:** Firebase is optional. The app will work without it, using localStorage as a fallback.
