const express = require('express');
const fs=require('fs');
const router = express.Router();
const ejs =require('ejs');
const http = require('http');
// router.engine('html', require('ejs').renderFile);
/* GET home page. */
// html파일 위치 root/login.html
// router.get('/', function(req, res) {
//   fs.readFile('welcome.ejs',(err,data)=>{
//     if(err){
//       console.log(err);
//     }else{
//       // res.send(req.session);
//       // res.send(req.session.displayName);
//       res.writeHead(200,{
//         'Content-Type':'text/html'
//       });
//       res.end(data);
//     }
//   });
// });

router.get('/',function(req,res) {
  res.render('welcome.ejs', { name: req.session.displayName });
});



exports.router = router;
