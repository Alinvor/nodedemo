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
    let files = fs.readdirSync(env.BOOKMARKS, {
        encoding: 'utf-8',
    });
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
        // throw Error('the sepical file that is not found.');
        String.prototype.format = function () {
            var formatted = this;
            for (var arg in arguments) {
                formatted = formatted.replace('{' + arg + '}', arguments[arg]);
            }
            return formatted;
        };
        console.warn('...the sepical file({0}) that is not found...'.format(file_name));
        return container_with_object;
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
            item.name = $(this)
                .text()
                .trim()
                // .replace('\n', '')
                .replace(/\s{2,}/, ' ', 'gi');
            item.href = $(this).attr('href');
            item.timestamp = $(this).attr('add_date');
            item.duplicate = false;
            item.point = [0, 0];
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
        let current_index = 0;
        container_with_object.forEach((value, index) => {
            if (value.duplicate) {
                current_index = index;
            } else {
                current_index += 1;
                content.push(new String(current_index) + '. [' + value.name + '](' + value.href + ')');
            }
        }, current_index);
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
        const item_with_object = onExecute(value);
        if (null != item_with_object && item_with_object.length > 0) {
            container_with_object.forEach((cvalue, cindex) => {
                if (cvalue.point) {
                    cvalue.point[0] = cindex;
                }
                item_with_object.forEach((ivalue, iindex) => {
                    cvalue.point = [cindex, iindex];
                    ivalue.point = [cindex, iindex];
                    // if (cvalue.href === ivalue.href) {
                    //     if (cvalue.name != ivalue.name) {
                    //         cvalue.name += ' | ' + ivalue.name;
                    //     }
                    //     cvalue.duplicate = true;
                    // } else {
                    //     cvalue.duplicate = false;
                    // }
                    if (cvalue.href === ivalue.href) {
                        if (cvalue.timestamp >= ivalue.timestamp) {
                            ivalue.duplicate = true;
                        } else {
                            if (cvalue.name == ivalue.name) {
                                cvalue.name = ivalue.name;
                            } else {
                                cvalue.name += ' | ' + ivalue.name;
                            }
                            // cvalue.index = ivalue.index;
                            cvalue.icon = ivalue.icon;
                            cvalue.name = ivalue.name;
                            cvalue.href = ivalue.href;
                            cvalue.timestamp = ivalue.timestamp;
                            // cvalue.duplicate = ivalue.duplicate;
                            // cvalue.point = ivalue.point;
                        }
                    }
                    // if (cvalue.timestamp >= ivalue.timestamp) {
                    //     if (cvalue.href === ivalue.href) {
                    //         if (cvalue.name != ivalue.name) {
                    //             cvalue.name += ' | ' + ivalue.name;
                    //         }
                    //         ivalue.duplicate = true;
                    //     } else {
                    //         ivalue.duplicate = false;
                    //     }
                    // } else {
                    //     if (cvalue.href === ivalue.href) {
                    //         if (ivalue.name != cvalue.name) {
                    //             ivalue.name += ' | ' + cvalue.name;
                    //         }
                    //         cvalue.duplicate = true;
                    //     } else {
                    //         cvalue.duplicate = false;
                    //     }
                    // }
                }, cindex);
            });
            // 去重问题
            let item_with_object_with_filter = item_with_object.filter((value, index) => {
                return !value.duplicate;
            });
            if (null != item_with_object_with_filter && item_with_object_with_filter.length > 0) {
                container_with_object = container_with_object.concat(item_with_object_with_filter);
            }
            if (file_names.length - 1 == index) {
                onResult(container_with_object, () => {
                    console.log('...构建 ' + (index + 1) + '. ' + value + ' 完成...');
                });
            } else {
                (() => {
                    console.log('...构建 ' + (index + 1) + '. ' + value + ' 完成...');
                })();
            }
        }
    }, container_with_object);
    console.log('...构建完成...');
}

init();
