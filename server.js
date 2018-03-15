var stocks = {
    "AAPL": 95.0,
    "MSFT": 50.0,
    "AMZN": 300.0,
    "GOOG": 550.0,
    "YHOO": 35.0
}
function randomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
var stockUpdater;
var randomStockUpdater = function() {
    for (var symbol in stocks) {
        if(stocks.hasOwnProperty(symbol)) {
            var randomizedChange = randomInterval(-150, 150);
            var floatChange = randomizedChange / 100;
            stocks[symbol] += floatChange;
        }
    }
    var randomMSTime = randomInterval(500, 2500);
    stockUpdater = setTimeout(function() {
        randomStockUpdater();
    }, randomMSTime);
}
randomStockUpdater();

// 创建服务器
var WebSocketServer = require('ws').Server;
var ws = new WebSocketServer({
    port: 8181
});

// 需要相应操作
ws.on('connection',function (websocket) {
    console.log('client connected');
    var sendStockUpdates = function (ws) {
        if (ws.readyState == 1) {
            var stocksObj = {};
            for (var symbol in clientStocks) {
                stocksObj[symbol] = stocks[symbol];
            }
            if (stocksObj.length !== 0) {
                ws.send(JSON.stringify(stocksObj));//需要将对象转成字符串。WebSocket只支持文本和二进制数据
                console.log("更新", JSON.stringify(stocksObj));
            }
           
        }
    }
    var clientStockUpdater = setInterval(function () {
        sendStockUpdates(websocket);
    }, 1000);

    websocket.on('message',function(message){
        console.log('mes:', message)
        var stockRequest = JSON.parse(message);//根据请求过来的数据来更新。
        console.log("收到消息", stockRequest);
        clientStocks = stockRequest;
        sendStockUpdates(ws);
    });

    // websocket.send('something');

});        