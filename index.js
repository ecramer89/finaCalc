import express from 'express';
import path from 'path'
import bodyParser from 'body-parser'
import {handler} from './server/financialCalculator'

const app = express();

app.use(bodyParser.json())

app.get("/", (req, res)=>{
  res.sendFile(path.join(__dirname+'/client/index.html'))
});

app.post("/calculate", (req, res)=>{
   handler(req, res)
})

app.listen(3000, ()=>{
  console.log("Listening on port 3000")
});