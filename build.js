/** @format */

var babelCore = require('babel-core');
var readDir = require('readdir-plus');
var fs = require('fs');

const transforms = [
  content =>
    babelCore.transform(content, {
      babelrc: false,
      presets: ['env'],
      plugins: [
        'minify-dead-code-elimination',
        'transform-minify-booleans',
        'minify-constant-folding',
        'minify-flip-comparisons'
      ]
    }),
  content =>
    babelCore.transform(content, {
      babelrc: false,
      presets: ['env', 'minify']
    })
];

new Promise((resolve, reject) =>
  readDir(__dirname + '/src/', { content: true }, (err, files) => {
    if (err) {
      reject(err);
    } else {
      resolve(files);
    }
  })
)
  .then(files => {
    for (
      let filesCopy = [].concat(files), file = filesCopy.shift();
      Boolean(file);
      file = filesCopy.shift()
    ) {
      let content = fs.readFileSync(file.path, 'utf8').toString();

      for (
        let transformsCopy = [].concat(transforms), transform = transformsCopy.shift();
        Boolean(transform);
        transform = transformsCopy.shift()
      ) {
        const result = transform(content);
        content = result.code;
      }

      fs.writeFileSync(__dirname + '/lib/' + file.name, content, 'utf8');
    }
  })
  .catch(err => console.error(err));
