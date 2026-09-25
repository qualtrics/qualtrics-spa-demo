import { Link, useSearchParams } from "react-router-dom";

const items = ["Starter plan", "Standard plan", "Unlimited plan"];

export default function Products() {
  const [params] = useSearchParams();
  const promo = params.get("promo");

  return (
    <>
      <h1>Products</h1>
      <ul className="plans">
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <p className="qtip">Point an intercept at this page with "URL contains /products".</p>

      <h2>Query strings count too</h2>
      {promo ? (
        <p>
          Promo <code>{promo}</code> is on. Same path as before, only the query string changed, and
          the counter still moved. <Link to="/products">Clear it</Link>.
        </p>
      ) : (
        <p>
          <Link to="/products?promo=spring">Add ?promo=spring</Link>. Same path, different URL. The
          hook watches the query string, so it re-runs.
        </p>
      )}
    </>
  );
}
