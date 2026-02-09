import Link from "next/link";
import { appConfig } from "@/lib/config";

export default function HomePage() {
  return (
    <main className="landing">
      <section className="hero card">
        <span className="eyebrow">Ship faster. Look incredible.</span>
        <h1 className="heroTitle">
          Launch paid products in days with <span>{appConfig.productName}</span>.
        </h1>
        <p className="heroLead">{appConfig.tagline}</p>
        <div className="heroCtas">
          <Link href="/pricing" className="cta">
            Start building
          </Link>
          <Link href="/dashboard" className="cta secondaryCta">
            See dashboard
          </Link>
        </div>
        <p className="heroIcp">Built for {appConfig.icp}.</p>
      </section>

      <section className="signalStrip" aria-label="Product signals">
        <article className="signalItem card">
          <p className="signalLabel">Time to first checkout</p>
          <p className="signalValue">Under 1 week</p>
        </article>
        <article className="signalItem card">
          <p className="signalLabel">Core stack</p>
          <p className="signalValue">
            {appConfig.stack.auth} + {appConfig.stack.billing} + {appConfig.stack.orm}
          </p>
        </article>
        <article className="signalItem card">
          <p className="signalLabel">Default release rhythm</p>
          <p className="signalValue">Weekly shipping</p>
        </article>
      </section>

      <section className="valueGrid" aria-label="Value propositions">
        {appConfig.valueProps.map((item, index) => (
          <article className="card valueCard" key={item.title}>
            <span className="cardIndex">{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="featureRail">
        <article className="card featurePanel">
          <p className="panelEyebrow">Outcome-first baseline</p>
          <h2>From idea to first invoice without rebuilding your foundation.</h2>
          <p>
            Keep auth, billing, and data boundaries stable while your product and pricing evolve.
            The stack starts focused and scales with you.
          </p>
        </article>
        <article className="card featurePanel">
          <p className="panelEyebrow">Built for momentum</p>
          <h2>Opinionated defaults that still leave room for your product voice.</h2>
          <p>
            Move fast with a clean base, then customize the UI system, checkout flow, and dashboard
            logic as usage grows.
          </p>
        </article>
      </section>
    </main>
  );
}
