import { Page } from "@playwright/test";

export class ThankYouPage {
  constructor(private readonly page: Page) {}

  private thankYouStep = this.page.locator('[data-step="thank_you"]');
  orderNumber = this.thankYouStep.locator(".os-order-number");
  orderHeaderTitle = this.thankYouStep.locator(".os-header__title");
}
