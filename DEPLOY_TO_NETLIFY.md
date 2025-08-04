# Deploy to Netlify - Step by Step Guide

Your project is ready to deploy! Follow these steps to deploy your Price Elasticity Quiz to Netlify using the web UI.

## Prerequisites
- A GitHub account (or GitLab/Bitbucket)
- A Netlify account (free at netlify.com)

## Step 1: Push Your Project to GitHub

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it "price-elasticity" or "price-elasticity-quiz"
   - Make it public or private (your choice)
   - Don't initialize with README (we already have one)

2. Push your local project to GitHub:
   ```bash
   cd /Users/tarasbobrovytsky/Dev/price-elasticity
   git add .
   git commit -m "Initial commit - Price Elasticity Quiz"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## Step 2: Deploy on Netlify

1. **Log in to Netlify**
   - Go to https://app.netlify.com
   - Sign in with your account

2. **Create New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub

3. **Select Your Repository**
   - Search for your repository name
   - Click on your repository

4. **Configure Build Settings**
   Netlify should auto-detect these, but verify:
   - **Branch to deploy**: main
   - **Base directory**: _(leave empty)_
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Functions directory**: (leave empty)

5. **Environment Variables** (if needed)
   - No environment variables are needed for this project

6. **Deploy Site**
   - Click "Deploy site"
   - Wait 2-3 minutes for the build to complete

## Step 3: Your Site is Live! 🎉

Once deployed, you'll get a URL like:
- `https://amazing-newton-123456.netlify.app`

You can:
- **Custom Domain**: Add your own domain in Site settings → Domain management
- **Rename Site**: Change the subdomain in Site settings → Site details
- **Enable Auto-Deploy**: Any push to GitHub will automatically redeploy

## Important Notes

✅ The `netlify.toml` file is already configured for Next.js
✅ The project has been tested and builds successfully
✅ All dependencies are properly listed in package.json
✅ The dataset.json is in the public folder and will be served correctly

## Troubleshooting

If you encounter issues:

1. **Build Failed**: Check the deploy log in Netlify for specific errors
2. **404 Errors**: Make sure the publish directory is set to `.next`
3. **Missing Styles**: Ensure Tailwind CSS is building properly (it should be)

## After Deployment

Share your quiz with friends and test their knowledge of price elasticity! The site will work perfectly on all devices with beautiful animations and a professional look.

Enjoy your deployed Price Elasticity Quiz! 🚀