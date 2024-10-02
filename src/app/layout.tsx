// app/layout.tsx
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your App Title',
  description: 'Your App Description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}