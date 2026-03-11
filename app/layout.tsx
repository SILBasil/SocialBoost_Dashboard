import './globals.css';

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
      <body>{children}</body>
    </html>
  )
}
