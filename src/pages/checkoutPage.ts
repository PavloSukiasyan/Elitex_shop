import { Page } from "@playwright/test";

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  private base = this.page.locator("#app");
  headerBanner = this.base.locator("header span");

  private asidePart = this.base.locator("aside");
  private resourceListItems = this.asidePart.locator(
    'div[role="table"][aria-labelledby="ResourceList0"]',
  );
  quantity = this.resourceListItems.locator("p").nth(0);
  productName = this.resourceListItems.locator("p").nth(1);
  deliveryOption = this.resourceListItems.locator("p").nth(2);
  price = this.resourceListItems.locator('span[class*="notranslate"]');

  private moneyLineItems = this.asidePart.locator(
    'div[role="table"][aria-labelledby="MoneyLine-Heading0"] p',
  );
}
