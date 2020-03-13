// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

var requestTabs = document.getElementById('request-tabs').getElementsByTagName('li');
var requestSelectShowList = document.getElementsByClassName('request')[0].getElementsByClassName('select-show')[0].getElementsByClassName('request-item');
for (let i = 0; i < requestTabs.length; ++i) {
    requestTabs[i].onclick = function () {
        for (let i = 0; i < requestTabs.length; ++i) {
            if (requestTabs[i] === this) {
                requestTabs[i].className = 'active';
                requestSelectShowList[i].className = 'request-item active';
            } else {
                requestTabs[i].className = '';
                requestSelectShowList[i].className = 'request-item';
            }
        }
    }
}

var responseTabs = document.getElementById('response-tabs').getElementsByTagName('li');
var responseSelectShowList = document.getElementsByClassName('response')[0].getElementsByClassName('select-show')[0]
    .getElementsByClassName('response-item');
for (let i = 0; i < responseTabs.length; ++i) {
    responseTabs[i].onclick = function () {
        for (let i = 0; i < responseSelectShowList.length; ++i) {
            if (responseTabs[i] === this) {
                responseTabs[i].className = 'active';
                responseSelectShowList[i].className = 'response-item active';
            } else {
                responseTabs[i].className = '';
                responseSelectShowList[i].className = 'response-item';
            }
        }
    }
}

var addParamBtnList = document.getElementsByClassName('add-param-btn');
for (let i = 0; i < addParamBtnList.length; ++i) {
    var v = addParamBtnList[i];
    v.onclick = function () {
        addParam(this.parentNode);
    }
}
var deleteParamBtnList = document.getElementsByClassName('delete-param-btn');
for (let i = 0; i < deleteParamBtnList.length; ++i) {
    var v = deleteParamBtnList[i];
    v.onclick = function () {
        deleteParam(this.parentNode);
    }
}


// 添加参数
function addParam(node) {
    var table = node.getElementsByTagName('table')[0];
    var tr = document.createElement('tr');
    var tds = [], input = [];
    for (let i = 0; i < 3; ++i) {
        tds[i] = document.createElement('td');
        input[i] = document.createElement('input');
        tds[i].appendChild(input[i]);
        tr.appendChild(tds[i]);
    }

    input[0].type = 'text';
    input[0].placeholder = '参数名称';
    input[0].className = 'param-name';

    input[1].type = 'text';
    input[1].placeholder = '参数值';
    input[1].className = 'param-value';

    input[2].type = 'button';
    input[2].value = '删除参数';
    input[2].className = 'delete-param-btn';
    input[2].onclick = function () {
        deleteParam(this.parentNode);
    }
    table.appendChild(tr);
}

// 删除参数
function deleteParam(node) {
    var parentNode = node.parentNode
    var grandParentNode = parentNode.parentNode;
    grandParentNode.removeChild(parentNode);
}

document.getElementById('sendRequest').addEventListener('click', function () {
    var select = document.getElementById('requestMethods');
    var index = select.selectedIndex;
    if (select.options[index].value === 'GET')
        sendGet();
    else
        sendPost();
});

function sendGet() {
    var protocol;
    var url = document.getElementById('url').value;
    if (url == '') {
        console.error("url can't be empty", url);
        alert('url不能为空');
        return;
    }

    if (new RegExp('http://.*').test(url)) {
        protocol = 'http';
    } else if (new RegExp('https://.*').test(url)) {
        protocol = 'https';
    } else {
        protocol = 'http';
        url = 'http://' + url;
    }

    const http = require(protocol);
    const querystring = require('querystring');

    var paramsContent = querystring.stringify(getParams());

    if (paramsContent != '') {
        url += '?' + paramsContent;
    }

    var options = {
        method: 'GET',
        rejectUnauthorized: false,
        headers: getHeaders()
    }

    var req = http.request(url, options, res => {
        console.log('STATUS: ' + res.statusCode);
        // console.log('HEADERS:' + JSON.stringify(res.headers));

        var bodyData = '';
        var repType = res.headers['content-type'];

        document.getElementById('response-headers').value = formatJson(JSON.stringify(res.headers), null);

        res.on('data', (chunk) => {
            bodyData += chunk;
        });

        res.on('end', () => {
            var result = bodyData.toString();
            if (new RegExp('.*json.*').test(repType)) {
                result = formatJson(result);
            }
            document.getElementById('response-body').value = result;
        });
    });

    req.on('error', (e) => {
        console.log(e.message);
        document.getElementById('response-body').value = e.message;
        document.getElementById('response-headers').value = e.message;
    });
    req.end();
}

function sendPost() {
    var protocol = '';
    var url = document.getElementById('url').value;

    if (url == '') {
        console.error("url can't be empty", url);
        alert('url不能为空');
        return;
    }

    if (new RegExp('http://.*').test(url)) {
        protocol = 'http';
    } else if (new RegExp('https://.*').test(url)) {
        protocol = 'https';
    } else {
        protocol = 'http';
        url = 'http://' + url;
    }

    const http = require(protocol);
    const querystring = require('querystring');

    var requestBody = document.getElementById('request-body').value;
    requestBody = trim(requestBody);

    if (requestBody == '') {
        requestBody = querystring.stringify(getParams());
    }

    var options = {
        method: 'POST',
        rejectUnauthorized: false,
        headers: getHeaders()
    }

    var req = http.request(url, options, res => {
        console.log('STATUS: ' + res.statusCode);
        // console.log('HEADERS:' + JSON.stringify(res.headers));

        var bodyData = '';
        var repType = res.headers['content-type'];
        document.getElementById('response-headers').value = formatJson(JSON.stringify(res.headers), null);

        res.on('data', (chunk) => {
            bodyData += chunk;
        });

        res.on('end', () => {
            var result = bodyData.toString();
            if (new RegExp('.*json.*').test(repType)) {
                result = formatJson(result);
            }
            document.getElementById('response-body').value = result;
        });
    });

    req.on('error', (e) => {
        console.error(e.message);
        document.getElementById('response-body').value = e.message;
        document.getElementById('response-headers').value = e.message;
    });

    req.write(requestBody);
    req.end();
}

function getHeaders() {
    var headersTable = document.getElementById('headersTable');
    var inputs = headersTable.getElementsByTagName('input');
    var headers = '{';
    for (let i = 0; i < inputs.length; i += 3) {
        let name = inputs[i].value;
        let value = inputs[i + 1].value;
        name = trim(name);
        value = trim(value);
        if (name == '' && value == '') {
            continue;
        }
        headers += '"' + name + '": "' + value + '"';
        if (i + 3 < inputs.length - 1) {
            headers += ','
        }
    }
    headers += '}';
    return JSON.parse(headers);
}

function getParams() {
    var paramsTable = document.getElementById('paramsTable');
    var inputs = paramsTable.getElementsByTagName('input');
    var params = '{';
    for (let i = 0; i < inputs.length; i += 3) {
        let name = inputs[i].value;
        let value = inputs[i + 1].value;
        if (name == '' && value == '') {
            continue;
        }
        params += '"' + name + '": "' + value + '"';
        if (i + 3 < inputs.length - 1) {
            params += ','
        }
    }
    params += '}';
    return JSON.parse(params);
}

function trim(str) {

    var trimLeft = /^\s+/,
        trimRight = /\s+$/;

    return str.replace(trimLeft, "").replace(trimRight, "");
};

tabIndent.renderAll();
