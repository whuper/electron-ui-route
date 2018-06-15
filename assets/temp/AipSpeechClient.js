var AipSpeechClient = require("baidu-aip-sdk").speech;

// 设置APPID/AK/SK
var APP_ID = "11405723";
var API_KEY = "nTrfKypNEi2n59hGCzy0oBcY";
var SECRET_KEY = "EL3HrYAv2l8g3hq5TxnMX7rMCj0mkLp4";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);




var HttpClient = require("baidu-aip-sdk").HttpClient;

// 设置request库的一些参数，例如代理服务地址，超时时间等
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestOptions({timeout: 5000});

// 也可以设置拦截每次请求（设置拦截后，调用的setRequestOptions设置的参数将不生效）,
// 可以按需修改request参数（无论是否修改，必须返回函数调用参数）
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestInterceptor(function(requestOptions) {
    // 查看参数
    //console.log(requestOptions)
    // 修改参数
    requestOptions.timeout = 5000;
    // 返回参数
    return requestOptions;
});

var sentence = 'The woods are lovely,dark and deep. But I have promises to keep. And miles to go before I sleep.';
var sentence2 = 'Don\'t aim for success,if you really want it,just stick to what you love and believe in, and it will come naturally.';
// 语音合成
var fs = require('fs');


client.text2audio(sentence2).then(function(result) {
    if (result.data) {
        fs.writeFileSync('tts.mpVoice3.mp3', result.data);
    } else {
        // 服务发生错误
        console.log(result)
    }
}, function(e) {
    // 发生网络错误
    console.log(e)
});

/*
// 语音合成, 附带可选参数
client.text2audio('百度语音合成测试', {spd: 0, per: 4}).then(function(result) {
    if (result.data) {
        fs.writeFileSync('tts.mpVoice.mp3', result.data);
    } else {
        // 服务发生错误
        console.log(result)
    }
}, function(e) {
    // 发生网络错误
    console.log(e)
});
*/
