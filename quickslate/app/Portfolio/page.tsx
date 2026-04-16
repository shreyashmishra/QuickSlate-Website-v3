import Link from "next/link";
import ProjectCarousel from "@/app/components/ProjectCarousel";
import { portfolioLinks } from "@/app/site-content";
import { fetchWebsiteBCarouselItems } from "@/lib/website-b-carousel";
import "./portfolio.scss";

export const dynamic = "force-dynamic";

export default async function Portfolio() {
  const carousel = await fetchWebsiteBCarouselItems();

  return (
    <main className="portfolio-page">
      <section className="portfolio-hero">
        <p className="portfolio-kicker">Portfolio</p>
        <h1>Films, campaigns, and visual work.</h1>
        <p>
          A growing collection of productions, posters, and promotional work from the
          QuickSlate slate.
        </p>
      </section>

      <section className="portfolio-block">
        {carousel.items.length > 0 ? (
          <ProjectCarousel items={carousel.items} />
        ) : (
          <div className="portfolio-feed-state" role="status">
            <p className="portfolio-kicker">Shared carousel</p>
            <h2>Carousel images are not available yet.</h2>
            <p>
              {carousel.errorMessage ??
                "Website B has not published any visible carousel images yet."}
            </p>
          </div>
        )}
      </section>

      <section className="portfolio-block">
        <div className="portfolio-section-heading">
          <h2>Watch and reference links</h2>
          <p>
            Current Instagram, YouTube, and poster references collected from the active
            QuickSlate slate.
          </p>
        </div>

        <div className="portfolio-link-grid">
          {portfolioLinks.map((item) => (
            <article key={item.href} className="portfolio-link-card">
              <p>{item.category}</p>
              <h3>{item.title}</h3>
              <span>{item.description}</span>
              <Link href={item.href} target="_blank">
                Open reference
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
