import { Page } from "@playwright/test";

export class CommonSteps {
  constructor(private readonly page: Page) {}

  async openHomePage() {
    await this.page.goto("/");
  }

  async openTestStore() {
    await this.page.goto("/products/test-product-cherry");
  }
}
