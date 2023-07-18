import { Page } from "@playwright/test";

export class CommonSteps {
  constructor(private readonly page: Page) {}

  async openTestStore() {
    await this.page.goto("/products/test-product-cherry");
  }
}
