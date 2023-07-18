import { Page } from "@playwright/test";

export class PasswordPage {
  constructor(private readonly page: Page) {}

  base = this.page.locator(".wrapper");
  contentTitle = this.base.locator(".content--block b");
  storeInput = this.base.locator(".content--block form input#password");
  submitBtn = this.base.locator("button");

  async submitPassword(pass: string) {
    await this.storeInput.fill(pass);
    await this.submitBtn.click();
  }
}
