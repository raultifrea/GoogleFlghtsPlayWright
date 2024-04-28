import { Page } from "@playwright/test";

export default class FlightsPage {
    page: Page;

    constructor(page: Page){
        this.page = page;
    }
}