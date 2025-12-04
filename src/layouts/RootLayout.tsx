import { Outlet } from 'react-router-dom';
import { Navbar, Footer, BackgroundMusic } from '@/components';

export function RootLayout() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackgroundMusic />
    </div>
  );
}
