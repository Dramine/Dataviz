import * as d3 from 'd3'
import { getRoute } from './api'

let main_event_class = {
    '1': 'Verbal Cooperation',
    '2': 'Material Cooperation',
    '3': 'Verbal Conflict',
    '4': 'Material Conflict'
};
export default async function (country) {

    const padding = 50;
    const legdmarg = 100;

    const width = 400;
    const height = 170;

    d3.select("#linechart").selectAll("*").remove();
    let svg = d3.select("#linechart").attr("width", width + padding * 2 + legdmarg).attr("height", height + padding * 2);

    let data = await getRoute('/api/event/bycountry/FR');

    data = data.filter(item => item.actiongeo_countrycode == country).map(d => ({ sqldate: d.sqldate, quadclass: ({ "Verbal Cooperation": "Cooperation", "Material Cooperation": "Cooperation", "Verbal Conflict": "Conflict", "Material Conflict": "Conflict" })[d.quadclass] }))

    console.log(d3.group(data, d => d.quadclass))
    let dataCoop = d3.group(data, d => d.quadclass).get("Cooperation")
    let dataConf = d3.group(data, d => d.quadclass).get("Conflict")
    dataCoop = Array.from(d3.group(dataCoop, d => d.sqldate)).map(d => ({ sqldate: d[0], count: d[1].length }))
    dataConf = Array.from(d3.group(dataConf, d => d.sqldate)).map(d => ({ sqldate: d[0], count: d[1].length }))

    dataCoop = dataCoop.map(d => ({ sqldate: d.sqldate, count: d.count, type: "Cooperation" }))
    dataConf = dataConf.map(d => ({ sqldate: d.sqldate, count: d.count, type: "Conflict" }))

    data = dataCoop.concat(dataConf).sort((x, y) => d3.ascending(x.sqldate, y.sqldate))

    const color = d3.scaleOrdinal(d3.schemeTableau10)

    const min_x = d3.min(data.map(d => d.sqldate))
    const max_x = d3.max(data.map(d => d.sqldate))
    // const min_x = new Date(max_x - 6 * 24 * 3600 * 1000)

    var max_y = d3.max([d3.max(dataConf, d => d.count), d3.max(dataCoop, d => d.count)])

    const ax = d3.scaleTime()
        .domain([min_x, max_x])
        .range([0, width])

    const ay = d3.scaleLinear()
        .domain([0, max_y])
        .range([height, 0])

    svg.selectAll("path")
        .data(d3.group(data, d => d.type).values())
        .join("path")
        .attr("d", d3.line(d => ax(d.sqldate) , d => ay(d.count) ))
        .attr("transform", `translate(${padding},${padding})`)
        .attr("fill", "none")
        .attr("stroke", d => color(d[0].type))
        .attr("stroke-width", 1.5)


    var lgd_itm = 0
    for (const i of d3.group(data, d => d.type).keys()) {
        svg.append("path")
            .attr("d", d3.symbol(d3.symbolSquare, 60))
            .attr("fill", d => color(i))
            .attr("transform", `translate(${width + 2 * padding},${padding + lgd_itm++ * 20})`)

        svg.append("text")
            .attr("x", width + 2 * padding + 8)
            .attr("y", padding + lgd_itm++ * 20 - 15)
            .text(i)
            .style('fill', 'white')
    }

    svg.append("text")
        .attr("x", 20)
        .attr("y", 20)
        .text("Représente nombre d'interaction de la " + country + " avec les autres pays")
        .style('fill', 'white')

    svg.append("g")
        .attr("transform", `translate(${padding},${height + padding})`)
        .call(d3.axisBottom(ax))

    svg.append("g")
        .attr("transform", `translate(${padding},${padding})`)
        .call(d3.axisLeft(ay))

    // document.getElementById('test').innerHTML = svg
    // console.log(svg)
}