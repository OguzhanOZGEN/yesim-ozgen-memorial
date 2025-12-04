import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RootLayout } from './layouts/RootLayout';
import {
  HomePage,
  NotesPage,
  GalleryPage,
  ResumePage,
  AchievementsPage,
  ContactPage,
} from './pages';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="ozgecmis" element={<ResumePage />} />
            <Route path="galeri" element={<GalleryPage />} />
            <Route path="notlar" element={<NotesPage />} />
            <Route path="basarilar" element={<AchievementsPage />} />
            <Route path="iletisim" element={<ContactPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
