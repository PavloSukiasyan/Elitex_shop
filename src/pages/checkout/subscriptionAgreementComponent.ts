import { Page } from "@playwright/test";

export class SubscriptionAgreementComponent {
  constructor(private readonly page: Page) {}

  private sectionWithAgreement = this.page.locator("section");
  alertMessage = this.sectionWithAgreement.locator('div[role="alert"]');
  subscriptionCheckbox = this.sectionWithAgreement.locator(
    "input#vaulting_and_subscription_agreement",
  );
}
