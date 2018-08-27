/** @format */

const babelCore = require('babel-core');
const readDir = require('readdir-plus');
const fs = require('fs');
const path = require('path');

const transforms = [
  content =>
    babelCore.transform(content, {
      babelrc: false,
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
      comments: true,
      presets: ['env']
    })
];

const indexJsPath = path.resolve(__dirname, './src/index.js');

let content = fs.readFileSync(indexJsPath, 'utf8').toString();

for (
  let transformsCopy = [].concat(transforms), transform = transformsCopy.shift();
  Boolean(transform);
  transform = transformsCopy.shift()
) {
  const result = transform(content);
  content = result.code;
}

fs.writeFileSync(path.resolve(__dirname, './lib/index.js'), content, 'utf8');
fs.writeFileSync(
  path.resolve(__dirname, './lib/index.min.js'),
  babelCore.transform(content, {
    babelrc: false,
    presets: ['minify']
  }),
  'utf8'
);
