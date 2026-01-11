# GitHub Pages Deployment Guide

This guide will help you deploy the AI Blockchain DApp to GitHub Pages.

## 🚀 Quick Deployment

### Option 1: Automatic Deployment (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ai-blockchain-dapp.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically deploy on every push to `main` branch

3. **Add Secrets (Optional but Recommended)**
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Add the following secrets if you want to use them in production:
     - `VITE_OPENAI_API_KEY` - Your OpenAI API key
     - `VITE_FIREBASE_API_KEY` - Your Firebase API key
     - `VITE_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
     - `VITE_FIREBASE_PROJECT_ID` - Your Firebase project ID
     - `VITE_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
     - `VITE_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
     - `VITE_FIREBASE_APP_ID` - Your Firebase app ID
     - `VITE_FIREBASE_MEASUREMENT_ID` - Your Firebase measurement ID (optional)

   **Note:** For security, it's better to let users configure their own API keys in the deployed app rather than using secrets.

### Option 2: Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Select `main` branch and `/dist` folder
   - Click **Save**

3. **Push the dist folder** (if using manual deployment)
   ```bash
   git add dist
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

## 📝 Important Notes

### Repository Name
- The app is configured for a repository named `ai-blockchain-dapp`
- If your repository has a different name, update `vite.config.js`:
  ```js
  base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/',
  ```

### Environment Variables
- **For Development:** Use a `.env` file (not committed to git)
- **For Production:** Users will need to configure their own API keys
- **For GitHub Actions:** Add secrets in repository settings if needed

### Base Path
The app automatically adjusts the base path based on the environment:
- Development: `/` (root)
- Production: `/ai-blockchain-dapp/` (GitHub Pages subdirectory)

## 🔧 Troubleshooting

### 404 Errors
- Make sure the `base` path in `vite.config.js` matches your repository name
- Ensure `.nojekyll` file exists in the root (prevents Jekyll processing)

### Build Failures
- Check GitHub Actions logs for errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version (should be 18+)

### Assets Not Loading
- Check browser console for 404 errors
- Verify the base path is correct
- Ensure all assets are in the `dist` folder

### API Keys Not Working
- Remember: API keys in `.env` are for local development only
- For production, users need to configure their own keys
- Or use GitHub Secrets for automated builds (not recommended for public repos)

## 🌐 Access Your Deployed App

Once deployed, your app will be available at:
```
https://YOUR_USERNAME.github.io/ai-blockchain-dapp/
```

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🔒 Security Best Practices

1. **Never commit API keys** to the repository
2. **Use environment variables** for sensitive data
3. **Consider using GitHub Secrets** only for private repositories
4. **For public repos**, let users configure their own API keys
5. **Use Firebase** for server-side operations instead of exposing API keys

---

**Note:** The automatic deployment workflow will trigger on every push to the `main` branch. Make sure your code is ready before pushing!
