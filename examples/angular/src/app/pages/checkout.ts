import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-checkout',
  template: `
    @if (done()) {
      <h1>Done</h1>
      <p>Nothing was sent anywhere.</p>
    } @else {
      <h1>Checkout</h1>
      <form (submit)="place($event)">
        <label>
          Email
          <input type="email" required autocomplete="off" />
        </label>
        <button type="submit">Place order</button>
      </form>
    }
  `,
})
export class Checkout {
  protected done = signal(false);

  protected place(event: Event): void {
    event.preventDefault();
    this.done.set(true);
  }
}
