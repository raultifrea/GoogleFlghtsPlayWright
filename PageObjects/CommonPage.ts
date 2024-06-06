import { Locator, Page, expect } from "@playwright/test";

export default class CommonPage {
    page: Page
    currency: Locator
    ok: Locator
    allFilters: Locator;
    closeFilters: Locator;

    constructor(page: Page){
        this.page = page;
        this.currency = page.locator('button:has-text("Currency")');
        this.ok = page.locator('//*[text()="OK"]');
        this.allFilters = page.locator('//span[contains(text(),"All filters")]');
        this.closeFilters = page.locator("//h1[text()='Filters']//following::div[1]");
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

    /**
     * @returns the current date in Month.Day.Year format
     */
    async getToday() {
        let today = new Date();
        let year = today.getFullYear();
        let month = String(today.getMonth() + 1).padStart(2, '0'); // JavaScript months are 0-based.
        let day = String(today.getDate()).padStart(2, '0');
        const todaysDate = `${month}.${day}.${year}`; //US format needed for execution
        return todaysDate;
    }

    /**
     * 
     * @param days the number of days in advance of today's date we want to check for
     * @returns the date in Month.Day.Year format
     */
    async getFutureDate(days: number) {
        let date = new Date();
        date.setDate(date.getDate() + days);
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '');
        let day = String(date.getDate()).padStart(2, '0');
        const futureDate = `${month}.${day}.${year}`; //US format needed for execution
        return futureDate;
    }
}