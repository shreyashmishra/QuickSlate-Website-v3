'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PortfolioItem } from "@/app/site-content";
import "./project-carousel.scss";

type ProjectCarouselProps = {
  items: PortfolioItem[];
};

export default function ProjectCarousel({ items }: ProjectCarouselProps) {
  const [index, setIndex] = useState(0);
  const startXRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setIndex((value) => (value - 1 + items.length) % items.length);
      }

      if (event.key === "ArrowRight") {
        setIndex((value) => (value + 1) % items.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % items.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [items.length]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    startXRef.current = event.touches[0].clientX;
    startTimeRef.current = Date.now();
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (startXRef.current === null || startTimeRef.current === null) {
      return;
    }

    const deltaX = event.changedTouches[0].clientX - startXRef.current;
    const elapsed = Date.now() - startTimeRef.current;

    if (Math.abs(deltaX) > 50 && elapsed < 1000) {
      if (deltaX < 0) {
        setIndex((value) => (value + 1) % items.length);
      } else {
        setIndex((value) => (value - 1 + items.length) % items.length);
      }
    }

    startXRef.current = null;
    startTimeRef.current = null;
  };

  return (
    <div className="project-carousel">
      <button
        className="project-carousel__control"
        aria-label="Previous portfolio item"
        onClick={() => setIndex((value) => (value - 1 + items.length) % items.length)}
      >
        ‹
      </button>

      <div
        className="project-carousel__viewport"
        aria-roledescription="carousel"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="project-carousel__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item) => (
            <article className="project-carousel__slide" key={item.title}>
              <Link href={item.href} target="_blank" className="project-carousel__card">
                <div
                  className="project-carousel__visual"
                  style={
                    item.image
                      ? { backgroundImage: `linear-gradient(rgba(12, 12, 12, 0.2), rgba(12, 12, 12, 0.65)), url(${item.image})` }
                      : undefined
                  }
                >
                  {!item.image ? (
                    <div className="project-carousel__placeholder">
                      <span>{item.category}</span>
                      <strong>{item.title}</strong>
                    </div>
                  ) : null}
                </div>

                <div className="project-carousel__content">
                  <p className="project-carousel__eyebrow">{item.category}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      <button
        className="project-carousel__control"
        aria-label="Next portfolio item"
        onClick={() => setIndex((value) => (value + 1) % items.length)}
      >
        ›
      </button>

      <div className="project-carousel__dots" role="tablist" aria-label="Portfolio slides">
        {items.map((item, dotIndex) => (
          <button
            key={item.title}
            className={dotIndex === index ? "project-carousel__dot is-active" : "project-carousel__dot"}
            aria-selected={dotIndex === index}
            role="tab"
            onClick={() => setIndex(dotIndex)}
          />
        ))}
      </div>
    </div>
  );
}

