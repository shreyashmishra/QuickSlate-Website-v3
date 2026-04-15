'use client';
import { BsTiktok, BsLinkedin, BsInstagram } from "react-icons/bs";
import './contact.scss';
import { motion } from "motion/react";
import { socialLinks } from "@/app/site-content";

export default function Contact() {
  return (
    <section className="contact-section">
      <div className="container">
        <header className="hero">
          <h1>Contact Us</h1>
          <p>We’d love to hear about your project. We typically reply within 1–2 business days.</p>
        </header>

        <div className="card card--centered">
          <p className="lead">Tell us about timelines, goals, or links to references—anything that helps us understand your vision.</p>
          <a className="email-link" href={socialLinks.email}>{socialLinks.emailLabel}</a>
          <div className="social-wrap">
            <span className="label">Or connect on</span>
            <div className="social-icons">
              <motion.a whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.96 }} href={socialLinks.instagram} target="_blank" aria-label="Instagram">
                <BsInstagram />
              </motion.a>
              <motion.a whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.96 }} href={socialLinks.linkedin} target="_blank" aria-label="LinkedIn">
                <BsLinkedin />
              </motion.a>
              <motion.a whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.96 }} href={socialLinks.tiktok} target="_blank" aria-label="TikTok">
                <BsTiktok />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
