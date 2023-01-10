import world from '../assets/countries.json'
import * as d3 from 'd3'
import linechart from './linechartConflict';
export default function (data) {
    const width = 800, height = 500;
    const svg = d3.select("#map").attr("width", width).attr("height", height);
    // svg.append("svg")
    // const g = svg.append("g");
    const num_event_by_country = data
    .map((event) => event.ActionGeo_CountryCode)
    .reduce(function (x, y) {
      x[y] ? (x[y] = x[y] + 1) : (x[y] = 1);
      return x;
    }, {});

    const color = d3.scaleLinear()
    .domain([0, d3.max(Object.values(num_event_by_country))])
    .range(["#95d0fc", "#2c6fbb"])


    var projection = d3.geoMercator()
        .fitExtent([[20, 20], [width, height]], world);

    var path = d3.geoPath()
        .projection(projection);
    console.log(data)
    var countries = svg.selectAll("path")
        .data(world.features)
        .enter()
        .append("path")
        .attr("d", path)
        // .style("fill", d => {
        //   return color(parsed_data.NumMentions)
        // })
        .style("stroke-width", "1")
        .style("fill", (d) => {
            if (d['properties']['ISO_A2'] != '-')
                return color(num_event_by_country[d['properties']['ISO_A2']])
            return 'black';
        })
        .on('click', (e, d) => {
            console.log(d)
            linechart(data, d['properties']['ISO_A2'])
        })
    // .on("mouseover", function (e, d) {
    //     d3.select(this).transition()
    //         .duration('50')
    //         .attr('opacity', '.6')

    // })
    // .on("mouseleave", function (e, d) {
    //     d3.select(this)
    //         .attr('opacity', '1');
    // })
}
