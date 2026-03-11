import './globals.css';
import AuthProvider from '@/components/AuthProvider';

export const metadata = {
  title: 'SocialBoost Dashboard',
  description: 'Premium Social Media Management Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
