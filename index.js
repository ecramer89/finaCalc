const express = require('express');
const path = require('path')
const bodyParser = require('body-parser')
const calculate = require('./server/calculator')

const app = express();

app.use(bodyParser.json())

app.get("/", function(req, res){
  res.sendFile(path.join(__dirname+'/client/index.html'))
});

//error handling: should validate the request; provide some feedback to the user.
//
app.post("/calculate", function(req, res){
   res.send(calculate(req))
})

app.listen(3000, function(){
  console.log("Listening on port 3000")
});