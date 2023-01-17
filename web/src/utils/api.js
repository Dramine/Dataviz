import * as d3 from 'd3'

const api_url = 'http://141.145.211.33';
let main_event_class = {
    '1': 'Verbal Cooperation',
    '2': 'Material Cooperation',
    '3': 'Verbal Conflict',
    '4': 'Material Conflict'
};

let parseTime = d3.timeParse("%Y-%m-%d");

export async function getRout(uri) {
    let res = await fetch(api_url + uri);
    return await res.json();
}

export async function getRoute(uri) {
    let res = await fetch(api_url + uri);
    res = await res.json();
    //console.log(res)
    res = res.map(function (item) {
        return {
            ...item,
            "globaleventid": parseInt(item.globaleventid),
            "sqldate": parseTime(item.sqldate.split('T')[0]),
            "actor1geo_type": parseInt(item.actor1geo_Type),
            "actor2geo_type": parseInt(item.actor2geo_Type),
            "actiongeo_type": parseInt(item.actiongeo_Type),
            "isrootevent": parseInt(item.isRootevent),
            "quadclass": main_event_class[parseInt(item.quadclass)],
            "goldsteinscale": parseInt(item.goldsteinscale),
            "nummentions": parseInt(item.nummentions),
            "numsources": parseInt(item.numsources),
            "numarticles": parseInt(item.numarticles),
            "avgtone": parseFloat(item.avgtone),
        }
    });
    return res;
}

export async function getDate() {
    let res = await fetch(api_url + '/api/event/date');
    res = await res.json();
    return res //.map((item) => { return { 'sqldate': parseTime(item.sqldate.split('T')[0]) } });
}
