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
  if (!cc || cc.length < 2) {
    res.status(400).send();
    return;
  }
  if (cc.length > 2) {
    cc = cc.charAt(0).toUpperCase() + cc.slice(1).toLowerCase();
    sqlrequest = 'SELECT * FROM event WHERE ActionGeo_CountryCode=(SELECT fips FROM countrycode where name=$1)'
  }
  else {
    cc = cc.toUpperCase();
    sqlrequest = 'SELECT * FROM event where ActionGeo_CountryCode=$1'
  }
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
  let result = await db.any('SELECT * FROM event WHERE sqldate > $1 AND sqldate < $2', [req.params.from, req.params.to])

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
  let result = await db.any('SELECT DISTINCT sqldate FROM event', [req.params.from, req.params.to])
  res.status(200).json(result);
});

app.get('/api/event/map', async (req, res) => {
  let result = await db.any('SELECT actor1geo_countrycode,actor2geo_countrycode FROM event where Actor1Geo_Type = 1 and Actor2Geo_Type = 1')
  res.status(200).json(result);
});

app.get('/api/event/map/count', async (req, res) => {
  let result = await db.any('SELECT actor2geo_countrycode, count(actor2geo_type), avg(goldsteinscale) FROM event where Actor1Geo_Type = 1  AND Actor2Geo_Type = 1 group by actor2geo_countrycode')
  res.status(200).json(result);
});

function validateDate(date) {
  if ((!date || date.length != 10) && !date.match(/[1-2][0-9]-(0[1-9])|-(1[0-2])(-[0-2][0-9])|(-3[0-1])/)) {

    return false;
  }
  return true
}
app.listen(3000, () => console.log('Example app is listening on port 3000.'));
