const request = require('request');
const fs = require('fs');
const app = require('express')();
const cheerio = require('cheerio');
const beautify = require("json-beautify");

const outputPath = 'sunglasses.json';
const port = 8080;
var url = 'http://www.dragonalliance.com/en-us/';
allSunglassLinks = [];

// request(url, function (err, resp, body) {
//     let $ = cheerio.load(body);
//     var newUrl = $('#productnav').attr('href');
//     nextLayer(newUrl);
// });

nextLayer()
function nextLayer(newUrl) {
    request('https://us.vonzipper.com/shop/sunglasses-polarized', function (err, resp, body) {
        let $ = cheerio.load(body);
        // let mynew = $('#site-container');
        // // console.log(mynew.children());
        // let thing = mynew.children().first().next().next();
        // console.log("the next layer after main is " + thing)
        // var next = thing.children().first();
        // console.log(next.children())
        console.log($('.product-name').text())

    });
}

app.listen(port);
console.info(`Server running at ${port}`);