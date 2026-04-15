'use client';

import Link from "next/link";
import { BsInstagram, BsLinkedin, BsTiktok } from "react-icons/bs";
import { socialLinks } from "@/app/site-content";
import "./home.scss";

export default function Home() {
  return (
    <main className="home-page">
      <section className="hero-panel">
        <div className="hero-panel__backdrop" aria-hidden="true" />
        <div className="hero-panel__content">
          <p className="section-kicker">QuickSlate</p>
          <h1>Films, campaigns, and digital storytelling.</h1>
          <p className="hero-panel__lede">
            QuickSlate develops cinematic work across production, consulting,
            distribution, and promotion.
          </p>

          <div className="hero-panel__actions">
            <Link href="/About" className="button button--solid">
              Explore QuickSlate
            </Link>
            <Link href="/Portfolio" className="button button--outline">
              View Portfolio
            </Link>
          </div>

          <div className="social-row">
            <a href={socialLinks.instagram} target="_blank" aria-label="Instagram">
              <BsInstagram />
            </a>
            <a href={socialLinks.linkedin} target="_blank" aria-label="LinkedIn">
              <BsLinkedin />
            </a>
            <a href={socialLinks.tiktok} target="_blank" aria-label="TikTok">
              <BsTiktok />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
