import { Locator, Page, expect } from "@playwright/test";

export default class CommonPage {
    page: Page
    currency: Locator
    ok: Locator

    constructor(page: Page){
        this.page = page;
        this.currency = page.locator('button:has-text("Currency")');
        this.ok = page.locator('//*[text()="OK"]');
    }

    /**
     * switches currency of flight prices from the current one to the requested one
     * @param newCurrency the new currency to display prices in, based on three-letter ISO code. e.g EUR
     */
    async changeCurrency(newCurrency: string) {
        await this.currency.click();
        expect(this.page.getByRole('radiogroup').isVisible()).toBeTruthy();
        await this.page.getByRole('radiogroup').locator(`[value=${newCurrency}]`).click();
        await this.ok.click();
        expect(this.page.locator(`//span[text()="${newCurrency}"]`).isVisible()).toBeTruthy();
    }
}