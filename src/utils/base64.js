const http = require('https');
const env = require('../utils/env');
const fs = require('fs');
const moment = require('moment');
const path = require('path');

function httpImageToBase64(url) {
    http.get(url, function (res) {
        var chunks = []; // 用于保存网络请求不断加载传输的缓冲数据
        var size = 0; // 保存缓冲数据的总长度
        res.on('data', function (chunk) {
            /*
             * 在进行网络请求时，会不断接收到数据(数据不是一次性获取到的)，
             * node 会把接收到的数据片段逐段的保存在缓冲区（Buffer），
             * 这些数据片段会形成一个个缓冲对象（即Buffer对象），
             * 而Buffer数据的拼接并不能像字符串那样拼接（因为一个中文字符占三个字节），
             * 如果一个数据片段携带着一个中文的两个字节，下一个数据片段携带着最后一个字节，
             * 直接字符串拼接会导致乱码，为避免乱码，所以将得到缓冲数据推入到chunks 数组中，
             * 利用下面的node.js内置的Buffer.concat()方法进行拼接
             */
            chunks.push(chunk);
            size += chunk.length; // 累加缓冲数据的长度
        });
        res.on('end', function (err) {
            // Buffer.concat 将chunks数组中的缓冲数据拼接起来，返回一个新的Buffer 对象赋值给data
            var data = Buffer.concat(chunks, size);
            // 可通过Buffer.isBuffer() 方法判断变量是否为一个Buffer 对象
            // console.log(Buffer.isBuffer(data));
            // 将Buffer对象转换为字符串并以base64编码格式显示
            var base64Img = data.toString('base64');
            // console.log('url:(' + url + ') to Base64:\n' + base64Img);
            let build = env.BUILD;
            if (fs.existsSync(build)) {
                // nothing to do
            } else {
                fs.mkdir(build, err => {
                    if (err) throw err;
                });
            }
            let x_file = path.join(env.BUILD, moment().format('YYYYMMDD_HHmmss') + '.txt');
            if (x_file) {
                env.writeToFile(x_file, base64Img);
                console.log('\n...生成 ' + x_file + ' 格式文件完成...');
            }
        });
    });
}

function base64Encode(value) {
    // create a buffer
    let buff = Buffer.from(value, 'utf-8');
    //  decode buffer as Base64
    return buff.toString('base64');
}

function base64Decode(value) {
    //  create a buffer
    const buff = Buffer.from(value, 'base64');
    //  decode buffer as UTF-8
    return buff.toString('utf-8');
}

module.exports = {
    httpImageToBase64,
    base64Encode,
    base64Decode,
};
