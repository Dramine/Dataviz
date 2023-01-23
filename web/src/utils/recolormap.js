import * as d3 from 'd3'
import { getRout } from './api'
export default async function (country) {

    const color = d3.scaleLinear()
        .domain([-10, 0, 10])
        .range(d3.schemeRdYlGn[3])
    // .range(["red", "#b1b3af", "green"])

    // var colorScale = d3.scale.quantize()
    //     .domain([ 1, 10 ])
    //     .range(colorbrewer.Blues[9]);

    // var colorLegend = d3.legend.color()
    //     .labelFormat(d3.format(".0f"))
    //     .scale(colorScale)
    //     .shapePadding(5)
    //     .shapeWidth(50)
    //     .shapeHeight(20)
    //     .labelOffset(12);


    let res = await getRout('/api/event/map/color/' + country);
    d3.select('#map')
        .selectAll('path')
        .style("fill", function (d) {
            if (res[res.findIndex(item => item.actor2countrycode == d['properties']['ISO_A3'])]) {
                //console.log(res[res.findIndex(item => item.actor2countrycode == d['properties']['ISO_A3'])]);
                return color(res[res.findIndex(item => item.actor2countrycode == d['properties']['ISO_A3'])].avg)
            }
        })
        .append("g")
        // .call(colorLegend)
}  
