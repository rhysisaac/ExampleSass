import { plans } from "@/lib/billing";

export default function PricingPage() {
  const plan = plans[0];
  if (!plan) {
    throw new Error("No billing plans configured.");
  }

  return (
    <main className="pricing">
      <h1>Pricing</h1>
      <p>One plan. Start simple, expand when you need to.</p>
      <article className="card pricingCard">
        <h2>{plan.name}</h2>
        <p className="priceLine">
          <span className="priceAmount">${plan.priceMonthly}</span>
          <span className="pricePeriod">/mo</span>
        </p>
        <p>{plan.description}</p>
        <ul>
          {plan.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <form action="/api/stripe/checkout" method="post">
          <input type="hidden" name="planId" value={plan.id} />
          <button className="cta" type="submit">
            Start now
          </button>
        </form>
      </article>
    </main>
  );
}
