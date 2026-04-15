import { faqItems } from "@/app/site-content";
import "./about.scss";

export default function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <p>About</p>
        <h1>What we do, where we came from, and who to contact.</h1>
        <span>
          A film studio and campaign collective focused on production, consulting,
          distribution, and promotion.
        </span>
      </section>

      <section className="about-grid">
        <article className="about-card">
          <h2>What we do</h2>
          <p>
            QuickSlate develops visual work across production, pre-production consulting,
            YouTube distribution, and platform-specific promotion.
          </p>
        </article>

        <article className="about-card">
          <h2>Our history</h2>
          <p>
            The current version positions QuickSlate as a studio with work in active
            development and a growing release slate. Swap in the final origin story when
            you are ready to publish it.
          </p>
        </article>
      </section>

      <section className="about-faq">
        <div className="about-team__heading">
          <h2>Frequently asked questions</h2>
          <p>Concise answers for first-time visitors and potential clients.</p>
        </div>

        <div className="about-faq__grid">
          {faqItems.map((item) => (
            <article key={item.question} className="about-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
