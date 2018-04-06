var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/', function (req, res) {
    
    url = 'http://www.fraservalleysoccer.com/goals.php';
    var json = {"scorers": []};
    
    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            // LAST NAME, FIRST NAME, REG #, DATE, COMPETITION, TEAM, GOALS
            var ln, fn, r, d, c, t, g;
            
            
            $('#content table tbody tr td table.padded-table3 tbody tr').filter(function () {
                var data = $(this);
                
                ln = data.children().eq(0).text();
                fn = data.children().eq(1).text();
                r = data.children().eq(2).text();
                d = data.children().eq(3).text();
                c = data.children().eq(4).text();
                t = data.children().eq(5).text();
                g = data.children().eq(6).text();
                
                if (t.includes("Westcoast FC Particrew") || t.includes("Westcoast FC Four") || t.includes("Westcoast FC 4") || t.includes("Westcoast FC Dinamo")) {
                    var exists = false;
                    
                    for (var i = 0; i < json.scorers.length; i++) {
                        if (json.scorers[i].reg === r) {
                            exists = true;
                        }
                    }
                    
                    if (!exists) {
                        json.scorers.push({"name": fn + " " + ln, "reg": r, "goals": parseInt(g)});
                    } else {
                        // search json.scorers for  index `r` and add goal
                        var ind = json.scorers.findIndex(function (value) {
                            return value.reg === r.toString()
                        });
                        json.scorers[ind].goals = parseInt(json.scorers[ind].goals + parseInt(g));
                    }
                }
            });
            res.send(json);
        }
        
        if (error) {
            console.log(error);
        }
    });
});

app.listen('8081');

console.log('FVSLSTATS running on http://localhost:8081/');

exports = module.exports = app;
