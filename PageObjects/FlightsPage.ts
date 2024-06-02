import { Locator, Page } from "@playwright/test";
import CommonPage from "./CommonPage";


export default class FlightsPage {
    page: Page;
    whereFromInput: Locator;
    whereToInput: Locator;
    departureDateInput: Locator;
    returnDateInput: Locator
    commonPage: any;

    constructor(page: Page){
        this.page = page;
        this.whereFromInput = page.locator('[data-placeholder="Where from?"] input');
        this.whereToInput = page.locator('[data-placeholder="Where to?"] input');
        this.departureDateInput = page.locator('[placeholder="Departure"]');
        this.returnDateInput = page.locator('[placeholder="Return"]');
        this.commonPage = new CommonPage(page);
    }

    /**
     * sets route based on city names
     * @param from city name
     * @param to city name
     */
    async setRoute(from: string, to: string) {
        await this.whereFromInput.first().fill(from);
        await this.page.locator(`li[aria-label*=${from}]`).first().click();
        await this.whereToInput.first().fill(to);
        await this.page.locator(`li[aria-label*=${to}]`).first().click();

    }

    /**
     * sets the dates for this trip starting from today's date
     * @param journeyDays number of days in the future to plan for return trip
     */
    async setDates(journeyDays: number) {
        let today = await this.commonPage.getToday();
        let futureDay = await this.commonPage.getFutureDate(journeyDays);
        console.log(today);
        console.log(futureDay);
        await this.departureDateInput.first().fill(String(today));
        await this.page.keyboard.press('Enter');
        // await this.page.waitForTimeout(1000);
        await this.returnDateInput.first().fill(String(futureDay));
        await this.page.keyboard.press('Enter');

    }
}