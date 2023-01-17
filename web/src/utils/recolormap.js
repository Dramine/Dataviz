import * as d3 from 'd3'
import { getRout } from './api'
export default async function (country) {

    const color = d3.scaleLinear()
        .domain([-10, 10])
        .range(["red", "green"])

    let res = await getRout('/api/event/map/color/' + country);
    d3.select('#map')
        .selectAll('path')
        .style("fill", function (d) {
            if (res[res.findIndex(item => item.actor2countrycode == d['properties']['ISO_A3'])]) {
                console.log(res[res.findIndex(item => item.actor2countrycode == d['properties']['ISO_A3'])]);
                return color(res[res.findIndex(item => item.actor2countrycode == d['properties']['ISO_A3'])].count)
            }
        })
}