var http = require('http');

var fs = require('fs');
var url = require('url');
var path = require('path');

var Router = require('router');
var finalhandler = require('finalhandler');

var router = Router();


var mock_data = { homekeepers : [
    {
        id : 1,
        payDate : "2016-02-11",
        inOut : "in",
        content : "월급",
        money : 1700000
    },
    {
        id : 2,
        payDate : "2016-02-11",
        inOut : "in",
        content : "책",
        money : 15000
    },
    {
        id : 3,
        payDate : "2016-02-11",
        inOut : "in",
        content : "피자 소주 (아빠 생일)",
        money : 20000
    },
    {
        id : 4,
        payDate : "2016-02-16",
        inOut : "out",
        content : "가방",
        money : 20000
    },
]};

function errhandler(err){
    console.log("에러 처리 : ");
    console.log(err);
}

function extractFileExt(filePath){
    return path.extname(filePath).substring(1);
}


router.get('/public/*', function (req, res) {

	var filePath = '.' + url.parse(req.url).pathname;
	var ext = extractFileExt(filePath);

    fs.access(filePath, fs.R_OK, function(err){

        if (err) { //파일이 없는 경우
            console.log(filePath+'는 읽을수 없는 파일입니다.');
			var rs = fs.createReadStream('../views/doc/not_found.html'); //rederStream
            rs.pipe(res);
            res.end();
        } else {   //파일이 있는 경우
            //err handler


            var rs = fs.createReadStream(filePath);
            rs.on('error', errhandler);

            var contextType = '';
            //확장자로 컨텍스트 타입 설정
            switch(ext) {
                case 'js':
                    contextType = 'text/js';
                    break;
                case 'css':
                    contextType = 'text/css';
                    break;
                case 'html':
                    contextType = 'text/html';
                    break;
                default:
                    contextType = 'image/'+ext;
            }
            //content-type을 세팅해줌
            res.setHeader("Content-Type", contextType);

            rs.pipe(res);//responce 파이핑 해 파일 내보내기
		}// if(err)

	});//fs.access


});//router get public

router.get('/moneyplaner', function (req, res)  {
    var filePath = "./main.html";
    fs.access(filePath, fs.R_OK, function(err){

        if (err) { //파일이 없는 경우
            console.log(filePath+'는 읽을수 없는 파일입니다.');
            var rs = fs.createReadStream('../views/doc/not_found.html'); //rederStream
            rs.pipe(res);
            res.end();
        } else {   //파일이 있는 경우

            var rs = fs.createReadStream(filePath); //rederStream
            rs.on('error', function(err){ // 에러 처리
                console.log("에러 처리 : "); console.log(err);
            });//rs.on(err)


            res.setHeader("Content-Type", "text/html");
            rs.pipe(res);

        }// if(err)

    });//fs.access

});

router.get('/api/homekeepers', function (req, res)  {

    var body = [];
   /* req.on('data', function(chunk) {
        console.log("chunk : " + chunk);
        body.push(chunk);
    }).on('end', function() {
        console.log(body);
    });*/
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(mock_data));
    console.log(JSON.stringify(mock_data));
    res.end();

});

//insert homekeeper
router.post('/api/homekeepers', function (req, res)  {

    var body = [];
    req.on('data', function(chunk) {
     console.log("chunk : " + chunk);
     body.push(chunk);
     }).on('end', function() {
     console.log(body);
     });
    res.end();

});




var server = http.createServer(function (req, res)  {
	router(req, res, finalhandler(req, res));
}).listen(80);



