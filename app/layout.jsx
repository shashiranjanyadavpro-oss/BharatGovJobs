import './globals.css';

export const metadata = {
  title: 'BharatGovJobs - Fast Govt Jobs & Notifications',
  description: 'Pure Bharat 40/60 Strategy - Big Jobs & Verified District Level Vacancies',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FFFBF7] text-zinc-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
