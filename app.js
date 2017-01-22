const express = require('express');
const app = express();
const fs = require('fs');
// 라우팅
const router = express.Router();
// mysql 연동
const mysql = require('mysql');
// bodyParser 사용
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


// 쿠기 및 바디 파서 사용
// app.use(express.cookieParser());
// app.use(express.bodyParser());

// 정적인 파일 public에 저장
app.use(express.static('./public'));
// 보안적용 : x-powered-by 헤더 사용금지
//http://expressjs.com/ko/advanced/best-practice-security.html
app.disable('x-powered-by');

//mysql 연동
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '5555',
    database: 'test1'
});

// mysql 연동 확인 및 오류발생시 처리
connection.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    } else {
        console.log('mysql connected');
    }
});

// 쿼리 잘 날라가는 지 확인
// connection.query('SELECT * FROM root', function(err,rows,fields){
//   if (err) {
//     console.log(err);
//   }else {
//   console.log('rows', rows);
//   console.log('fields',fields);
//   }
// });

//signin 에서 post보낼때 mysql에 넣는거
app.post('/signin',function(req,res) {
  var user = {
    'user_id':req.body.user_id,
    'password':req.body.password,
    'name':req.body.name,
    'sex':req.body.sex,
    'phonenumber':req.body.phonenumber
  };

  var sql = 'INSERT INTO root SET ?';
  connection.query(sql,user,function(err,result){
    if(err){
      console.log(err);
      res.status(500);
    }else{
      res.redirect('/')
    }
  });
});

//로그인,회원가입창 라우팅 < url & 관련js위치 >
app.use('/', require('./routes/login').router);
app.use('/signin', require('./routes/singin').router);

// 포트 8888
app.listen(8888, function() {
    console.log('Connected 8888 port');
});


////////////////////////////////////////////////////////////////////////////////
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
