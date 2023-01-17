import world from '../assets/countries.json'
import * as d3 from 'd3'
import linechart from './linechartConflict';
import stackedBarChart from './stackedBarChart';
import recolormap  from './recolormap';
import { selectAll } from 'd3';
export default function (data, selectedCountry) {


    const width = 700, height = 500;
    var counter = 0;
    var maxRegions = 2;
    const svg = d3.select("#map").attr("width", width).attr("height", height);
    // svg.append("svg")
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

            d3.select('#tooltip').transition().duration(200).style('opacity', 1).text(d.properties.ADMIN)
        })

        .on("mousemove", function (e) {

            root.style.setProperty("--mouse-x", `${e.clientX + 10}px`);
            root.style.setProperty("--mouse-y", `${e.clientY - 30}px`);
        })
        .on("mouseout", function () { d3.select('#tooltip').style('opacity', 0) })

        .on('click', async function (e, d) {
            // if 2 countries are selected we can deselect and it will be recolored to its original  
            if (counter == 2) {
                var selected = d3.select(this);
                if (d3.select(this).style("fill") === "yellow") {
                    counter--;
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
                        stackedBarChart(d.properties.ISO_A3);
                        await recolormap(d.properties.ISO_A3);
                        d3.select(this).style("fill", "yellow")
                    }else{
                        //console.log("im executed")
                        d3.select(this).style("fill", "yellow")
                        counter++;
                        d3.select("#linechart").selectAll("*").remove();
                         
                    }

                }


            }
            //console.log(counter)
        })/* 
            const iso_country = d['properties']['ISO_A2']
            if (selectedCountry.length < 2) {
                d3.select(this).style("fill", "yellow")
                if (!selectedCountry.includes(iso_country))
                    selectedCountry.push(iso_country)
                else {
                    d3.select(this).style("fill", (d) => {
                       // if (d['properties']['ISO_A2'] != '-')
                            return color(total_event_by_country[d['properties']['ISO_A2']])
                        //return 'black';
                    })
                    selectedCountry.splice(selectedCountry.indexOf(iso_country))
                }
                if (selectedCountry.length == 1) {  // si un seul pay est sélécitonnée draw linechart
                    //console.log(data)
                    linechart(iso_country);
                    g.selectAll("path")
                        .style("fill", function(d2) {
                            // console.log(d2)
                            if(d2['properties']['ISO_A2'] != '-') {
                                // console.log()
                                if(!selectedCountry.includes(d2['properties']['ISO_A2'])) {
                                    // console.log(num_event_by_country(data.filter(event => event['Actor1Geo_CountryCode'] == d['properties']['ISO_A2'])));
                                    //return 'blue'
                                    return color(num_event_by_country(data.filter(event => event['actor1geo_countrycode'] == d['properties']['ISO_A2'] || event['actor2geo_countrycode'] == d['properties']['ISO_A2']))[d2['properties']['ISO_A2']])
                                }
                                else {
                                    return 'yellow';
                                }
                            }
                            //else
                               // return 'black';
                        });
                }
                if (selectedCountry.length == 1) // si un seul pay est sélécitonnée draw linechart
                    linechart(data, iso_country);
            }
            else if (selectedCountry.includes(iso_country)) {
                d3.select(this).style("fill", (d) => {
                    if (d['properties']['ISO_A2'] != '-')
                        return color(total_event_by_country[d['properties']['ISO_A2']])
                    return 'black';
                })
                selectedCountry.splice(selectedCountry.indexOf(iso_country))
            }
        }); */
}

const num_event_by_country = (event) => event
    .map((event2) => event2.actor1countrycode)
    .reduce(function (x, y) {
        x[y] ? (x[y] = x[y] + 1) : (x[y] = 1);
        return x;
    }, {});
