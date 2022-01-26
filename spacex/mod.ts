import * as log from "https://deno.land/std/log/mod.ts";

import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js";

interface Launch {
    id: number;
    mission: string;
    rocket: string;
    customers: Array<string>;
}
const launches = new Map<number, Launch>();

async function downloadLaunchData() {
    log.info("Downloading data...")
    const response = await fetch("https://api.spacexdata.com/v3/launches", {method: "GET"});
    if (!response.ok) {
        log.warning("Problem downloading data...");
        throw new Error("Download failed");
    }
    const launchData = await response.json();
    for (const launch of launchData) {
        const payloads = launch['rocket']['second_stage']['payloads'];
        const customers = _.flatMap(payloads, (pl : any) => {
            return pl['customers'];
        });
        const flightData = {
            id: launch['flight_number'],
            mission: launch['mission_name'],
            rocket: launch['rocket']['rocket_name'],
            customers: customers
        };
        launches.set(flightData.id, flightData)
        log.info(launches)
    }
}

if (import.meta.main) {
    await downloadLaunchData();
    console.table(import.meta)
    log.info(`downloaded data for ${launches.size} spacex launches`)
}