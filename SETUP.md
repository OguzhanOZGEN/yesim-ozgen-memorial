# Setup Instructions for Yeşim Özgen Memorial Website

## Prerequisites Installation

Before you can run this project, you need to install Node.js which includes npm (Node Package Manager).

### Step 1: Install Node.js

1. Go to https://nodejs.org/
2. Download the LTS (Long Term Support) version for Windows
3. Run the installer and follow the installation wizard
4. Keep all default settings during installation
5. Restart your computer after installation

### Step 2: Verify Installation

Open a new PowerShell or Command Prompt window and run:

```bash
node --version
npm --version
```

Both commands should display version numbers if installed correctly.

## Project Setup

### Step 3: Install Project Dependencies

Navigate to the project folder and install dependencies:

```bash
cd "c:\Users\ASUS\Desktop\Yesim Ozgen Website R2"
npm install
```

This will install all required packages:
- React and React DOM
- React Router DOM
- TypeScript
- Vite
- Tailwind CSS
- And other development dependencies

### Step 4: Run the Development Server

After installation completes, start the development server:

```bash
npm run dev
```

The application will start and display a URL (usually `http://localhost:5173`)

### Step 5: Open in Browser

Open your web browser and navigate to the URL displayed in the terminal (e.g., `http://localhost:5173`)

## Admin Access

To test admin features:
- Click "Giriş Yap" in the navigation
- Username: `admin`
- Password: `admin`

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linting

## Troubleshooting

### If npm install fails:
1. Delete `node_modules` folder if it exists
2. Delete `package-lock.json` if it exists
3. Run `npm install` again

### If port 5173 is already in use:
Vite will automatically use the next available port (5174, 5175, etc.)

### Clear browser cache:
If you see styling issues, try hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

## Next Steps

Once the development server is running:

1. **Test all pages**: Navigate through all routes to ensure everything works
2. **Test admin features**: Login and try adding/editing content
3. **Test note submission**: Submit a note and approve it as admin
4. **Test gallery**: Add images and view them in the lightbox
5. **Test responsiveness**: Resize browser to test mobile/tablet views

## Building for Production

When ready to deploy:

```bash
npm run build
```

This creates optimized production files in the `dist` folder. You can deploy these files to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront

## Notes

- All data is stored in browser's localStorage
- Refreshing the page keeps the data
- Clearing browser data will reset to initial state
- No real backend is required for this version
- The admin login is client-side only (not secure for real production use)

For any issues or questions, please refer to the README.md file.
