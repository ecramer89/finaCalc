import express from 'express';
import path from 'path'
import bodyParser from 'body-parser'
import {calculate} from './server/financialCalculator'

const app = express();

app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: true })); //extended is only required if we anticipate having deeply nested objects.
//you should delete it if that won't be the case

app.get("/", (req, res)=>{
  res.sendFile(path.join(__dirname+'/client/index.html'))
});

app.post("/calculate", (req, res)=>{
   calculate(req, res)
})

app.listen(3000, ()=>{
  console.log("Listening on port 3000")
});