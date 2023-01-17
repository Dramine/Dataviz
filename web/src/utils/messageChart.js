import * as d3 from 'd3'

export default function (data, country1, country2, width, height) {
	d3.select("#messagechart").selectAll("*").remove();

	const margin_left = 100;
	const margin_right = 300;
	const margin_y = 50;

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

	test_data = d3.sort(test_data, (x,y) => x.globaleventid - y.globaleventid);
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
	 * AXIS
	 *
	 */
	let axscl = d3.scaleLinear([0, test_data.length],[height - margin_y, 0]);

	let span = ax => ((ext => ext[1] - ext[0])(d3.extent(ax.range())))

	let ax = d3.axisLeft(axscl);
	/* END AXIS
	 */


	/*
	 * GROUPS
	 * 1. country codes
	 * 2. vertical lines
	 * 3. arrow shafts
	 * 4. left arrowheads
	 * 5. right arrowheads
	 */
	let country_codes = svg.append("g")
		               .attr("transform", `translate(0, ${margin_y/2})`)

	country_codes.append("text")
	             .text(country1)
		     .style("fill", "white")
		     .style("text-anchor", "middle")
		     .attr("transform", `translate(${margin_left}, 0)`)

	country_codes.append("text")
	             .text(country2)
		     .style("fill", "white")
		     .style("text-anchor", "middle")
		     .attr("transform", `translate(${width - margin_right}, 0)`)

	let vertlines = svg.append("g")

	vertlines.append("line")
		 .attr("x1", width - margin_right)
		 .attr("y1", margin_y)
		 .attr("x2", width - margin_right)
		 .attr("y2", height)
		 .attr("stroke", "white")
		 .attr("stroke-width", 1.5)

	vertlines.append("line")
		 .attr("x1", margin_left)
		 .attr("y1", margin_y)
		 .attr("x2", margin_left)
		 .attr("y2", height)
		 .attr("stroke", "white")
		 .attr("stroke-width", 1.5)

	let arrowshaft = svg.append("g")
	                  .attr("id", "arrowshaft");

	let arrowhead = svg.append("g")
	                  .attr("id", "arrowshaft");

	let dategrp = svg.append("g")
	                 .attr("id", "dates");

	/* END GROUPS
	 */


	/*
	 * ARROWS
	 * 
	 */
	arrowshaft.selectAll("line")
		      .data(test_data)
	              .enter()
		      .append("line")
		      .attr("x1", margin_left)
		      .attr("y1", (d, i) => axscl(i))
		      .attr("x2", width - margin_right)
		      .attr("y2", (d, i) => axscl(i))
		      .attr("stroke", "white")
		      .attr("stroke-width", 3)

	function arrowheadpath(d, i) {
		const headlength = 20
		const headwidth = 7
		const start = d.actor1countrycode === country1 ? width - margin_right : margin_left;
		const side = d.actor1countrycode === country1 ? -headlength : headlength
		const y = axscl(i)

		return `${start},${y} ${start+side},${y-headwidth} ${start+side},${y+headwidth}`
	}

	arrowhead.selectAll("polygon")
	         .data(test_data)
	         .enter()
		 .append("polygon")
		 .attr("points", arrowheadpath)
		 .attr("fill", "white")

	dategrp.selectAll("text")
	       .data(test_data)
	       .enter()
	       .append("text")
	       .text(d => `${d.sqldate.getFullYear()}-${d.sqldate.getMonth()}-${d.sqldate.getDate()}`)
	       .attr("x", d => width - margin_right + 4)
	       .attr("y", (d, i) => axscl(i) + 5)
	       .attr("fill", "white")

	/* END ARROWS
	 */
	

	/*
	 * ZOOM
	 *
	 */
	svg.call(d3.zoom()
	           .on("zoom", (e) => {
		        let trs = e.transform
			arrowshaft.attr("transform", `translate(0,${trs.y})`);
			arrowhead.attr("transform", `translate(0,${trs.y})`);
			dategrp.attr("transform", `translate(0,${trs.y})`);

			arrowshaft.selectAll("line")
			          .join(enter => enter
				       ,update => update.attr("visibility", (d, i) => trs.y + axscl(i) - margin_y > 0?"visible":"hidden"))

			arrowhead.selectAll("polygon")
			          .join(enter => enter
				       ,update => update.attr("visibility", (d, i) => trs.y + axscl(i) - margin_y > 0?"visible":"hidden"))

			dategrp.selectAll("text")
			          .join(enter => enter
				       ,update => update.attr("visibility", (d, i) => trs.y + axscl(i) - margin_y > 0?"visible":"hidden"))

		   }))
	/* END ZOOM
	 */
}
