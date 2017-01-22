const express = require('express');
const app = express();
const fs = require('fs');
// 라우팅
const router = express.Router();
// mysql 연동
const mysql = require('mysql');
// bodyParser 사용
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));
//ejs사용
const ejs = require('ejs');
// 세션 관리 위한 session 사용
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
// express에 세션 설정 적용
//1.쿠키변조 방지, 2.세션을 언제나 저장할지, 3.저장되기전에 uninitial
app.use(session({
    secret: '!@#$MY!@#$',
    resave: false,
    saveUnitialized: true,
    store:new MySQLStore({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '5555',
      database: 'test1'
    })
}));

//쿠키 확인 /count
app.get('/count',function(req,res){
  if(req.session.count){
    req.session.count++;
  }else{
    req.session.count =1;
  }
  res.send('count: ' + req.session.count);
});

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

//로그인,회원가입창 라우팅 < url & 관련js위치 >
app.use('/', require('./routes/login').router);
app.use('/signin', require('./routes/singin').router);
app.use('/welcome',require('./routes/welcome').router);

//로그인성공했을때
app.get('/log',function(req,res){
  if(req.session.displayName) {
    // res.send(req.session);
    res.send(`
    <h1>Hello, ${req.session.displayName} </h1>
    `);
  } else{
    res.send(`
      <h1>Welcome</h1>
      <a href="/">`)
  }
});

//mysql 데이터 비교 로그인 성공
app.post('/',function(req,res){
  console.log('날라감');
  var user_id = req.body.user_id;
  var password = req.body.password;
  console.log(user_id, password);

  var sql = 'select count(*) cnt from root where user_id=? and password=?';
  connection.query(sql, [user_id, password], function(err, rows){
    console.log('rows',rows);
    var cnt = rows[0].cnt;
    if(cnt == 1){
      req.session.displayName = user_id;
      res.send('<script> alert("로그인성공");location.href="./welcome";</script>');
      // res.send('<script> alert("로그인성공");location.href="./log";</script>');

      //세션 코드 실행
      // req.session.displayName = user_id;
      // res.send('<script> alert("로그인성공");</script>');
      // res.redirect('/welcome');
      console.log(cnt);
      console.log(user_id);
    }else {
      res.send('<script> alert("로그인실패");history.back();</script>');
      console.log(cnt);
    }
  });
});

//mysql 회원가입 DB쓰기 성공
app.post('/signin', function(req, res) {
    var user = {
        'user_id': req.body.user_id,
        'password': req.body.password,
        'name': req.body.name,
        'sex': req.body.sex,
        'phonenumber': req.body.phonenumber
    };

    var sql = 'INSERT INTO root SET ?';
    connection.query(sql, user, function(err, result) {
        if (err) {
            console.log(err);
            res.send('<script>alert("가입실패");</script>');
            res.status(500);
        } else {
            res.send('<script>alert("가입성공");</script>');
            res.redirect('/') //signin에서 보내고 메인으로 돌아온다.
        } //else
    }); //query
}); //app.post




// app.post('/',function(req,res){
//   console.log('날라감');
//   var user_id = req.body.user_id;
//   var password = req.body.password;
//   console.log(user_id, password);
//
//   pool.getConnection(function(err, conn) {
//       if (err) console.error('err', err);
//       conn.query('select count(*) from root where user_id=? and password=?', [user_id, password], function(err, rows) {
//         console.log('rows', rows);
//         var cnt = rows[0].cnt;
//         if (cnt == 1) {
//           req.session.user_id = user_id;
//           res.send('<script> alert("로그인성공");location.href="/";</script>');
//         } else {
//           res.json({
//             result: 'fail'
//           });
//           res.send('<script> alert("로그인실패");history.back();</script>');
//         } // else
//       }); //conn
//     }); //pool
//   });//get

// app.post('/', function(req, res) {
//   var user_id = req.body.user_id;
//   var password = req.body.password;
//
//   pool.getConnection(function(err, conn) {
//     if (err) console.error('err', err);
//     conn.query('select count(*) from root where user_id=? and password=?', [user_id, password], function(err, rows) {
//       console.log('rows', rows);
//       var cnt = rows[0].cnt;
//       if (cnt == 1) {
//         req.session.user_id = user_id;
//         res.send('<script> alert("로그인성공");location.href="/";</script>');
//       } else {
//         res.json({
//           result: 'fail'
//         });
//         res.send('<script> alert("로그인실패");history.back();</script>');
//       } // else
//     }); //conn
//   }); //pool
// });//get

// 로그아웃 구현
app.get('/logout',function(req,res){
  req.session.destory(function(err){
    if(err) console.error('err',err);
    res.send('<script>alert("로그아웃 되었습니다.");location.href="/"</script>');
  });//req.session.destory
});//get


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
