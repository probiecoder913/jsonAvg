const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const alert = require('alert');
var http = require('http');
var fs = require('fs'); 


const app = express();

app.use(bodyParser.urlencoded({
    extended:true
}))

app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/weatherdb',{useNewURLParser:true});

app.listen(3000,function(){
    console.log("Listening on port 3000!");
})

var db = mongoose.connection;
db.on('connected',function(){
    console.log("connected!")
})

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html")
})

const weatherSchema = new mongoose.Schema({
    metadata :
        {
            sensorId : {type: Number},
            type : {type: String},
        },
    timestamp : {type:Date},
    temp : {type:String},
    //reading: {JSON},
});

const Weather = mongoose.model("Weather",weatherSchema);

app.post("/",function(req,res){
    vsensorId = req.body.readings.sensorId;
    vtype = req.body.readings.type;
    vtimestamp = req.body.readings.timestamp;
    vtemp= req.body.readings;
   /* 
    var vtemp = req.body.readings.temp;
//var stringWithoutLineBreaks = stringWithLineBreaks.replace(/(\r\n|\n|\r)/gm, "");*/

    const weather = new Weather({
        
       metadata: {
           sensorId : vsensorId,
            type : vtype,
    },
        timestamp : vtimestamp,
        temp : vtemp,
        //reading: stringWithoutLineBreaks,
    });
   weather.save();
    res.redirect("/");
})
var sum = 0,i=0,val=0;

Weather.find(function(err,weather){
    if(err){
        console.log(err);
    }
    else{
        weather.forEach(item=>{
            i++;
            sum+= (item.temp)%100;
            if(sum){
                val=sum/i;
            }
        })
        console.log(val);
        alert(val+" Is the average temperature");

        http.createServer((val, res) => {
            fs.readFile('index.html', (err, data) => {
              if (err) {
                res.writeHead(500);
                res.end(err);
                return;
              }
          
              data = data.toString().replace(/\{\{someVal\}\}/, val);
              res.writeHead(200);
              res.end(data, 'utf8');
            });
          })
    }
})
