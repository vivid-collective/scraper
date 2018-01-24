const request = require('request');
const fs = require('fs');
const app = require('express')();
const cheerio = require('cheerio');
const beautify = require("json-beautify");

const outputPath = 'sunglasses.json';
const port = 8080;
var url = 'https://www.smithoptics.com/us/Root/Men%27s/Sunglasses/New/c/1110';
allSunglassLinks = [];


function start() {
    request(url, function (err, resp, body) {
        let $ = cheerio.load(body);
        $('.inner_product_panel').each(function () {
            let data = $(this)
            let newObj = {}
            newObj.link = data.find('a').first().attr('href');
            // newObj.model = data.find('h4').first().text();
            // console.log(newObj)
            allSunglassLinks.push(newObj);
            // console.log(allSunglassLinks)
        })
        nextLevel(allSunglassLinks)
    });
}

function nextLevel(arr) {
    console.log(arr);
        arr.forEach(element => {
            request(element.link, function (err, resp, body) {
                let $ = cheerio.load(body);
                let modal = $('#sidebar > h1').text()
                console.log(modal);
            })
        });
    }
    start();


    // nextLayer()
    // function nextLayer(newUrl) {
    //     request('https://us.vonzipper.com/shop/sunglasses-polarized', function (err, resp, body) {
    //         let $ = cheerio.load(body);
    //         // let mynew = $('#site-container');
    //         // // console.log(mynew.children());
    //         // let thing = mynew.children().first().next().next();
    //         // console.log("the next layer after main is " + thing)
    //         // var next = thing.children().first();
    //         // console.log(next.children())
    //         console.log($('.product-name').text())

    //     });
    // }

    app.listen(port);
    console.info(`Server running at ${port}`);