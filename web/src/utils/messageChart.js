import * as d3 from 'd3'

export default function (data, country1, country2, width, height) {
	d3.select("#messagechart").selectAll("*").remove();

	let svg = d3.select("#messagechart")
		    .attr("width", width)
		    .attr("height", height)
		    .append("rect")
		    .attr("width", width)
		    .attr("height", height)
		    .style("fill", "white");

	console.log(data)
}
