import { Locator, Page, expect } from "@playwright/test";
import CommonPage from "./CommonPage";


export default class FlightsPage extends CommonPage {
    page: Page;
    whereFromInput: Locator;
    whereToInput: Locator;
    departureDateInput: Locator;
    returnDateInput: Locator;
    destinations: Locator;
    departureTime: Locator;
    arrivalTime: Locator;
    durationLocator: Locator;

    constructor(page: Page){
        super(page);
        this.page = page;
        this.whereFromInput = page.locator('[data-placeholder="Where from?"] input');
        this.whereToInput = page.locator('[data-placeholder="Where to?"] input');
        this.departureDateInput = page.locator('[placeholder="Departure"]');
        this.returnDateInput = page.locator('[placeholder="Return"]');
        this.destinations = page.locator('//div[contains(@aria-label, "Select flight")]/following-sibling::div[1]');
        this.departureTime = page.locator('[aria-label*="Departure time:"]');
        this.arrivalTime = page.locator('[aria-label*="Arrival time:"]');
        this.durationLocator = page.locator('[aria-label*="Total duration"]');
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
    async setLengthOfJourneyFromToday(journeyDays: number) {
        let today = await this.getToday();
        let futureDay = await this.getFutureDate(journeyDays);
        await this.page.waitForTimeout(2000);
        await this.departureDateInput.first().fill(String(today));
        await this.returnDateInput.first().fill(String(futureDay));
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);
    }

    /**
     * changes the number of stops fomr the defaul Any number of stops to another option
     * @param option can be 'Non-stop only', 'One stop or fewer', 'Two stops or fewer'
     */
    async changeStopsNo(option: string) {
        await this.allFilters.last().click();
        await this.page.locator(`//label[text()='${option}']`).click();
        await this.page.waitForLoadState('networkidle');
        await this.closeFilters.click();
        expect(this.allFilters.last()).toHaveText('All filters (1)');
    }

    /**
     * prints the destination's details from name, price, duration
     */
    async printDestinationDetails() {
        interface FlightInfo {
            Hours: string | null;
            Route: string | null;
            Duration: string | null;
            Price: string | null;
            Company: string | null;
          }
          let flightData: FlightInfo[] = [];
        const count = await this.destinations.count();
        for (let i = 0; i < count; i++) {
            const visible = await this.destinations.nth(i).isVisible();
            if(visible) {
            const deptTime = await this.destinations.nth(i).locator(this.departureTime).last().innerText();
            const arrTime = await this.destinations.nth(i).locator(this.arrivalTime).last().innerText();
            const duration = await this.destinations.nth(i).locator(this.durationLocator).innerText();
            const price = await this.destinations.nth(i).locator('span[role="text"]').last().innerText();
            const route = await this.destinations.nth(i).locator(this.durationLocator).locator('xpath=./following-sibling::span[1]').innerText();
            const company = await this.destinations.nth(i).locator('span[aria-label*="Leaves"]').locator('xpath=ancestor::div[3]/div[2]/div[2]/span[1]').innerText();
            flightData.push({
                Route: route,
                Hours: deptTime + ' - ' + arrTime,
                Duration: duration,
                Price: price,
                Company: company
            });
            } else {
                break
            }
        }
        flightData.sort((a: any, b: any) =>  Number(a.Price.split('€')[1]) - Number(b.Price.split('€')[1]));
        console.table(flightData);
    }
}