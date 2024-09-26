'use client';
import Button from '@mui/material/Button';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function HomePage() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <div>Welcome, {session.user?.name}!</div>
        <Button variant="outlined" onClick={() => signOut()}>Sign out</Button>
      </>
    );
  }

  return (
    <>
      <div>You are not logged in.</div>
      <Button variant="outlined" onClick={() => signIn()}>Sign in</Button>
    </>
  );
}