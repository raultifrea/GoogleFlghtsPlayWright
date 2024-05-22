import { Locator, Page, expect } from "@playwright/test";

export default class ExplorePage {
    page: Page;
    defaultTripLength: Locator;
    allFilters: Locator;
    closeFilters: Locator;
    destinations: Locator;
    filtersHeader: Locator;

    constructor(page: Page){
        this.page = page;
        this.defaultTripLength = page.locator('[title="1-week trip in the next 6 months"]');
        this.allFilters = page.locator('//span[contains(text(),"All filters")]');
        this.filtersHeader = page.locator('//h1[text()="Filters"]');
        this.closeFilters = page.locator("//h1[text()='Filters']//following::div[1]");
        this.destinations = page.locator('ol > li:visible');
    }

    /**
     * changes the trip details to another month or period
     * @param month the selected month. Up to 6 months ahead of the current one are available e.g. 'June'
     * @param duration changes the duration of the searched trip. Options: 'Weekend', '1 week', '2 weeks'
     */
    async changeTripDetails(month: string, duration: string) {
        
        await this.defaultTripLength.first().waitFor({state: 'visible'});
        await this.defaultTripLength.first().click({force:true});
        await this.page.locator('span').filter({ hasText: month}).last().click();
        await this.page.locator('span').filter({ hasText: duration}).last().click();
        await this.page.locator('span').filter({ hasText: 'Done'}).last().click();
        await this.page.waitForLoadState('networkidle');
        expect(this.page.locator(`[title="${duration} trip in ${month}"]`).isVisible).toBeTruthy();

    }

    /**
     * changes the stops filter from Any number of stops to other options
     * @param option to change the filter: Nonstop only; 1 stop or fewer; 2 stops or fewer
     */
    async changeStopsNo(option: string) {
        await this.allFilters.last().click();
        // expect(this.filtersHeader).toBeVisible();
        await this.page.locator(`//label[text()='${option}']`).click();
        await this.page.waitForLoadState('networkidle');
        await this.closeFilters.click();
        expect(this.allFilters.last()).toHaveText('All filters (2)');
    }

    /**
     * @param i the index to check whether it's visible or not
     * @returns True or False if a destination is visible
     */
    async isDestinationVisible(i: number): Promise<boolean> {
        return await this.destinations.locator('h3').nth(i).isVisible();
      }
    
    /**
     * prints the destination's details from name, period, price, duration and airline
     */
    async printDestinationDetails() {
        interface FlightInfo {
            Destination: string | null;
            Period: string | null;
            Price: Number;
            Duration: string | null;
            Airline: string | null;
          }
          let flightData: FlightInfo[] = [];
        const count = await this.destinations.count();
        for (let i = 0; i < count; i++) {
            const visible = await this.isDestinationVisible(i);
            if(visible) {
                const destination = await this.destinations.locator('h3').nth(i).innerText();
                const period = await this.destinations.locator('h3 + div').nth(i).innerText();
                const price = await this.destinations.locator('span span').nth(i).innerText();
                const duration = await this.destinations.locator('span:nth-of-type(3)').nth(i).innerText();
                const airline = await this.destinations.locator('[role="img"]').nth(i).getAttribute('aria-label');
                flightData.push({
                    Destination: destination,
                    Period: period,
                    Price: Number(price.split('€')[1]),
                    Duration: duration,
                    Airline: airline
                });
            } else {
                break
            }
        }
        flightData.sort((a: any, b: any) => a.Price - b.Price);
        console.table(flightData);
    }
}