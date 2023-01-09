import world from '../assets/countries.json'
import * as d3 from 'd3'

export default function () {
    const width = 800, height = 500;
    const svg = d3.select("svg").attr("width", width).attr("height", height);
    const g = svg.append("g");

    const color = d3
        .scaleQuantize()
        .range(["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"])
        .domain([0, 200])


    var projection = d3.geoMercator()
        .fitExtent([[20, 20], [width, height]], world);

    var path = d3.geoPath()
        .projection(projection);

    var countries = svg.selectAll("path")
        .data(world.features)
        .enter()
        .append("path")
        .attr("d", path)
        // .style("fill", d => {
        //   return color(parsed_data.NumMentions)
        // })
        .style("stroke-width", "1")
        .on("mouseover", function (e, d) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.6')

        })
        .on("mouseleave", function (e, d) {
            d3.select(this)
                .attr('opacity', '1');
        })
}
