const express = require('express');
const { parse } = require("csv-parse");
const fs = require("fs");

const app = express();
var event = []
fs.createReadStream("../data/cameo.csv")
  .pipe(parse({ delimiter: ";", from_line: 2 }))
  .on("data", function (row) {
    // console.log(row);
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    console.log("finished");
  });

app.get('/event/:from/:to', (req, res) => {

  test = 
  res.send('Successful response.');
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));