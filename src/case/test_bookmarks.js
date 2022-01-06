/**
 * 1. https://cheerio.js.org/index.html
 * 2. https://github.com/cheeriojs/cheerio/wiki/Chinese-README
 */
const cheerio = require('cheerio');
const env = require('../utils/env');
const fs = require('fs');
const path = require('path');

let content = '<h2 class="title">Hello world</h2>';
var file_name = path.join(env.TEMP, 'bookmarks.html');
if (fs.existsSync(file_name)) {
    content = env.readFromFile(file_name);
} else {
    throw Error('the sepical file that is not found.');
}
console.log('...开始构建...');
if (content) {
    const $ = cheerio.load(content);

    // 案例一
    // $('h2.title').text('Hello there!');
    // $('h2').addClass('welcome');

    // $.html();
    //=> <html><head></head><body><h2 class="title welcome">Hello there!</h2></body></html>

    // 案例二
    // <ul id="fruits">
    //   <li class="apple">Apple</li>
    //   <li class="orange">Orange</li>
    //   <li class="pear">Pear</li>
    // </ul>

    // $('.apple', '#fruits').text()
    //=> Apple

    // $('ul .pear').attr('class')
    //=> pear

    // $('li[class=orange]').html()
    //=> Orange

    // 案例三
    // $('#fruits').find('li').length
    //=> 3
    // $('#fruits').find($('.apple')).length
    //=> 1

    // console.log($('A').length);
    // console.log($('A').attr('href'));
    // console.log($('A').text().trim());

    let container_with_object = [];
    $('A').each(function (index, element) {
        let item = {};
        item.index = index;
        item.icon = $(this).attr('icon');
        item.name = $(this).text().trim();
        item.href = $(this).attr('href');
        item.timestamp = $(this).attr('add_date');
        container_with_object[index] = item;
    });
    if (null != container_with_object && container_with_object.length > 0) {
        let content = [];
        container_with_object.forEach((value, index) => {
            content.push(new String(index + 1) + '. [' + value.name + '](' + value.href + ')');
        });
        env.writeToRandomFile(content.join('\n'), value => {
            console.log('...构建 ' + value + ' 完成...');
        });
    }
}
