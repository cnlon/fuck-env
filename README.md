# fuck-env

[![npm version](https://img.shields.io/npm/v/fuck-env.svg)](https://www.npmjs.com/package/fuck-env)
[![node version](https://img.shields.io/node/v/fuck-env.svg)](https://www.npmjs.com/package/fuck-env)
[![Build Status](https://travis-ci.org/cnlon/fuck-env.svg?branch=master)](https://travis-ci.org/cnlon/fuck-env)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

fuck-env 用于跨平台设置和聚合环境变量，支持 [.env 类型文件](https://github.com/motdotla/dotenv)和 [package.json 的 config 字段](https://docs.npmjs.com/files/package.json#config)。

## 安装

```bash
npm install fuck-env
```

## 示例

如有一个包含 package.json 和 main.js 两个文件的项目，文件代码如下：

*package.json*

```json
{
  "name": "fuck-env-demo",
  "config": {
    "USER": "lon",
    "REPO": "fuck-env"
  },
  "scripts": {
    "start": "fuck-env USER=cnlon node main.js"
  },
  "dependencies": {
    "fuck-env": "*"
  }
}

```

*main.js*

```javascript
const {USER, REPO} = process.env
console.log(`https://github.com/${USER}/${REPO}`)
```

执行 `npm start` 后，输出 `https://github.com/cnlon/fuck-env`，不论是在 Windows 还是 POSIX（macOS、Linux 等）系统中。

## [更多示例](https://github.com/cnlon/fuck-env/tree/master/examples/)

- [无 .env 文件](https://github.com/cnlon/fuck-env/tree/master/examples/demo1-without-env-file)
- [有 .env 文件](https://github.com/cnlon/fuck-env/tree/master/examples/demo2-with-env-file)
- [自定义 .env 文件路径](https://github.com/cnlon/fuck-env/tree/master/examples/demo3-with-custom-env-file)
- [使用默认 .env 文件](https://github.com/cnlon/fuck-env/tree/master/examples/demo4-with-default-env-file)
- [在 js 文件中使用 fuck-env](https://github.com/cnlon/fuck-env/tree/master/examples/demo5-require-in-js)

---

[MIT](https://github.com/cnlon/fuck-env/tree/master/LICENSE)
