const express = require('express');
const fs=require('fs');
const router = express.Router();

/* GET home page. */
// html파일 위치 root/login.html
router.get('/', function(req, res) {
  fs.readFile('login.html',(err,data)=>{
    if(err){
      console.log(err);
    }else{
      res.writeHead(200,{
        'Content-Type':'text/html'
      });
      res.end(data);
    }
  });
});

/* POST home page. */
// html파일 위치 root/login.html
router.post('/', function(req, res) {
  fs.readFile('login.html',(err,data)=>{
    if(err){
      console.log(err);
    }else{
      res.writeHead(200,{
        'Content-Type':'text/html'
      });
      res.end(data);
    }
  });
});

exports.router = router;
