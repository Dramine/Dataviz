import * as d3 from 'd3'

export default function (data, country1, country2, width, height) {
	d3.select("#messagechart").selectAll("*").remove();

	let test_data = data.filter(d =>
		         d.actor1countrycode == null
		      || d.actor2countrycode == null
		      ? false
		      : (  [country1, country2].includes(d.actor1countrycode)
			&& [country1, country2].includes(d.actor2countrycode)
			&& d.actor1countrycode != d.actor2countrycode));

	let svg = d3.select("#messagechart")
		    .attr("width", width)
		    .attr("height", height);

	
	let test_random = new Array(100).fill(0.5).map(x => d3.randomUniform(x)())

	let ax1scl = d3.scaleLinear([0,test_random.length],[0,200]);
	let ax2scl = d3.scaleLinear([0,1],[200,0]);

	let ax1 = d3.axisBottom(ax1scl);
	let ax2 = d3.axisLeft(ax2scl);

	let ax1g = svg.append("g")
		      .attr("transform", "translate(50,250)")
		      .call(ax1);

	let ax2g = svg.append("g")
		      .attr("transform", "translate(50,50)")
		      .call(ax2);
	
	let chartline = svg.append("g")
	                   .append("path")
	                   .datum(test_random)
                           .attr("fill", "transparent")
                           .attr("stroke", "white")
                           .attr("stroke-width", 1)
                           .attr("transform", "translate(50,50)")
	                   .attr("d", d3.line((d, i) => ax1scl(i), d => ax2scl(d)))
	
	svg.call(d3.zoom()
	           .on("zoom", (e) => {
			chartline.attr("transform", e.transform);
			ax1g.call(ax1.scale(e.transform.rescaleX(ax1scl)));
			ax2g.call(ax2.scale(e.transform.rescaleY(ax2scl)));
		   }))
}
