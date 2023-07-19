import { Page } from "@playwright/test";

export class CheckoutHeaderComponent {
  constructor(private readonly page: Page) {}

  headerBanner = this.page.locator('header[role="banner"] span');
}
