import Image from "next/image";
import Link from "next/link";
import { teamMembers } from "@/app/site-content";
import "./team.scss";

export default function TeamPage() {
  return (
    <main className="team-page">
      <section className="team-hero">
        <p>Team</p>
        <h1>The people behind QuickSlate.</h1>
        <span>All members and available photos live here on their own dedicated page.</span>
      </section>

      <section className="team-grid-page">
        {teamMembers.map((member) => (
          <article key={member.name} className="team-profile-card">
            {member.image ? (
              <div className="team-profile-card__image-wrap">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="team-profile-card__image"
                  sizes="(max-width: 800px) 100vw, 33vw"
                />
              </div>
            ) : (
              <div className="team-profile-card__placeholder">
                <span>{member.name.split(" ").map((part) => part[0]).join("")}</span>
              </div>
            )}

            <div className="team-profile-card__content">
              <h2>{member.name}</h2>
              <p>{member.title}</p>
              <span>{member.bio}</span>
              {member.linkedin ? (
                <Link href={member.linkedin} target="_blank">
                  LinkedIn
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
