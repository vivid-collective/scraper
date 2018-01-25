const request = require('request');
const fs = require('fs');
const app = require('express')();
const cheerio = require('cheerio');
const beautify = require("json-beautify");
const jsonLinks = require('./womensSunLinks.json')

const outputPath = 'womensSunGlassesEndData.json';
const port = 8080;
var url = 'https://www.smithoptics.com/us/Root/Women%27s/Sunglasses/New/c/2110';
allSunglassLinks = [];
let seedData = [];


start();
nextLevel(jsonLinks)
// console.log(jsonLinks.length)

function nextLevel(arr) {
    console.log('fired')
    arr.forEach(element => {
        request(element.link, function (err, resp, body) {
            let $ = cheerio.load(body);
            let model = $('#sidebar > h1').text()
            let description = $('p.summary').text().trim()
            let price = $('p#updateprice').text().trim()
            let image = $('div.main_image.sunglass > img').attr('src')
            let variations = []

            // let hope = $('.product_thumbs_list').children().first().children().first().children().first().attr('data-color')
            $('.product_thumb').each(function () {
                let newObj = {};
                let data = $(this);
                newObj.variationModel = data.children().first().attr('data-color');
                newObj.lensColor = data.children().first().attr('data-lenscolor');
                newObj.price = data.children().first().attr('price');
                newObj.lensSummary = data.children().first().attr('data-lens-summary');
                newObj.image = data.children().first().attr('title');
                variations.push(newObj);
            })
            let sunglass = {
                model,
                description,
                price,
                image,
                variations
            }
            seedData.push({
                sunglass
            })

        })
    });
    setTimeout(() => {
        postFile(seedData)
    }, 5000)

}

function postFile(sunglassArr) {
    fs.writeFile(outputPath, beautify(sunglassArr), (error) => {
        if (error) {
            console.error(error);
            return false;
        } else {
            console.info(`Successfully wrote to ${outputPath}`);
            return true;
        }
    });
}

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
        postFile(allSunglassLinks)
        // nextLevel(allSunglassLinks)
    });
}


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