const express = require('express');
const fs=require('fs');
const router = express.Router();

/* GET sign page. */
// html파일 위치 root/signin.html
router.get('/', function(req, res) {
  fs.readFile('signin.html',(err,data)=>{
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

/* POST sign page. */
// html 파일 위치 root/signin.html
router.post('/', function(req, res) {
  fs.readFile('singin.html',(err,data)=>{
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
