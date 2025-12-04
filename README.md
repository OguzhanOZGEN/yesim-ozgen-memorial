# Yeşim Özgen Memorial Website

A memorial website built with React, TypeScript, and Tailwind CSS to honor the memory of Yeşim Özgen, a beloved teacher.

## Features

- 🏠 **Home Page**: Hero section with photo, note submission form, and gallery preview
- 📝 **Notes Page**: Visitors can share memories, admin can approve/reject submissions
- 🖼️ **Gallery Page**: Photo gallery with lightbox view, admin can add/edit/delete images
- 📄 **Resume Page**: Biography with admin editing capabilities
- 🏆 **Achievements Page**: List of achievements with admin editing
- 📞 **Contact Page**: Contact information for family members
- 🔐 **Admin Authentication**: Simple login system (username: admin, password: admin)
- 💾 **Local Storage**: All data persists in browser localStorage

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with turquoise theme
- **React Router** - Client-side routing
- **Vite** - Build tool
- **Google Fonts** - Newsreader (display) and Noto Sans (body)
- **Material Symbols** - Icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/
│   └── mock.ts              # Mock API with localStorage
├── components/
│   ├── Footer.tsx           # Footer component
│   ├── GalleryLightbox.tsx  # Image lightbox
│   ├── LoginModal.tsx       # Admin login modal
│   ├── Navbar.tsx           # Navigation bar
│   ├── NoteCard.tsx         # Note display card
│   └── index.ts             # Component exports
├── context/
│   └── AuthContext.tsx      # Authentication context
├── layouts/
│   └── RootLayout.tsx       # Main layout with nav/footer
├── pages/
│   ├── AchievementsPage.tsx # Achievements page
│   ├── ContactPage.tsx      # Contact information
│   ├── GalleryPage.tsx      # Photo gallery
│   ├── HomePage.tsx         # Home/landing page
│   ├── NotesPage.tsx        # Memory notes
│   ├── ResumePage.tsx       # Biography
│   └── index.ts             # Page exports
├── types/
│   └── index.ts             # TypeScript types
├── utils/
│   └── date.ts              # Date formatting utilities
├── App.tsx                  # Main App component
├── main.tsx                 # Entry point
└── index.css                # Global styles
```

## Admin Features

To access admin features:

1. Click "Giriş Yap" (Login) in the navigation
2. Enter credentials:
   - Username: `admin`
   - Password: `admin`
3. Admin mode enables:
   - Approve/reject pending notes
   - Add/edit/delete gallery images
   - Edit resume and achievements content
   - Manage contact information

## Theme Colors

- Primary (Turquoise): `#14b8a6`
- Primary Dark: `#0d9488`
- Light Background: `#f6f6f8`
- Dark Background: `#131022`

## License

This project is created for memorial purposes.
