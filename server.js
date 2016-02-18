var http = require('http');

var fs = require('fs');
var url = require('url');
var path = require('path');

var Router = require('router');
var finalhandler = require('finalhandler');
var useful = require('./my_modules/usefulFunction.js');

var router = Router();

//DB 연동부분 나중에 추출해 파일로 만들 예정
function insertHomekeeper(homekeeper) {
    mock_data.homekeepers.push(homekeeper);
}

/**
 * 가계부 내역 리스트를 보여줌
 * @param jsonData
 */
function findHomeKeeperList(jsonData) {
    return JSON.stringify(jsonData);
}

/**
 * 가계부내역을 삭제함
 * @param id
 */
function deleteHomeKeeper(id) {
    mock_data.homekeepers = mock_data.homekeepers.filter((val, ind, arr)=> {
        return val.id != id
    });
}


//request response 핸들링 하는 함수

/**
 * 파라미터의 값을 추출해 json 으로 만들어줌
 * @param data
 * @returns {{}}
 */
function getObjFromParam(data) {
    var obj = {}
    var temArr = (data+'').split('&');
    temArr.forEach((val, index, arr) => {
        var keyAndVal = val.split('=');
        var key = useful.fromSnakeToCamel(keyAndVal[0]);
        obj[key] = decodeURI(keyAndVal[1]);
    });
    return obj
}

/**
 * response 에 json 데이터를 담아 보내줌
 * @param response
 * @param jsonData
 */
function responseJson(response, jsonData) {
    response.setHeader("Content-Type", "application/json");


    var homekeeperList = findHomeKeeperList(jsonData);
    response.write(homekeeperList);
    response.end();
}






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

//select 하는 부분
router.get('/api/homekeepers', function (req, res)  {
    responseJson(res, mock_data);
});

//insert 하는 부분
router.post('/api/homekeepers', function (req, res)  {
    req.on('data', function(chunk) {

        var homekeeper = getObjFromParam(chunk);
        insertHomekeeper(homekeeper);

    }).on('end', function() {
        responseJson(res, mock_data);
    });
});

//delete 하는 부분
router.delete('/api/homekeepers/homekeeper', function (req, res)  {
    req.on('data', function(chunk) {

        var homekeeper = getObjFromParam(chunk);
        var id = homekeeper.id;
        deleteHomeKeeper(id);

    }).on('end', function() {
        responseJson(res, mock_data);
    });
});

//modify 하는 부분
router.post('/api/homekeepers/homekeeper', function (req, res)  {
    req.on('data', function(chunk) {
        console.log(chunk+'');
        var homekeeper = getObjFromParam(chunk);
        var id = homekeeper.id;
        mock_data.homekeepers = mock_data.homekeepers.map((val, ind, arr)=> {
            if (val.id == id)  val = homekeeper;
            return val;
        });

        console.log(mock_data.homekeepers);

    }).on('end', function() {
        responseJson(res, mock_data);
    });
});





var server = http.createServer(function (req, res)  {
	router(req, res, finalhandler(req, res));
}).listen(80);



exports.server = server;