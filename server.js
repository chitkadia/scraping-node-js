var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function (req, res) {
    url = req.url;
    url = url.substring(url.indexOf("=")+1);
    console.log("URL : ", url);
    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            switch(true) {
                case url.includes("dailysignal"):
                    var json1 = fetchxmlData($);
                    logFile("dailysignal.log", json1);
                break;
                case url.includes("judicialwatch"):
                    var json2 = fetchxmlData($);
                    logFile("judicialwatch.log", json2);
                break;
                case url.includes("rushlimbaugh"):
                    var json3 = fetchxmlData($, 1);
                    logFile("rushlimbaugh.log", json3);
                break;
                case url.includes("theepochtimes"):
                    var json4 = fetchxmlData($, 1);
                    logFile("theepochtimes.log", json4);
                break;
                // case url.includes("feedburner"):
                //     var json5 = fetchxmlDataHTML($);
                //     logFile("feedburner.log", json5);
                // break;
                case url.includes("powerlineblog"):
                    var json6 = fetchxmlData($);
                    logFile("powerlineblog.log", json6);
                break;
            }
        }

        // $('.title_wrapper h1').filter(function () {
        //     var data = $(this);
        //     title = data.text();
        //     // release = data.children().next().text();
        //     release = data.children().last().children().text();

        //     json.title = title;
        //     json.release = release;
        // })

        res.send('Check your console!')

    });
})

/**
 * 
 * This function is used to log the content in the respected file.
 * @param {fileName} fileName 
 * @param {data} data 
 */
function logFile(fileName, data) {
    fs.appendFileSync('output/'+fileName, JSON.stringify(data, null, 4), function (err) {
        console.log('File successfully written! - Check your project directory for the '+fileName+' file');
    })
}

/**
 * 
 * This function is used to extract data
 * @param {Object} obj 
 */
function fetchxmlData(obj, change = 0) {
    var $ = obj;
    var json = {
        mainTitle: "",
        mainDescription: "",
        sub: []
    };
    
    $('channel').filter(function () {
        var titleData = $(this);
        title = titleData.find("title").eq(0).text();
        description = titleData.find("description").eq(0).text();
        json.mainTitle = title;
        json.mainDescription = description;
    })

    if (change == 0) {
        $('channel item').filter(function () {
            var subItem = $(this);
            var tempData = {
                subTitle: subItem.find("title").text(),
                subLink: subItem.find("link").text(),
                subComment: subItem.find("comments").text(),
                subDescription: subItem.find("description").text()
            };
            json.sub.push(tempData);
        })
    } else if (change == 1) {
        $('channel item').filter(function () {
            var subItem = $(this);
            var tempData = {
                subTitle: subItem.find("title").text(),
                subDescription: subItem.find("description")[0].childNodes[0].nodeValue
            };
            json.sub.push(tempData);
        })
    }
    return json;
}

/**
 * 
 * This function is used to extract data (In Progress)
 * @param {Object} obj 
 */
function fetchxmlDataHTML(obj) {
    console.log(1234);
    var $ = obj;
    var json = [];

    $('.regularitem').filter(function () {
        var subItem = $(this);
        console.log(subItem);
        var tempData = {
            title: subItem.find(".itemtitle").text(),
            content: subItem.find(".itemcontent").text(),
            enclosure: subItem.find(".mediaenclosure").text()
        };
        json.push(tempData);
    })
    return json;
}

app.listen('5000')

console.log('Magic happens on port 5000');

exports = module.exports = app;