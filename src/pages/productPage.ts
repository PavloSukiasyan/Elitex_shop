import { Page } from "@playwright/test";

export class ProductPage {
  constructor(private readonly page: Page) {}

  base = this.page.locator(".gradient");
  topLabel = this.base.locator('[class*="announcement-bar "] p');

  mainContent = this.base.locator("#MainContent");
  prStacked = this.base.locator('[class*="product--large product--left product--stacked"]');
  prTitle = this.prStacked.locator(".product__title h1");
  prPrice = this.prStacked.locator("span[data-smartrr-subscribe-price]");

  prQuantityInput = this.prStacked.locator("input.quantity__input");

  prSellingPlanGroups = this.prStacked.locator("[data-smartrr-selling-plan-groups]");

  sellingOptOne = this.prStacked.locator("[data-smartrr-selling-plan-group-id]").nth(0);
  sellingOptTwo = this.prStacked.locator("[data-smartrr-selling-plan-group-id]").nth(1);
  sellingOptionOneInput = this.sellingOptOne.locator('div[class*="input-display"]');
  sellingOptionTwoInput = this.sellingOptTwo.locator('div[class*="input-display"]');
  sellingOptionOneName = this.sellingOptOne.locator(".smartrr-selling-plan-group-name div");
  sellingOptionTwoName = this.sellingOptTwo.locator(".smartrr-selling-plan-group-name div");
}
