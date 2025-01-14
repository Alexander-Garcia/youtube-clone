'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import styles from './navbar.module.css';
import SignIn from './sign-in';
import { onAuthStateChangedHelper } from '../firebase/firebase';

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
            <Link href="/" className={styles.logoContainer}>
                <Image
                    src="/youtube-logo.svg"
                    alt="Youtube Logo"
                    width={100}
                    height={30}
                />
            </Link>
            <SignIn user={user} />
        </nav>
    );
}