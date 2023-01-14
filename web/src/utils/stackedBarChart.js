import * as d3 from 'd3'

let main_event_class = {
    '1': 'Verbal Cooperation',
    '2': 'Material Cooperation',
    '3': 'Verbal Conflict',
    '4': 'Material Conflict'
  };

export default function (donnees, code_pays, width, height) {
    const res = Test(donnees, code_pays);
    let data = res.slice(0, 5);

    //data = modifyArray(data, traitement_codepays)

    let svg = d3.select('#stackedchart');
    let margin = { top: 20, right: 20, bottom: 30, left: 40 };
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;
    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.attr("height", height + margin.top + margin.bottom);
    svg.attr("width", width);

    let x = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.05)
        .align(0.1);

    let y = d3.scaleLinear([0, d3.max(Array.from(data.values()).map(d => d.length))]
        , [height, 0]);

    let z = d3.scaleOrdinal(d3.schemeTableau10);


    let keys = Object.keys(data[0])
    console.log(keys);

    keys = keys.filter(v => v !== 'total' && v != 'name')

    x.domain(data.map(function (d) { return d.name; }));
    y.domain([0, d3.max(data, function (d) { return d.total; })]).nice();
    z.domain(keys);

    g.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter().append("g")
        .attr("fill", function (d) { return z(d.key); })
        .selectAll("rect")
        .data(function (d) { return d; })
        .enter().append("rect")
        .attr("x", function (d) { return x(d.data.name); })
        .attr("y", function (d) { return y(d[1]); })
        .attr("height", function (d) {
            return y(d[0]) - y(d[1]);
        })
        .attr("width", x.bandwidth());

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .style('fill', 'white')
        .text("Nombre év");
        

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 200)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 50)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .style('fill', 'white')
        .text(function (d) { return d; });

};

function Test(data, code_pays) {
    var arr = []
    var keys = []
    const donnees = data.filter(d => d.Actor1CountryCode === code_pays)
    const data2 = d3.rollup(donnees, g => g.length, d => d.Actor2CountryCode, d => d.QuadClassch)
    console.log(data2)
    for (const [name, value] of data2) {
        var obj1 = Object.fromEntries(value);
        "Renommage des propriétés"
        for (let i = 1; i < 5; i++) {
            delete Object.assign(obj1, { [main_event_class[i]]: obj1[i] })[i];
        }

        "Calcul du Total"
        const values = Object.values(obj1);
        var total = values.reduce((accumulator, value) => {
            return accumulator + value;
        }, 0);
        obj1.total = total

        var nom = { "name": name }
        "var objet = Object.assign( nom, obj1 );"
        var objet = { "name": name, ...obj1 }
        arr.push(objet)
        keys.push(name)
    }

    data = arr;
    let obj = data.reduce((res, item) => ({ ...res, ...item }));
    let cles = Object.keys(obj);

    let def = cles.reduce((result, key) => {
        result[key] = 0
        return result;
    }, {});

    let result = arr.map((item) => ({ ...def, ...item }));

    result = result.sort(function (a, b) { return b.total - a.total; });
    result = result.filter(v => v.name !== "" && v.name != code_pays)
    return result;
}

function modifyArray(data, map) {
    var resultat = [];
    for (const i in data) {
        var obj = {}
        console.log(i)
        obj = i;
        obj['name'] = {}
        obj['name'] = map[i.name]
        resultat.append(obj)
        return resultat;
    }

}