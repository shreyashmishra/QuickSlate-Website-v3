'use client';
import Link from 'next/link'
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Img from '../../public/invertqs.png';
import './navbar.scss';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    { href: '/About', label: 'About' },
    { href: '/Team', label: 'Team' },
    { href: '/Services', label: 'Services' },
    { href: '/Portfolio', label: 'Portfolio' },
    { href: '/Contact', label: 'Contact' },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href));

  // Close mobile menu when switching to desktop breakpoint
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    const handle = (e: MediaQueryListEvent) => { if (e.matches) setOpen(false); };
    mq.addEventListener?.('change', handle);
    return () => mq.removeEventListener?.('change', handle);
  }, []);

  return (
    <nav className={`bodys${open ? ' open' : ''}`} aria-label="Primary">
      <div className='nav-shell'>
        <div className='image'>
          <Link href='/' aria-label='Home' className='brand' onClick={() => setOpen(false)}>
            <Image className='logo' src={Img} width={192} height={192} alt="QuickSlate logo" priority />
            <div className='brand-copy'>
              <span>QuickSlate</span>
              <small>Films and visual campaigns</small>
            </div>
          </Link>
        </div>
        <div className='right'>
          <button
            className='menu-toggle'
            aria-label='Toggle menu'
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span/>
            <span/>
            <span/>
          </button>
          <div className={`links${open ? ' show' : ''}`}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={isActive(l.href) ? 'active' : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
