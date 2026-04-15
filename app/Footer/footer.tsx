import Link from 'next/link';
import './footer.css';
import { socialLinks } from '@/app/site-content';

export default function Footer() {
    return (
        <div className="footer-body">
            <div className="footer-inner">
                <div className="footer-brand">
                    <strong>QuickSlate</strong>
                    <p>Copyright © QuickSlate, 2026</p>
                </div>
                <div className="footer-contact">
                    <a href={socialLinks.email}>{socialLinks.emailLabel}</a>
                    <Link href={socialLinks.instagram} target='_blank'>Instagram</Link>
                    <Link href={socialLinks.tiktok} target='_blank'>TikTok</Link>
                    <Link href={socialLinks.linkedin} target='_blank'>LinkedIn</Link>
                </div>
            </div>
        </div>
    )
}
