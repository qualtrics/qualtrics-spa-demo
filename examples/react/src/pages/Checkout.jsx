import { useState } from "react";

export default function Checkout() {
  const [done, setDone] = useState(false);

  if (done)
    return (
      <>
        <h1>Done</h1>
        <p>Nothing was sent anywhere.</p>
      </>
    );

  return (
    <>
      <h1>Checkout</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          setDone(true);
        }}
      >
        <label>
          Email
          <input type="email" required autoComplete="off" />
        </label>
        <button type="submit">Place order</button>
      </form>
    </>
  );
}
