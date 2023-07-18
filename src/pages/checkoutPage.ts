import { Page } from "@playwright/test";

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  base = this.page.locator("#app");
  headerBanner = this.base.locator("header span");
}
