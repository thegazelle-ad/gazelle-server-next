//import fs from "fs";
//import parse from "csv-parser";

const fs = require("fs");
const parse = require("csv-parser");

//@ts-ignore
const parser = parse({ delimiter: "," });

parser.on("readable", function () {
  let record;
  while ((record = parser.read()) !== null) {
    console.log(record);
  }
});

fs.createReadStream("./profiles.csv").pipe(parser);

export default {};
