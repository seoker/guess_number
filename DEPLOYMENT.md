# Deployment to GitHub Pages Guide

## Prerequisites

1. Ensure your project has been pushed to GitHub
2. Repository name should be `guess_number` (matching the base path in vite.config.js)

## Deployment Steps

### 1. Initialize Git and Push to GitHub (if not done already)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/guess_number.git
git push -u origin main
```

### 2. Enable GitHub Pages on GitHub

1. Go to your GitHub repository page
2. Click the `Settings` tab
3. Find `Pages` in the left sidebar menu
4. In the `Source` section, select `Deploy from a branch`
5. Choose the `gh-pages` branch
6. Click `Save`

### 3. Deploy the Application

Run the following command to deploy:

```bash
npm run deploy
```

This command will:
- Execute `npm run build` to build the project
- Use `gh-pages` to push the `dist` folder to GitHub's `gh-pages` branch

### 4. Wait for Deployment to Complete

After deployment is complete, your game will be available at:
```
https://YOUR_USERNAME.github.io/guess_number/
```

## Important Notes

- Ensure `base: '/guess_number/'` in `vite.config.js` matches your repository name
- After each code update, you need to run `npm run deploy` again to update the website
- It may take a few minutes after deployment to see the updates

## Troubleshooting

If you encounter issues:

1. Check GitHub Actions for error messages
2. Verify that the `gh-pages` branch was successfully created
3. Check if the base path in `vite.config.js` is correct
4. Confirm that GitHub Pages settings are configured properly

## Automated Deployment (Optional)

If you want to automatically deploy on every push to the main branch, you can set up GitHub Actions. Please refer to the GitHub Actions documentation for detailed configuration.

## Live Demo

The current deployment is live at:
🎮 **[https://seoker.tw/guess_number](https://seoker.tw/guess_number)**

## Additional Deployment Commands

```bash
# Build only
npm run build

# Preview build locally
npm run preview

# Run tests before deployment
npm test

# Deploy with fresh build
npm run deploy
```

## Custom Domain Setup (Optional)

If you want to use a custom domain like `seoker.tw/guess_number`:

1. Add a `CNAME` file to the `public` folder containing your domain
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings to use the custom domain
4. Ensure HTTPS is enabled in repository settings

## Deployment Checklist

Before deploying, ensure:
- [ ] All tests pass (`npm test`)
- [ ] Build completes successfully (`npm run build`)
- [ ] All translation keys are properly defined
- [ ] Responsive design works on different screen sizes
- [ ] Game logic functions correctly
- [ ] localStorage works for game records and settings