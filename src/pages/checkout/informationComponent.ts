import { Page } from "@playwright/test";

export class InformationComponent {
  constructor(private readonly page: Page) {}

  private mainCheckout = this.page.locator("#checkout-main");
  googlePayBtn = this.mainCheckout.locator("#google-pay-button-container button");

  private sectionContact = this.mainCheckout.locator('section[aria-label="Contact"]');
  contactFieldLabel = this.sectionContact.locator("#step-section-primary-header");
  emailInput = this.sectionContact.locator("input#email");

  private shippingAddress = this.mainCheckout.locator('section[aria-label="Shipping address"]');
  shippingAreaFieldLabel = this.shippingAddress.locator("h2");
  private shippingAreaForm = this.shippingAddress.locator("#shippingAddressForm");

  firstNameInput = this.shippingAreaForm.locator('input[id*="TextField"][name="firstName"]');
  lastNameInput = this.shippingAreaForm.locator('input[id*="TextField"][name="lastName"]');
  addressInput = this.shippingAreaForm.locator(
    'input[name="address1"][id*="address"]:not([aria-hidden="true"])',
  );

  cityInput = this.shippingAreaForm.locator('input[name="city"]:not([aria-hidden="true"])');
  stateSelect = this.shippingAreaForm.locator('select[name="zone"]:not([aria-hidden="true"])');
  postalCodeInput = this.shippingAreaForm.locator(
    'input[name="postalCode"]:not([aria-hidden="true"])',
  );

  private addressAutoCompleteComboBox = this.page.locator(
    '#PortalHost div[aria-labelledby*="autocomplete-title"]',
  );
  addressSuggestionsOptions = this.addressAutoCompleteComboBox.locator("ul#address1-options li");

  continueToNextStepBtn = this.mainCheckout.locator(
    'button[type="submit"]:not([aria-hidden="true"])',
  );

  async fillInformationForm(
    email: string,
    fistName: string,
    lastName: string,
    address: string,
    indexOfSearch = 0,
  ) {
    await this.emailInput.fill(email);
    await this.firstNameInput.fill(fistName);
    await this.lastNameInput.fill(lastName);
    await this.addressInput.fill(address);
    await this.addressSuggestionsOptions.nth(indexOfSearch).click();
    // click away to close suggestions list
    await this.lastNameInput.click();
  }

  async getStateSelectedValue() {
    let result: string;
    const selectValue = await this.stateSelect.inputValue();

    if (selectValue === "AL") {
      result = "Alabama";
    } else if (selectValue === "AK") {
      result = "Alaska";
    } else if (selectValue === "NY") {
      result = "New York";
    } else {
      result = "There can be More States! Add them! or do something else";
    }
    return result;
  }
}
