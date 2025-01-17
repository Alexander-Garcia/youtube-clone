'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import styles from './navbar.module.css';
import SignIn from './sign-in';
import { onAuthStateChangedHelper } from '../firebase/firebase';
import Upload from './upload';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });

    // Unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <nav className={`${styles.nav} flex justify-between items-center p-4`}>
      <Link href="/">
        <Image
          className={styles.logContainer}
          src="/youtube-logo.svg"
          alt="Youtube Logo"
          width={100}
          height={50}
        />
      </Link>
      {user && <Upload />}
      <SignIn user={user} />
    </nav>
  );
}
