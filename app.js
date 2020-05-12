const express = require('express');
const bodyParser = require('body-parser');
const request = require("request");
//the app which is a new instant of express
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res) {

  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us3.api.mailchimp.com/3.0/lists/0c15f09ea5",
    method: "POST",
    //for authorisation, first string as any string and second one is our api
    headers: {
      "Authorization": "Tanya1 1be615e273ce324105d993d6ac4748fb-us3"
    },
    body: jsonData
  };

  request(options, function(error, response, body) {
    if (error) {
      res.sendFile(__dirname + "failure.html");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "success.html");
      } else {
        res.sendFile(__dirname + "failure.html");
      }
    }
  });

});

app.post("/failure", function(req, res){
  res.redirect("/")
});

//an express app listening on whatever port heroku choses and also on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log('server is running on port 3000');
});

// API Key
// 1be615e273ce324105d993d6ac4748fb-us3
// 1be615e273ce324105d993d6ac4748fb-us3

// list ID
// 0c15f09ea5
