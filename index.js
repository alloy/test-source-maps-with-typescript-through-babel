const fs = require("fs")
const path = require("path")

const SourceMapConsumer = require("source-map").SourceMapConsumer

const babelConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./.babelrc"), "utf-8"))
const babelTransform = require("babel-core").transform
const babelGenerate = require("babel-generator").default

const ts = require("typescript")
const tsConfig = require("./tsconfig.json")

const filename = path.resolve(__dirname, "./fixture.tsx")
const source = fs.readFileSync(filename, "utf-8")

const tsResult = ts.transpileModule(source, {compilerOptions: tsConfig.compilerOptions, fileName:filename})
// This is what React Native does: https://github.com/facebook/react-native/blob/13b4c2d77b855a1e20b153700bdfa5106bfcc346/packager/transformer.js#L109-L116
const transformResult = babelTransform(tsResult.outputText, Object.assign({ filename: filename.replace(/tsx$/, 'js') }, babelConfig))
const generateResult = babelGenerate(transformResult.ast, {
  comments: false,
  compact: false,
  filename,
  sourceFileName: filename,
  sourceMaps: true,
}, source)

const transformSourceMap = new SourceMapConsumer(transformResult.map)
const generateSourceMap = new SourceMapConsumer(generateResult.map)

function compare(line, column) {
  const transformedPosition = transformSourceMap.generatedPositionFor({
    source: path.basename(filename), // TODO inconsistent with full path used with `generateSourceMap`.
    line,
    column,
  })

  const generatedPosition = generateSourceMap.generatedPositionFor({
    source: filename,
    line,
    column,
  })

  function codeAt(code, line, startColumn, numberOfColumns = 20) {
    return code.split("\n")[line-1].substring(startColumn-1, startColumn+numberOfColumns-1)
  }

  console.log(" Original: " + codeAt(source, line, column))
  console.log("Transform: " + codeAt(transformResult.code, transformedPosition.line, transformedPosition.column))
  console.log(" Generate: " + codeAt(generateResult.code, generatedPosition.line, generatedPosition.column))
  console.log("")
}

console.log("-----------------")
console.log("Original")
console.log("-----------------")
console.log(source)

console.log("-----------------")
console.log("tsc output")
console.log("-----------------")
console.log(tsResult.outputText)

console.log("----------------------")
console.log("babel transform output")
console.log("----------------------")
console.log(transformResult.code)

console.log("----------------------")
console.log("babel generate output")
console.log("----------------------")
console.log(generateResult.code)

console.log("-----------------")
console.log("Assertions")
console.log("-----------------")
compare(1, 1)
compare(3, 16)
