'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';

export function NavbarWrapper() {
    const pathname = usePathname();

    // Don't show navbar on the home page
    if (pathname === '/') {
        return null;
    }

    return <Navbar />;
} 