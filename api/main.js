const express = require('express');
const { parse } = require("csv-parse");
const fs = require("fs");
const cors = require('cors');
const app = express();
app.use(cors());
const databaseConfig = {
  "host": "localhost",
  "port": 5432,
  "database": "event",
  "user": "postgres",
  "password": "password"
};
const pgp = require("pg-promise")({});
var event = []
const db = pgp(databaseConfig)

db.connect()
  .then(obj => {
    console.log("connection successfull");
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

app.get('/api/event/bycountry/:country', async (req, res) => {
  let cc = req.params.country;
  let sqlrequest;
  if (!cc || cc.length != 3) {
    res.status(400).send();
    return;
  }

  cc = cc.toUpperCase();
  sqlrequest = 'SELECT * FROM event where actor1countrycode=$1 LIMIT 10000';

  let result = await db.any(sqlrequest, cc);
  res.status(200).json(result);
});


app.get('/api/event/bydate/from/:from/to/:to', async (req, res) => {
  let from = req.params.from;
  let to = req.params.to;
  let sqlrequest;
  if (!validateDate(from) || !validateDate(to)) {
    res.status(400).send();
    return;
  }
  console.log(req.params);
  let result = await db.any(`SELECT * FROM event WHERE sqldate >= $1 AND sqldate <= $2 and actor1countrycode != '' and actor2countrycode != ''`, [req.params.from, req.params.to])

  res.status(200).json(result);
});

app.get('/api/event/byday/:date', async (req, res) => {
  let date = req.params.date;
  if (!validateDate(date)) {
    res.status(400).send();
    return;
  }
  let result = await db.any('SELECT * FROM event WHERE sqldate = $1', [date])
  res.status(200).json(result);
});

app.get('/api/event/date', async (req, res) => {
  let result = await db.any('SELECT DISTINCT sqldate FROM event order by sqldate asc', [req.params.from, req.params.to])
  res.status(200).json(result);
});

app.get('/api/event/map', async (req, res) => {
  let result = await db.any('SELECT actor1geo_countrycode,actor2geo_countrycode FROM event where Actor1Geo_Type = 1 and Actor2Geo_Type = 1')
  res.status(200).json(result);
});

app.get('/api/event/map/count', async (req, res) => {
  let result = await db.any(`SELECT actor2countrycode, count(actor2countrycode), avg(goldsteinscale) FROM event where actor1countrycode != '' and actor2countrycode != '' `)
  res.status(200).json(result);
});

app.get('/api/event/barchart/:country', async (req, res) => {
  country = req.params.country;
  console.log(country)
  if (!country || country.length != 3) {
    res.status(400).send();
    return;
  }
  let request = `SELECT actor2countrycode as name, COUNT(CASE WHEN quadclass = 1 THEN 1 END) as "1", COUNT(CASE WHEN quadclass = 2 THEN 1 END) as "2", COUNT(CASE WHEN quadclass = 3 THEN 1 END) as "3", COUNT(CASE WHEN quadclass = 4 THEN 1 END) as "4",COUNT(*) as total
                FROM event
                WHERE actor1countrycode = $1 AND actor2countrycode != actor1countrycode
                GROUP BY actor2countrycode
                ORDER BY total DESC`
  let result = await db.any(request, country)
  res.status(200).json(result);
});

app.get('/api/event/linechart/:country/conflict', async (req, res) => {
  country = req.params.country;
  console.log(country)
  if (!country || country.length != 3) {
    res.status(400).send();
    return;
  }
  let request = `select sqldate, quadclass, count(sqldate) from event where actor1countrycode = $1 AND (quadclass = '3' or quadclass = '4') group by sqldate, quadclass`
  let result = await db.any(request, country)
  res.status(200).json(result);
});

app.get('/api/event/linechart/:country/cooperation', async (req, res) => {
  country = req.params.country;
  console.log(country)
  if (!country || country.length != 3) {
    res.status(400).send();
    return;
  }
  let request = `select sqldate, quadclass, count(sqldate) from event where actor1countrycode = $1 AND (quadclass = '1' or quadclass = '2') group by sqldate, quadclass`
  let result = await db.any(request, country)
  res.status(200).json(result);
});

function validateDate(date) {
  if ((!date || date.length != 10) && !date.match(/[1-2][0-9]-(0[1-9])|-(1[0-2])(-[0-2][0-9])|(-3[0-1])/)) {

    return false;
  }
  return true
}
app.listen(3000, () => console.log('Example app is listening on port 3000.'));
