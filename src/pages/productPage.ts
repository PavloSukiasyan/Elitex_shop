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

  deliveryFrequencyTitle = this.prStacked.locator(".smartrr-deliver-frequency");
  deliverySelect = this.prStacked.locator("select");

  prDescription = this.prStacked.locator('[class*="product__description rte quick-add-hidden"]');

  prButtons = this.prStacked.locator(".product-form__buttons");
  addToCartBtn = this.prButtons.locator('button[class*="product-form__submit"]');
  buyItNowBtn = this.prButtons.locator('button[data-testid="Checkout-button"]');

  async getDeliverySelectedValue() {
    let result: string;
    const selectValue = await this.deliverySelect.inputValue();
    if (selectValue === "3253633272") {
      result = "Monthly";
    } else if (selectValue === "3253829880") {
      result = "Weekly";
    } else {
      result = "Some wrong option";
    }
    return result;
  }
}
