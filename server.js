var http = require('http');

var fs = require('fs');
var url = require('url');
var path = require('path');

var Router = require('router');
var finalhandler = require('finalhandler');

var router = Router();

router.get('/public/*', function (req, res) {
	//console.log(req.path);
	var filePath = '.' + url.parse(req.url).pathname;
	//console.log(filePath);
    //파일확장자 추출
	var ext = path.extname(filePath).substring(1);

    fs.access(filePath, fs.R_OK, function(err){

        if (err) { //파일이 없는 경우
            console.log(filePath+'는 읽을수 없는 파일입니다.');
			var rs = fs.createReadStream('../views/doc/not_found.html'); //rederStream
            rs.pipe(res);
            res.end();
        } else {   //파일이 있는 경우
            var rs = fs.createReadStream(filePath); //rederStream
            rs.on('error', function(err){ // 에러 처리
                console.log("에러 처리 : ");
                console.log(err);
            });//rs.on(err)
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
                console.log("에러 처리 : ");
                console.log(err);
            });//rs.on(err)

            //content-type을 세팅해줌
            res.setHeader("Content-Type", "text/html");

            rs.pipe(res);//responce 파이핑 해 파일 내보내기
        }// if(err)

    });//fs.access


});





var server = http.createServer(function (req, res)  {
	router(req, res, finalhandler(req, res));
}).listen(80);



