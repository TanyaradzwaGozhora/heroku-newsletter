const express = require('express');
const bodyParser = require('body-parser');
const request = require("request");
const https = require('https');
const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
});

app.get('/success', function(req, res){
  res.sendFile('./success.html')
});

app.get('/failure', function(req,res){
  res.sendFile('./failure.html')
});

app.post("/", function(req, res) {

  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status:'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);

  const url = 'https://us3.api.mailchimp.com/3.0/lists/0c15f09ea5';

  const options = {
    method: 'POST',
    auth: 'tanya10:2b5de7d91334c4f0549fda10e8f5dec1-us3'
  };

  const request = https.request(url, options, function(response){

    if (response.statusCode === 200){
      res.sendFile(__dirname + '/success')
    } else {
      res.sendFile(__dirname + '/failure')
    }

    response.on('data', function(data){
        console.log(JSON.parse(data));
      })
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/")
});

//an express app listening on whatever port heroku choses and also on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log('server is running on port 3000');
});

// API Key
// 2b5de7d91334c4f0549fda10e8f5dec1-us3

// list ID
// 0c15f09ea5
