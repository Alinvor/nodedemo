const utils = require('../utils/base64');

function onCallback(url) {
    if (null != url && url.length > 0) {
        utils.httpImageToBase64(url);
    }
}

console.log('...开始执行...');
// the repaired url with image
var url = [''];
onCallback(url[0]);
