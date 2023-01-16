import * as d3 from 'd3'
import {getRout} from "./api.js"
let main_event_class = {
    '1': 'Verbal Cooperation',
    '2': 'Material Cooperation',
    '3': 'Verbal Conflict',
    '4': 'Material Conflict'
};

export default async function (code_pays) {
    console.log("function stacked")
    console.log(code_pays)
    // let donnees = await getRout('/api/event/bycountry/USA');
    // donnees = donnees.map(item => {return {...item, quadclass: main_event_class[item.quadclass]}})
    // console.log(donnees);
    var height = 400;
    var width = 600;
    // const res = Test(donnees, code_pays);
    let res = await getRout('/api/event/barchart/' + code_pays)
    console.log(res)
    let data = res.slice(0, 5);
    console.log(data)
    //data = modifyArray(data, traitement_codepays)

    let svg = d3.select('#stackedchart');
    let margin = { top: 20, right: 20, bottom: 30, left: 40 };
    width = width - margin.left + margin.right;
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
    //console.log(keys);

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
    // console.log("function test")
    var arr = []
    var keys = []
    // console.log(data.map(item => item.actor1countrycode))
    const donnees = data.filter(d => d.actor1countrycode === code_pays)
    // console.log(donnees)
    const data2 = d3.rollup(donnees, g => g.length, d => d.actor2countrycode, d => d.quadclass)
    // console.log("data2")
    // console.log(data2)
    for (const [name, value] of data2) {
        var obj1 = Object.fromEntries(value);
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
    //console.log(arr)
    let obj = data.reduce((res, item) => ({ ...res, ...item }));
    let cles = Object.keys(obj);

    let def = cles.reduce((result, key) => {
        result[key] = 0
        return result;
    }, {});

    let result = arr.map((item) => ({ ...def, ...item }));

    result = result.sort(function (a, b) { return b.total - a.total; });
    result = result.filter(v => v.name && v.name !== "" && v.name != code_pays)
    console.log(result)
    return result;
}

function modifyArray(data, map) {
    var resultat = [];
    for (const i in data) {
        var obj = {}
        //console.log(i)
        obj = i;
        obj['name'] = {}
        obj['name'] = map[i.name]
        resultat.append(obj)
        return resultat;
    }

}
