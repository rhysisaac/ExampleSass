import Link from "next/link";
import { appConfig } from "@/lib/config";

export default function HomePage() {
  return (
    <main className="landing">
      <section className="card hero">
        <p className="eyebrow">Built for fast SaaS validation</p>
        <h1 className="heroTitle">
          Convert early adopters for <span>{appConfig.productName}</span> in one focused workflow.
        </h1>
        <p>{appConfig.tagline}</p>
        <p>
          For <strong>{appConfig.icp}</strong>.
        </p>
        <Link href="/pricing" className="cta">
          Start paid pilot
        </Link>
      </section>
      <section className="grid">
        {appConfig.valueProps.map((item) => (
          <article className="card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
