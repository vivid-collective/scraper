const request = require('request');
const fs = require('fs');
const app = require('express')();
const cheerio = require('cheerio');
const beautify = require("json-beautify");
const jsonLinks = require('./sunglasses.json')

const outputPath = 'sunglasses.json';
const port = 8080;
var url = 'https://www.smithoptics.com/us/Root/Men%27s/Sunglasses/New/c/1110';
allSunglassLinks = [];
let seedData = [];


// start();
nextLevel(jsonLinks)

function nextLevel(arr) {
    console.log('fired')
    arr.forEach(element => {
        request(element.link, function (err, resp, body) {
            let $ = cheerio.load(body);
            let model = $('#sidebar > h1').text()
            let description = $('p.summary').text()
            let price = $('p#updateprice').text().trim()
            let image = $('div.main_image.sunglass > img').attr('src')
            let thumbsList = []
            $('div.product_thumb').each((i, product) => {
                console.log(i)
                let data = $(this)
                let name = data.find('h4').text()
                console.log(name)
            })
            let sunglass = {
                model,
                description,
                price,
                image
            }
            seedData.push({ sunglass })
        })
    });
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