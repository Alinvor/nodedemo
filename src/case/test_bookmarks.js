/**
 * 1. https://cheerio.js.org/index.html
 * 2. https://github.com/cheeriojs/cheerio/wiki/Chinese-README
 */
const cheerio = require('cheerio');
const env = require('../utils/env');
const fs = require('fs');
const path = require('path');

/**
 * 获取实例模式【推荐】
 */
function obtainUseCases() {
    let file_names = [];
    let files = fs.readdirSync(env.BOOKMARKS);
    if (null != files && files.length > 0) {
        files.forEach((value, index) => {
            file_names.push(path.join(env.BOOKMARKS, value));
        }, file_names);
    }
    return file_names;
}

/**
 * 获取单例模式
 */
function obtainSingleUseCases() {
    var file_name = path.join(env.BOOKMARKS, 'bookmarks.html');
    return file_name;
}

function onExecute(file_name) {
    let container_with_object = [];
    let content = '<h2 class="title">Hello world</h2>';
    if (fs.existsSync(file_name) && ['html', 'htm'].indexOf(file_name.split('.').pop().toLowerCase()) !== -1) {
        content = env.readFromFile(file_name);
    } else {
        throw Error('the sepical file that is not found.');
    }
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

        $('A').each(function (index, element) {
            let item = {};
            item.index = index;
            item.icon = $(this).attr('icon');
            item.name = $(this).text().trim();
            item.href = $(this).attr('href');
            item.timestamp = $(this).attr('add_date');
            item.duplicate = false;
            container_with_object[index] = item;
        });
    }
    return container_with_object;
}

/**
 * 输出到文件
 * @param {Dict} container_with_object
 */
function onResult(container_with_object, onCallback) {
    if (null != container_with_object && container_with_object.length > 0) {
        let content = [];
        container_with_object.forEach((value, index) => {
            content.push(new String(index + 1) + '. [' + value.name + '](' + value.href + ')');
        });
        env.writeToRandomFile(content.join('\n'), value => {
            onCallback();
        });
    }
}

/**
 * 初始化书签
 */
function init() {
    console.log('...开始构建...');
    let file_names = [];
    // 文件
    // file_names = [obtainSingleUseCases()];
    // 目录
    file_names = obtainUseCases();
    let container_with_object = [];
    file_names.forEach((value, index) => {
        // TODO 去重问题，暂不处理
        container_with_object = container_with_object.concat(onExecute(value));
        if (file_names.length - 1 == index) {
            onResult(container_with_object, () => {
                console.log('...构建 ' + (index + 1) + '. ' + value + ' 完成...');
            });
        } else {
            (() => {
                console.log('...构建 ' + (index + 1) + '. ' + value + ' 完成...');
            })();
        }
    }, container_with_object);
    console.log('...构建完成...');
}

init();
