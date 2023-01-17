import * as d3 from 'd3'
import { getRoute, getRout } from './api'

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

    let parseTime = d3.timeParse("%Y-%m-%d");
    let dataCoop = (await getRout('/api/event/linechart/' + country + '/cooperation')).map(item => {
        return {
            sqldate: parseTime(item.sqldate.split('T')[0]),
            count: parseInt(item.count),
            type: main_event_class[item.quadclass],
	    medium: {1: "Verbal", 3: "Verbal", 2: "Material", 4: "Material"}[item.quadclass],
	    interaction: {1: "Cooperation", 2: "Cooperation", 3: "Conflict", 4: "Conflict"}[item.quadclass]
        }
    })

    let dataConf = (await getRout('/api/event/linechart/' + country + '/conflict')).map(item => {
        return {
            sqldate: parseTime(item.sqldate.split('T')[0]),
            count: parseInt(item.count),
            type: main_event_class[item.quadclass],
	    medium: {1: "Verbal", 3: "Verbal", 2: "Material", 4: "Material"}[item.quadclass],
	    interaction: {1: "Cooperation", 2: "Cooperation", 3: "Conflict", 4: "Conflict"}[item.quadclass]
        }
    })

    let data = dataCoop.concat(dataConf)

    data = data.filter(d => d.sqldate > parseTime("2021-09-01"))

    const color = d3.scaleOrdinal(d3.schemeTableau10)

    const ax = d3.scaleTime()
        .domain(d3.extent(data.map(d => d.sqldate)))
        .range([0, width])

    const ay = d3.scaleLinear()
        .domain(d3.extent(data.map(d => d.count)))
        .range([height, 0])

    svg.append("g")
	.selectAll("path")
        .data(d3.group(data, d => d.interaction).values())
        .join("path")
        .attr("d", d3.line(d => ax(d.sqldate), d => ay(d.count)))
        .attr("transform", `translate(${padding},${padding})`)
        .attr("fill", "none")
        .attr("stroke", d => color(d[0].interaction))
        .attr("stroke-width", 1.5)


    var lgd_itm = 0
    for (const i of d3.group(data, d => d.interaction).keys()) {
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
}
