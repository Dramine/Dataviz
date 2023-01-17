import * as d3 from 'd3'

export default function (data, country1, country2, width, height) {
	d3.select("#messagechart").selectAll("*").remove();

	const margin_left = 50;
	const margin_bottom = 50;

	/*
	 * TEST DATA SAMPLE
	 * Interactions between US and UK
	 */
	let test_data = data.filter(d =>
		         d.actor1countrycode == null
		      || d.actor2countrycode == null
		      ? false
		      : (  [country1, country2].includes(d.actor1countrycode)
			&& [country1, country2].includes(d.actor2countrycode)
			&& d.actor1countrycode != d.actor2countrycode));
	/* END TEST SAMPLE
	 */


	/*
	 * SVG DEFINITION
	 *
	 */
	let svg = d3.select("#messagechart")
		    .attr("width", width)
		    .attr("height", height);
	/* END DEFINITION
	 */

	
	/*
	 * RANDOM TEST DATA
	 * Array uniformly distributed in [0, 1]
	 */
	let test_random = new Array(100).fill(0.5).map(x => d3.randomUniform(x)())
	/* END RANDOM DATA
	 */


	/*
	 * AXES
	 *
	 */

	let ax1scl = d3.scaleLinear([0,test_random.length],[0,200]);
	let ax2scl = d3.scaleLinear([0,1],[200,0]);

	let span = ax => ((ext => ext[1] - ext[0])(d3.extent(ax.range())))

	let ax1 = d3.axisBottom(ax1scl);
	let ax2 = d3.axisLeft(ax2scl);
	/* END AXES
	 */

	/*
	 * GROUPS
	 * one for each axis and one for the line
	 */

	let ax1g = svg.append("g")
		      .attr("transform", `translate(${margin_left},${height - margin_bottom})`)
		      .call(ax1);

	let ax2g = svg.append("g")
		      .attr("transform", `translate(${margin_left},${height - margin_bottom - span(ax2scl)})`)
		      .call(ax2);

	let linegroup = svg.append("g")
                           .attr("transform", `translate(${margin_left},${margin_bottom})`);

	let mask = svg.append("mask")
                      .attr("id", "mask")

	/* END GROUPS
	 */


	/*
	 * MASK
	 * 
	 */

	let rect_pos = [[[width, height - margin_bottom - span(ax2scl)], [0, 0]]
		       ,[[width - margin_left - span(ax1scl), height], [margin_left + span(ax1scl) , 0]]
		       ,[[width, margin_bottom], [0, height - margin_bottom]]
                       ,[[margin_left, height], [0, 0]]]

	for (let i = 0; i < 4; ++i) {
		mask.append("rect")
		    .attr("fill", "black")
		    .attr("stroke", "none")
		    .attr("width", rect_pos[i][0][0])
		    .attr("height", rect_pos[i][0][1])
		    .attr("transform", `translate(${rect_pos[i][1][0]},${rect_pos[i][1][1]})`);
	}

	mask.append("rect")
	    .attr("fill", "white")
	    .attr("stroke", "none")
	    .attr("width", span(ax1scl))
	    .attr("height", span(ax2scl));
	/* END MASK
	 */


	/*
	 * LINE 
	 * 
	 */

	linegroup.attr("mask", "url(#mask)");

	let chartline = linegroup.append("path")
	                         .datum(test_random)
	                         .attr("id", "line")
                                 .attr("fill", "none")
                                 .attr("stroke", "white")
                                 .attr("stroke-width", 1)
	                         .attr("d", d3.line((d, i) => ax1scl(i), d => ax2scl(d)))
	/* END LINE
	 */
	

	/*
	 * ZOOM
	 *
	 */
	svg.call(d3.zoom()
	           .on("zoom", (e) => {
			chartline.attr("transform", e.transform);
			ax1g.call(ax1.scale(e.transform.rescaleX(ax1scl)));
			ax2g.call(ax2.scale(e.transform.rescaleY(ax2scl)));
		   }))
	/* END ZOOM
	 */
}
