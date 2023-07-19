import { Page } from "@playwright/test";

export class ShippingComponent {
  constructor(private readonly page: Page) {}

  private sectionReview = this.page.locator('section[aria-label="Review"]');
  email = this.sectionReview.locator("bdo");
  address = this.sectionReview.locator("address");
  shipping = this.sectionReview.locator("p");

  private sectionShippingMethod = this.page.locator('section[aria-label="Shipping method"]');
  shippingMethodLabel = this.sectionShippingMethod.locator("h2#step-section-primary-header");
  descriptionOfShipping = this.sectionShippingMethod
    .locator("fieldset#subscription_shipping_methods p")
    .nth(0);
  priceOfShipping = this.sectionShippingMethod.locator(
    "fieldset#subscription_shipping_methods span",
  );
}
