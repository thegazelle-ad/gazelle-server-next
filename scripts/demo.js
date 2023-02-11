"use strict";
//import fs from "fs";
//import parse from "csv-parser";
exports.__esModule = true;
var fs = require("fs");
var parse = require("csv-parser");
//@ts-ignore
var parser = parse({ delimiter: "," });
parser.on("readable", function () {
    var record;
    while ((record = parser.read()) !== null) {
        console.log(record);
    }
});
fs.createReadStream("./profiles.csv").pipe(parser);
exports["default"] = {};
