import { plans } from "@/lib/billing";

export default function PricingPage() {
  const plan = plans[0];
  if (!plan) {
    throw new Error("No billing plans configured.");
  }

  return (
    <main>
      <h1>Pricing</h1>
      <p>One paid tier until demand proves you need more complexity.</p>
      <article className="card">
        <h2>{plan.name}</h2>
        <p style={{ fontSize: "1.75rem", fontWeight: 700 }}>${plan.priceMonthly}/mo</p>
        <p>{plan.description}</p>
        <ul>
          {plan.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <form action="/api/stripe/checkout" method="post">
          <input type="hidden" name="planId" value={plan.id} />
          <button className="cta" type="submit">
            Continue to checkout
          </button>
        </form>
      </article>
    </main>
  );
}
