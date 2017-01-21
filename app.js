const express = require('express');
const app = express();
const fs = require('fs');

// 라우팅
const router = express.Router();
// 정적인 파일 public에 저장
app.use(express.static('./public'));
// 보안적용 : x-powered-by 헤더 사용금지
//http://expressjs.com/ko/advanced/best-practice-security.html
app.disable('x-powered-by');

//로그인,회원가입창 라우팅 < url & 관련js위치 >
app.use('/',require('./routes/login').router);
app.use('/signin',require('./routes/singin').router);

// 포트 8888
app.listen(8888);

//라우트하기전
// app.get('/', function(req, res) {
// fs.readFile('login.html', (err, data) => {
//         if (err) {
//             console.log(err);
//         } else {
//             res.writeHead(200, {
//                 'Content-Type': 'text/html'
//             });
//             res.end(data);      
//         }       
//     });
// });
// app.get('/signin', function(req, res) { 
//     fs.readFile('signin.html', (err, data) => {    
//         if (err) {         
//             console.log(err);    
//         } else {         
//             res.writeHead(200, {
//                 'Content-Type': 'text/html'
//             });        
//             res.end(data);          
//         }     
//     });
// });
