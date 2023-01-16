import world from '../assets/countries.json'
import * as d3 from 'd3'
import linechart from './linechartConflict';
export default function (data, selectedCountry) {


    const width = 700, height = 500;
    const svg = d3.select("#map").attr("width", width).attr("height", height);
    // svg.append("svg")
    d3.select('#test').append('div')
        .attr('id', 'tooltip')
        .style("border", "solid 3px black")
        .style("background-color", "grey")
        .style("border-radius", "10px")
        .style("font-family", "Tahoma")
        .style("position", 'fixed')
        .style("left", "var(--mouse-x)")
        .style("top", "var(--mouse-y)");

    const root = document.documentElement

    const num_event_by_country = data
        .map((event) => event.ActionGeo_CountryCode)
        .reduce(function (x, y) {
            x[y] ? (x[y] = x[y] + 1) : (x[y] = 1);
            return x;
        }, {});

    const color = d3.scaleLinear()
        .domain([0, d3.max(Object.values(num_event_by_country))])
        .range(["#95d0fc", "#2c6fbb"])

    const g = svg.append("g")
        .call(d3.zoom()
            .on("zoom", function (event) {
                countries.attr("transform", event.transform)
            })
            .scaleExtent([1, 8])
        );



    var projection = d3.geoMercator()
        .scale(200)
        .translate([width / 2, height / 2]);

    var path = d3.geoPath()
        .projection(projection);

    //d3.select("#map").append('div')

    var countries = g.selectAll("path")
        .data(world.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke-width", "1")
        .style("fill", (d) => {
            if (d['properties']['ISO_A2'] != '-')
                return color(num_event_by_country[d['properties']['ISO_A2']])
            return 'black';
        })

        .on("mouseover",  (e,d)=> {

            d3.select('#tooltip').transition().duration(200).style('opacity', 1).text(d.properties.ADMIN)
        })

        .on("mousemove", function (e) {

            root.style.setProperty("--mouse-x", `${e.clientX +15}px`);
            root.style.setProperty("--mouse-y", `${e.clientY+15}px`);
        })
        .on("mouseout", function () { d3.select('#tooltip').style('opacity', 0) })

        .on('click', function (e, d) {
            const iso_country = d['properties']['ISO_A2']
            if (selectedCountry.length < 2) {
                d3.select(this).style("fill", "yellow")
                if (!selectedCountry.includes(iso_country))
                    selectedCountry.push(iso_country)
                else {
                    d3.select(this).style("fill", (d) => {
                        if (d['properties']['ISO_A2'] != '-')
                            return color(num_event_by_country[d['properties']['ISO_A2']])
                        return 'black';
                    })
                    selectedCountry.splice(selectedCountry.indexOf(iso_country))
                }
                if (selectedCountry.length == 1) // si un seul pay est sélécitonnée draw linechart
                    linechart(data, iso_country);
            }
            else if (selectedCountry.includes(iso_country)) {
                d3.select(this).style("fill", (d) => {
                    if (d['properties']['ISO_A2'] != '-')
                        return color(num_event_by_country[d['properties']['ISO_A2']])
                    return 'black';
                })
                selectedCountry.splice(selectedCountry.indexOf(iso_country))
            }
        })


}
