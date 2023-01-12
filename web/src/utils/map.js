import world from '../assets/countries.json'
import * as d3 from 'd3'
import linechart from './linechartConflict';
export default function (data, selectedCountry) {
    const width = 700, height = 500;
    const svg = d3.select("#map").attr("width", width).attr("height", height);
    // svg.append("svg")
    
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
	 /* .on("wheel.zoom",function(){
        var currScale = projection.scale();
        var newScale = currScale - 2*event.deltaY;
        var currTranslate = projection.translate();
        var coords = projection.invert([event.offsetX, event.offsetY]);
        projection.scale(newScale);
        var newPos = projection(coords);

        projection.translate([currTranslate[0] + (event.offsetX - newPos[0]), currTranslate[1] + (event.offsetY - newPos[1])]);
        g.selectAll("path").attr("d", path);

    }); */
    

    var projection = d3.geoMercator()  
		.scale(200)
    .translate([width/2, height/2]);

    var path = d3.geoPath()
        .projection(projection);
    
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
                if(selectedCountry.length == 1) // si un seul pay est sélécitonnée draw linechart
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
        });
		
		/* .call(d3.drag().on("drag", function(){
        var currTranslate = projection.translate();
        projection.translate([currTranslate[0] + d3.event.dx,
                              currTranslate[1] + d3.event.dy]);
        g.selectAll("path").attr("d", path);
    }));   */ 
   
}
