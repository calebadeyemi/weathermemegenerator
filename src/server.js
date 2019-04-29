var express = require('express');
//var cors = require('cors');
var request = require('request');
var app = express();
app.use(express.json());
//app.engine('',);
//app.use(cors());
app.get('/api', function(req, res){
  request('http://api.giphy.com/v1/gifs/random?tag=cold+weather&api_key=NgplQXmqoQEVvceyuKW8vlB7IgcYjxVK&limit=1', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let info = JSON.parse(body)
      // do more stuff
      res.json({data: info.data.images.original.url});
     console.log(info);
    }
  })
});
console.log(__dirname + '/../build');
app.use('/', express.static(require('path').resolve(__dirname + '/../build')));
app.listen(3000);
console.log("The server is now running on port 3000.");
