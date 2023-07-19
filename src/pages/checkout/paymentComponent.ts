import { Page } from "@playwright/test";

export class PaymentComponent {
  constructor(private readonly page: Page) {}

  private sectionPayment = this.page.locator('section[aria-label="Payment"]');
  private cardNumberFrame = this.sectionPayment.frameLocator("iframe.card-fields-iframe");
  cardNumberField = this.cardNumberFrame.nth(0).locator("input#number");
  cardNameField = this.cardNumberFrame.nth(1).locator("input#name");
  cardExpirationField = this.cardNumberFrame.nth(2).locator("input#expiry");
  cardSecurityField = this.cardNumberFrame.nth(3).locator("input#verification_value");

  async fillPaymentCardDetails(firstName: string, lastName: string) {
    await this.cardNumberField.fill("4242424242424242");
    await this.cardNameField.fill(`${firstName} ${lastName}`);
    await this.cardExpirationField.fill("0825");
    await this.cardSecurityField.fill("777");
  }
}
