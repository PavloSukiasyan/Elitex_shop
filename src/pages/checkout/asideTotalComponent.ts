import { Page } from "@playwright/test";

export class AsideTotalComponent {
  constructor(private readonly page: Page) {}

  private asidePart = this.page.locator("aside");
  private resourceListItems = this.asidePart.locator(
    'div[role="table"][aria-labelledby="ResourceList0"]',
  );
  quantity = this.resourceListItems.locator("p").nth(0);
  productName = this.resourceListItems.locator("p").nth(1);
  deliveryOption = this.resourceListItems.locator("p").nth(2);
  price = this.resourceListItems.locator('span[class*="notranslate"]');

  private moneyLineItems = this.asidePart.locator(
    'div[role="table"][aria-labelledby="MoneyLine-Heading0"]',
  );
  subtotalLabel = this.moneyLineItems.locator("span").nth(0);
  subtotalPrice = this.moneyLineItems.locator("span").nth(1);
  shippingLabel = this.moneyLineItems.locator("span").nth(2);
  shippingValue = this.moneyLineItems.locator("span").nth(3);
  totalLabel = this.moneyLineItems.locator("span").nth(4);

  totalCurrencyLabel = this.moneyLineItems.locator('abbr[class*="notranslate"]');
  totalPrice = this.moneyLineItems.locator('strong[class*="notranslate"]');

  private recurringSubtotal = this.asidePart.locator(
    'section[aria-label="Recurring subtotal"] span',
  );
  recurringSubtotalLabel = this.recurringSubtotal.nth(0);
  recurringSubtotalInfo = this.recurringSubtotal.nth(3);
}
