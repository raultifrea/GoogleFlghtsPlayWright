import { Page } from "@playwright/test";

export default class ExplorePage {
    page: Page;

    constructor(page: Page){
        this.page = page;
    }
}