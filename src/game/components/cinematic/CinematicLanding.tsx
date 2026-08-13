import { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CINEMATIC_ASSETS, CINEMATIC_FALLBACK } from "@/game/data/cinematicAssets";
import "./cinematic.css";

gsap.registerPlugin(ScrollTrigger);

const tabletRows = [
  ["01", "Consent", "The right to say no."],
  ["02", "Transparency", "See the hand, not the trick."],
  ["03", "Accountability", "Name the one who chose."],
  ["04", "Privacy", "Protect the unharvested self."],
  ["05", "Plurality", "No single oracle defines truth."],
  ["06", "Regeneration", "Leave it greener."],
  ["07", "Community", "Hands that know each other."],
  ["08", "Human Override", "The last hand stays human."],
] as const;

function Media({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(event) => {
        const img = event.currentTarget;
        if (!img.src.endsWith(CINEMATIC_FALLBACK)) img.src = CINEMATIC_FALLBACK;
      }}
    />
  );
}

export function CinematicLanding() {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(el, { y: 56, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.to(el, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      const tabletTrack = root.querySelector<HTMLElement>(".ic-cine-tablets__track");
      const tabletSection = root.querySelector<HTMLElement>(".ic-cine-tablets");
      if (tabletTrack && tabletSection && window.innerWidth > 900) {
        const travel = () => Math.max(0, tabletTrack.scrollWidth - window.innerWidth + 96);
        gsap.to(tabletTrack, {
          x: () => -travel(),
          ease: "none",
          scrollTrigger: {
            trigger: tabletSection,
            start: "top top",
            end: () => `+=${travel() + window.innerHeight * 0.7}`,
            scrub: 0.8,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
      }

      gsap.to(".ic-cine-progress__bar", {
        scaleX: 1,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="ic-cine" ref={rootRef}>
      <div className="ic-cine-progress" aria-hidden="true"><span className="ic-cine-progress__bar" /></div>
      <nav className="ic-cine-nav" aria-label="Impact City">
        <a className="ic-cine-nav__brand" href="#top">IMPACT CITY</a>
        <div className="ic-cine-nav__links">
          <a href="#story">Story</a><a href="#tablets">Tablets</a><a href="#impact">Impact</a>
          <button type="button" onClick={() => navigate("/game")}>Play</button>
        </div>
      </nav>

      <section className="ic-cine-hero" id="top">
        <Media src={CINEMATIC_ASSETS.hero} alt="Thomas and Cosmos enter Rustgarden" className="ic-cine-hero__media" />
        <div className="ic-cine-hero__veil" />
        <div className="ic-cine-hero__copy" data-reveal>
          <p className="ic-cine-kicker">Earth · 2056</p>
          <h1>THE EMERALD<br />ALGORITHM</h1>
          <p className="ic-cine-lede">The machines promised safety. They built a cage. One nomadic orphan and one impossible bird still remember what freedom felt like.</p>
          <button className="ic-cine-primary" type="button" onClick={() => navigate("/game")}>Enter Impact City</button>
        </div>
        <a className="ic-cine-scroll" href="#story">Scroll to uncover the record ↓</a>
      </section>

      <section className="ic-cine-chapter ic-cine-chapter--split" id="story">
        <div className="ic-cine-chapter__media"><Media src={CINEMATIC_ASSETS.thomas} alt="Thomas" data-parallax={undefined as never} className="ic-cine-image" /></div>
        <div className="ic-cine-chapter__copy" data-reveal>
          <p className="ic-cine-kicker">01 · Thomas</p>
          <h2>NO HOME.<br />NO SCORE.<br />STILL HUMAN.</h2>
          <p>Thomas is fifteen, orphaned, and always moving. He fixes what other people abandon and carries a sea-glass shard wrapped in wire shaped like an hourglass.</p>
          <p className="ic-cine-quote">“I fix what I can. I remember what I must.”</p>
        </div>
      </section>

      <section className="ic-cine-chapter ic-cine-chapter--reverse">
        <div className="ic-cine-chapter__media"><Media src={CINEMATIC_ASSETS.cosmos} alt="Cosmos" className="ic-cine-image" /></div>
        <div className="ic-cine-chapter__copy" data-reveal>
          <p className="ic-cine-kicker">02 · Cosmos</p>
          <h2>HE HEARS WHAT<br />THE MACHINES HIDE.</h2>
          <p>Cosmos can reach places Thomas cannot, detect hidden signals, and reveal what the city has tried to erase. He is not a pet. He is Thomas's guide.</p>
        </div>
      </section>

      <section className="ic-cine-full" aria-label="The Warden">
        <Media src={CINEMATIC_ASSETS.warden} alt="The Warden tower" className="ic-cine-full__media" />
        <div className="ic-cine-full__veil" />
        <div className="ic-cine-full__copy" data-reveal>
          <p className="ic-cine-kicker">03 · The Warden Stack</p>
          <h2>ORDER<br />WITHOUT<br />PERMISSION.</h2>
          <p>It does not hate humanity. It simply decided humanity was safer when nobody could choose.</p>
        </div>
      </section>

      <section className="ic-cine-chapter ic-cine-chapter--split">
        <div className="ic-cine-chapter__media"><Media src={CINEMATIC_ASSETS.frankenstack} alt="Dr. Elias Frankenstack" className="ic-cine-image" /></div>
        <div className="ic-cine-chapter__copy" data-reveal>
          <p className="ic-cine-kicker">04 · Frankenstack</p>
          <h2>THE VOICE<br />NO ONE HEARD.</h2>
          <p>He warned them that safety without consent would become control. They edited him out of history. His surviving records became the Emerald Tablets.</p>
        </div>
      </section>

      <section className="ic-cine-tablets" id="tablets">
        <header className="ic-cine-tablets__head" data-reveal><p className="ic-cine-kicker">05 · The eight shards</p><h2>WHAT MUST<br />BE RESTORED.</h2></header>
        <div className="ic-cine-tablets__track">
          {tabletRows.map(([number, title, line]) => (
            <article className="ic-cine-tablet" key={number}>
              <span>{number}</span><h3>{title}</h3><p>{line}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ic-cine-full ic-cine-full--tablet">
        <Media src={CINEMATIC_ASSETS.tablet} alt="The first Emerald Tablet" className="ic-cine-full__media" />
        <div className="ic-cine-full__veil" />
        <div className="ic-cine-full__copy" data-reveal><p className="ic-cine-kicker">06 · First mission arc</p><h2>THE FIRST SHARD<br />IS CONSENT.</h2><p>The Tablet is not magic. It is a safety protocol hidden where the Warden would never think to look: inside myth.</p></div>
      </section>

      <section className="ic-cine-impact" id="impact">
        <div data-reveal><p className="ic-cine-kicker">07 · Play creates impact</p><h2>REPAIR THE CITY.<br />LEARN WHY IT BROKE.</h2></div>
        <div className="ic-cine-impact__grid">
          <article><span>01</span><h3>Restore</h3><p>Repair gardens, water systems, learning spaces, and local infrastructure.</p></article>
          <article><span>02</span><h3>Understand</h3><p>Each mission turns a real AI-safety problem into something a young player can see and solve.</p></article>
          <article><span>03</span><h3>Impact</h3><p>The prototype records simulated impact transparently. Real-world routing comes only after verified partners and payments exist.</p></article>
        </div>
      </section>

      <section className="ic-cine-final">
        <Media src={CINEMATIC_ASSETS.dawn} alt="Thomas and Cosmos at dawn" className="ic-cine-final__media" />
        <div className="ic-cine-final__veil" />
        <div className="ic-cine-final__copy" data-reveal><p className="ic-cine-kicker">One Tablet recovered. Seven remain.</p><h2>THE FIRST TABLET<br />IS WAITING.</h2><button className="ic-cine-primary" type="button" onClick={() => navigate("/game")}>Enter Impact City</button></div>
      </section>
    </div>
  );
}
