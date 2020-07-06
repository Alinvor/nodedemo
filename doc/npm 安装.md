
# NPM 安装

- [一. NPM 初始化](#一-npm-初始化)
- [二. NPM 安装](#二-npm-安装)

## 一. NPM 初始化

初始化，命令：

```node
npm init
```

示例过程如下:

```node
$ npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (nodedemo)
version: (1.0.0)
description: this is node demo project
entry point: (index.js)
test command:
git repository: git@github.com:Alinvor/nodedemo.git
keywords:
author: dvsnier
license: (ISC)
About to write to /Users/../node_demo/package.json:

{
  "name": "nodedemo",
  "version": "1.0.0",
  "description": "this is node demo project",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "dvsnier",
  "license": "ISC"
}


Is this OK? (yes) yes

```

## 二. NPM 安装

安装命令：

```node
npm install
```

示例过程，如下所示：

```node

$ npm install
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN nodedemo@1.0.0

up to date in 0.623s
```
