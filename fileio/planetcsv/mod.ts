import { BufReader }  from 'https://deno.land/std/io/bufio.ts';
import { parse } from 'https://deno.land/std/encoding/csv.ts';

import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js";

interface Planet {
    [key: string] : string
}

async function loadPlanetsData() {
    const file = await Deno.open('kepler_exoplanets_nasa.csv')
    const bufReader = new BufReader(file)
    const result = await parse(bufReader, {header: true, comment: '#'})
    Deno.close(file.rid)
    
    const planets = (result as Array<Planet>).filter((planet)=> {
        const planetState = planet['koi_disposition']
        const planetRadius = Number(planet['koi_prad'])
        const stellarMass = Number(planet['koi_smass'])
        const stellarRadius = Number(planet['koi_srad'])
        return planetState === 'CONFIRMED'
                && planetRadius > 0.5 && planetRadius < 1.5
                && stellarMass > 0.78 && stellarMass < 1.04
                && stellarRadius > 0.99 && stellarRadius < 1.01;
    })
    return planets.map((planet) => {
        return _.pick(planet, ['koi_prad', 'koi_smass', 'koi_srad', 'koi_count', 'kepler_name'])
    });
}

const newPlanets = await loadPlanetsData()
for (const planet of newPlanets) {
    console.table(planet)
}
console.log(`${newPlanets.length} habitable planets found`)