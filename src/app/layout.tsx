// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppContainer from '@/components/AppContainer';
import SessionWrapper from '@/components/SessionWrapper'; // Client-side wrapper
import { StoresProvider } from '@/context/StoresContext';
import LocalizationWrapper from '@/components/LocalizationWrapper'; // Wrapper for localization

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ backgroundColor: 'hsla(0, 0%, 95%, 1.0)' }}>
        {/* Wrapping the app inside Providers */}
        <StoresProvider>
          <SessionWrapper>
            <LocalizationWrapper>
              <AppContainer>{children}</AppContainer>
            </LocalizationWrapper>
          </SessionWrapper>
        </StoresProvider>
      </body>
    </html>
  );
}