import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppContainer from '@/components/AppContainer';
import SessionWrapper from '@/components/SessionWrapper'; // Client-side wrapper
import { StoresProvider } from '@/context/StoresContext';
import LocalizationWrapper from '@/components/LocalizationWrapper'; // Wrapper for localization

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '직영매장 재고관리',
  description: '직영매장 사입, 매장간 재고이동, 월말재고실사 관리',
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
          {/* 클라이언트에서만 실행되는 SessionWrapper */}
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
