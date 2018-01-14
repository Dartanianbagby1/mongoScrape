// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
// Initialize Express
var app = express();
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static("public"));

// Database configuration
mongoose.connect(
'mongodb://<dbuser>:<dbpassword>@ds111188.mlab.com:11188/heroku_tq09w94t'
);
var db = mongoose.connection;

//var databaseUrl = "week18day2";
//var collections = ["notes"];
//var databaseUrl2 = "scraper";
//var collections2 = ["scrapedData"];
db.on('error', function(err) {
    console.log('Mongoose Error: ', err);
});
// Hook mongojs configuration to the db variable
//var db = mongojs(databaseUrl, collections);
//db.on("error", function(error) {
// console.log("Database Error:", error);
//});
db.once('open', function() {
    console.log('connection success.');
});
/*db2.on("error", function(error) {
  console.log("Database Error:", error);
});*/
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
    res.send(index.html);
});






app.post("/articles/:id", function(req, res) {
            // Insert the note into the notes collection
            var newNote = new Note(req.body);
            newNote.save(function(err, doc) { // Log any errors
                if (error) {
                    console.log(error);
                } else {
                    Article.findOneAndUpdate({ '_id': req.params.id }, { 'note': doc._id })
                        .exec(function(err, doc) {
                            if (err) {
                                console.log(err);
                                // Otherwise, send the note back to the browser
                                // This will fire off the success function of the ajax request
                            } else {
                                res.send(doc);
                            }
                        });
                }
            });
          });
            // Retrieve results from mongo
            app.get("/articles/:id", function(req, res) {
                // Find all notes in the notes collection
                Article.findOne({ '_id': req.params.id })
                    .populate('note')
                    .exec(function(err, doc) {
                        // Log any errors
                        if (error) {
                            console.log(error);
                        }
                        // Otherwise, send json of the notes back to user
                        // This will fire off the success function of the ajax request
                        else {
                            res.json(doc);
                        }
                    });
            });

            // Retrieve data from the db
            app.get("/articles", function(req, res) {
                // Find all results from the scrapedData collection in the db
                Article.find({}, function(error, doc) {
                    // Throw any errors to the console
                    if (error) {
                        console.log(error);
                    }
                    // If there are no errors, send the data to the browser as json
                    else {
                        res.json(doc);
                    }
                });
            });

            // Scrape data from one site and place it into the mongodb db
            app.get("/scrape", function(req, res) {
                // Make a request for the news section of ycombinator
                request("https://www.nytimes.com/", function(error, response, html) {
                    // Load the html body from request into cheerio
                    var $ = cheerio.load(html);
                    console.log(html);
                    // For each element with a "title" class
                    $(".story-heading").each(function(i, element) {
                        var doc = {};
                        // Save the text and href of each link enclosed in the current element
                        doc.title = $(this).children("a").text();
                        doc.link = $(this).children("a").attr("href");

                            // Insert the data in the scrapedData db
                            var entry = new Article(doc);
                            entry.save(function(err, doc) {
                                if (err) {
                                    // Log the error if one is encountered during the query
                                    console.log(err);
                                } else {
                                    // Otherwise, log the inserted data
                                    console.log(doc);
                                }
                            });
                        
                    });
                });

                // Send a "Scrape Complete" message to the browser
                res.send("Scrape Complete");
            });


            // Listen on port 3000
            app.listen(process.env.PORT || 3000, function() {
                console.log("App running on port 3000!");
            });