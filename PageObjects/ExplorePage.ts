import { Locator, Page, expect } from "@playwright/test";
import CommonPage from "./CommonPage";

export default class ExplorePage extends CommonPage{
    page: Page;
    defaultTripLength: Locator;
    destinations: Locator;
    filtersHeader: Locator;
    inputDepartureData: Locator;

    constructor(page: Page){
        super(page);
        this.page = page;
        this.defaultTripLength = page.locator('[title*="rip in the next 6 months"]'); //caters for both round-trip and one-way
        this.filtersHeader = page.locator('//h1[text()="Filters"]');
        this.destinations = page.locator('ol > li:visible');
        this.inputDepartureData = page.getByLabel('Departure');
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
     * changes the signle trip details to another month
     * @param month the selected month. Up to 6 months ahead of the current one are available e.g. 'June'
     */
    async changeSingleTripDetails(month: string) {
        await this.defaultTripLength.first().waitFor({state: 'visible'});
        await this.defaultTripLength.first().click({force:true});
        await this.page.locator('span').filter({ hasText: month}).last().click();
        await this.page.locator('span').filter({ hasText: 'Done'}).last().click();
        await this.page.waitForLoadState('networkidle');
        expect(this.page.locator(`[title="Trip in ${month}"]`).isVisible).toBeTruthy();
    }

    /**
     * 
     * @param date the selected date in this format: DD MON (e.g. 01 Jan)
     */
    async setSpecificDates(date: string) {
        await this.defaultTripLength.first().waitFor({state: 'visible'});
        await this.defaultTripLength.first().click({force:true});
        // await this.page.locator('span').filter({ hasText: 'Specific dates' }).click();
        await this.page.locator("//span[text()='Specific dates']").click();
        await this.inputDepartureData.last().fill(date);
        await this.page.keyboard.press('Enter');
        await this.page.locator('span').filter({ hasText: 'Done'}).last().click();
        await this.page.waitForLoadState('networkidle');
    }


    /**
     * changes the stops filter from Any number of stops to other options
     * @param option to change the filter: Nonstop only; 1 stop or fewer; 2 stops or fewer
     */
    async changeStopsNo(option: string) {
        await this.allFilters.last().click();
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
       * @param date optional parameter to show or not the period of the flights. If one Way, then we will not have a period to print
       */
    async printDestinationDetails(date: boolean) {
        interface FlightInfo {
            Destination: string | null;
            Period?: string | null;
            Price: string | null;
            Duration: string | null;
            Airline: string | null;
          }
          let flightData: FlightInfo[] = [];
        const count = await this.destinations.count();
        console.log('Number of destinations: ' + count);
        for (let i = 0; i < count; i++) {
            const visible = await this.isDestinationVisible(i);
            if(visible) {
                const destination = await this.destinations.locator('h3').nth(i).innerText();
                const price = await this.destinations.locator('span span').nth(i).innerText();
                const duration = await this.destinations.locator('span:nth-of-type(3)').nth(i).innerText();
                const airline = await this.destinations.locator('[role="img"]').nth(i).getAttribute('aria-label');
                if (date) {
                    const period = await this.destinations.locator('h3 + div').nth(i).innerText();
                    flightData.push({
                        Destination: destination,
                        Period: period,
                        Price: price,
                        Duration: duration,
                        Airline: airline
                });
            } else {
                flightData.push({
                    Destination: destination,
                    Price: price,
                    Duration: duration,
                    Airline: airline
                });
            }
            } else {
                break
            }
        }
        flightData.sort((a: any, b: any) =>  Number(a.Price.split('€')[1]) - Number(b.Price.split('€')[1]));
        console.table(flightData);
    }
}