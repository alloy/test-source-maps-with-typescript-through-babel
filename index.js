const fs = require("fs")
const path = require("path")

const SourceMapConsumer = require("source-map").SourceMapConsumer

const babel = require("babel-core")
const babelConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./.babelrc"), "utf-8"))
const babelGenerate = require("babel-generator").default

const ts = require("typescript")
const tsConfig = require("./tsconfig.json")

const filename = path.resolve(__dirname, "./fixture.tsx")
const source = fs.readFileSync(filename, "utf-8")

const tsResult = ts.transpileModule(source, {compilerOptions: tsConfig.compilerOptions, fileName:filename})
console.log(tsResult.outputText)
// const tsSourceMap = JSON.parse(tsResult.sourceMapText)
// console.log(tsSourceMap)

const babelResult = babel.transform(tsResult.outputText, Object.assign({ filename: filename.replace(/tsx$/, 'js') }, babelConfig))
console.log(babelResult)
console.log(babelResult.ast.tokens.find(token => token.value === "MyComponent").loc)
// console.log(babelResult.code)

// The doc for babel-generator says we need to pass an object like the following, but that’s not true it wants a string.
// const fileMap = {}
// fileMap[filename] = source

const generated = babelGenerate(babelResult.ast, {
  comments: false,
  compact: false,
  filename,
  sourceFileName: filename,
  sourceMaps: true,
  // inputSourceMap: tsSourceMap,
// }, tsResult.outputText)
}, source)

// console.log(generated.code)
// console.log(JSON.stringify(generated.map))

const sourceMap = new SourceMapConsumer(generated.map)
const generatedPosition = sourceMap.generatedPositionFor({
  source: filename,
  line: 3,
  column: 25,
})
// console.log(generatedPosition)

function codeAt(code, line, startColumn, numberOfColumns) {
  return code.split("\n")[line-1].substring(startColumn-1, startColumn+numberOfColumns-1)
}

console.log("")
console.log("Expected: " + codeAt(source, 3, 25, 11))
console.log("  Actual: " + codeAt(generated.code, generatedPosition.line, generatedPosition.column, 11))
