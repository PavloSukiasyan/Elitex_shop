import { Page } from "@playwright/test";

export class ShippingComponent {
  constructor(private readonly page: Page) {}

  sectionReview = this.page.locator('section[aria-label="Review"]');
}
