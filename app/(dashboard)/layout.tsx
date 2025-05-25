import Link from 'next/link';
import { CircleIcon } from 'lucide-react';
import { ClientUserMenu } from '@/components/user-menu';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <CircleIcon className="h-6 w-6" />
              <span className="font-bold">SSIIXX</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <ClientUserMenu />
          </div>
        </div>
      </header>
      {children}
    </section>
  );
}
