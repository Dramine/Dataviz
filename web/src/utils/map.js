import world from '../assets/countries.json'
import * as d3 from 'd3'
import linechart from './linechartConflict';
import stackedBarChart from './stackedBarChart';
import messageChart from './messageChart';
import recolormap from './recolormap';
import { selectAll } from 'd3';
export default function (data, selectedCountry) {


    const width = 700, height = 500;
    var counter = 0;
    var maxRegions = 2;
    var c1;
    var c2;

    const svg = d3.select("#map").attr("width", width).attr("height", height);

    const total_event_by_country = num_event_by_country(data)
    d3.select('#test').append('div')
        .attr('id', 'tooltip')
        .style("border", "solid 3px black")
        .style("background-color", "grey")
        .style("border-radius", "10px")
        .style("font-family", "Tahoma")
        .style("position", 'fixed')
        .style("display", "none")
        .style("left", "var(--mouse-x)")
        .style("top", "var(--mouse-y)");


    const root = document.documentElement

    const color = d3.scaleLinear()
        .domain([0, d3.max(Object.values(total_event_by_country))])
        .range(["#173745", "#6cc2f2"])

    const g = svg.append("g");

    svg.call(d3.zoom()
        .on("zoom", function (event) {
            countries.attr("transform", event.transform)
        })
        .translateExtent([[-300, -400], [1000, 500]])
        .scaleExtent([1, 8])

    );

    var projection = d3.geoMercator()
        .scale(200)
        .translate([width / 2, height / 2]);

    var path = d3.geoPath()
        .projection(projection);

    var countries = g.selectAll("path")
        .data(world.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke-width", "1")
        .style("fill", (d) => {
            //if (d['properties']['ISO_A2'] != '-')
            return color(total_event_by_country[d.properties.ISO_A3])
            //return 'black';
        })

        .on("mouseover", (e, d) => {

            d3.select('#tooltip').transition().duration(200).style('opacity', 1).style("display", "block").text(d.properties.ADMIN)
        })

        .on("mousemove", function (e) {

            root.style.setProperty("--mouse-x", `${e.clientX + 10}px`);
            root.style.setProperty("--mouse-y", `${e.clientY - 30}px`);
        })
        .on("mouseout", function () { d3.select('#tooltip').style('opacity', 0) })

        .on('click', async function (e, d) {
            // if 2 countries are selected we can deselect and it will be recoloyellow to its original  
            if (counter == 2) {
                var selected = d3.select(this);
                if (d3.select(this).style("fill") === "yellow") {

                    counter--;
                    if (d.properties.ISO_A3 == c1) {
                        c1 = c2;

                    }
                    c2 = null
                    selected.style("fill", function (d) { return color(total_event_by_country[d['properties']['ISO_A3']]); });


                }

            } else if (counter < maxRegions && counter >= 0) {
                var selected = d3.select(this);
                // deselect a country and give it back its color 1 when only one was selected
                if (d3.select(this).style("fill") === "yellow") {
                    counter--;


                    selected.style("fill", function (d) { return color(total_event_by_country[d['properties']['ISO_A3']]); });
                    d3.select("#linechart").selectAll("*").remove();
                    d3.select("#stackedchart").selectAll("*").remove();
                    selectAll('path').style("fill", (d) => {
                        return color(total_event_by_country[d.properties.ISO_A3])
                    })
                }
                // select a country or even 2 
                else {
                    if (counter == 0) {
                        counter++;
                        linechart(d.properties.ISO_A3);

                        c1 = d.properties.ISO_A3;

                        stackedBarChart(d.properties.ISO_A3);
                        await recolormap(d.properties.ISO_A3);
                        d3.select(this).style("fill", "yellow");
                    } else {
                        //console.log("im executed")
                        c2 = d.properties.ISO_A3
                        messageChart(data, c1, c2, 500, 500)
                        d3.select(this).style("fill", "yellow")
                        counter++;
                        d3.select("#linechart").selectAll("*").remove();
                        d3.select("#stackedchart").selectAll("*").remove();

                    }

                }


            }
            //console.log(counter)
        })
}

const num_event_by_country = (event) => event
    .map((event2) => event2.actor1countrycode)
    .reduce(function (x, y) {
        x[y] ? (x[y] = x[y] + 1) : (x[y] = 1);
        return x;
    }, {});
