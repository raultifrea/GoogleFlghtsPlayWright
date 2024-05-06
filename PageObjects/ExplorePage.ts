import { Locator, Page, expect } from "@playwright/test";

export default class ExplorePage {
    page: Page;
    tripLength: Locator;
    allFilters: Locator;
    closeFilters: Locator;
    destinations: Locator

    constructor(page: Page){
        this.page = page;
        this.tripLength = page.locator('[title="1-week trip in the next 6 months"]');
        this.allFilters = page.locator('//span[contains(text(),"All filters")]');
        this.closeFilters = page.locator("//h1[text()='Filters']//following::div[1]");
        this.destinations = page.locator('ol > li:visible');

    }

    /**
     * changes the trip details to another month or period
     * @param month the selected month. Up to 6 months ahead of the current one are available e.g. 'June'
     * @param duration changes the duration of the searched trip. Options: 'Weekend', '1 week', '2 weeks'
     */
    async changeTripDetails(month: string, duration: string) {
        await this.tripLength.first().waitFor({state: 'visible'});
        await this.tripLength.first().click();
        await this.page.locator('span').filter({ hasText: month}).last().click();
        await this.page.locator('span').filter({ hasText: duration}).last().click();
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
    }

    async isDestinationVisible(i: number): Promise<boolean> {
        return await this.destinations.locator('h3').nth(i).isVisible();
      }
    
    async printDestinationDetails() {
        const count = await this.destinations.count();
        console.log('inside destinations');
        for (let i = 0; i < count; i++) {
            const visible = await this.isDestinationVisible(i);
            if(visible) {
                const destination = await this.destinations.locator('h3').nth(i).innerText();
                console.log(destination);
            } else {
                break
            }
        }
    }
}