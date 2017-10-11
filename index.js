const express = require('express');
const path = require('path')
const bodyParser = require('body-parser')
const calculate = require('./server/calculator')

const app = express();

//app.use(bodyParser.json()) i don't think we really need this.
app.use(bodyParser.urlencoded({ extended: true })); //extended is only required if we anticipate having deeply nested objects.
//you should delete it if that won't be the case

app.get("/", function(req, res){
  res.sendFile(path.join(__dirname+'/client/index.html'))
});

//error handling: should validate the request; provide some feedback to the user.
//
app.post("/calculate", function(req, res){
   res.send(calculate(req.body))
})

app.listen(3000, function(){
  console.log("Listening on port 3000")
});