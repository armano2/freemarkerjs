const freemarker = require('../index')
const fs = require('fs')
const path = require('path')
const assert = require('assert')
const lineColumn = require('line-column')

const parser = new freemarker.Parser()

const baseDir = path.join(__dirname, '..')
const testsPath = path.join(__dirname, '/resource/valid/')
const tests = fs.readdirSync(testsPath)
  .filter(f => fs.statSync(path.join(testsPath, f)).isDirectory())

function stringify (text) {
  return JSON.stringify(text, null, 2)
}

for (const name of tests) {
  describe(name, function () {
    const dir = path.join(testsPath, name)
    let data = {}
    const file = path.join(dir, 'template.ftl')

    it('should have no errors', function () {
      const template = fs.readFileSync(file, 'utf8')
      try {
        data = parser.parse(template)
      } catch (e) {
        let message = e.message
        if (e.nodeType) {
          const loc = lineColumn(template).fromIndex(e.start)
          message += `\n\tfile:.\\${path.relative(baseDir, file)}:${loc ? `${loc.line}:${loc.col}` : '0:0'}`
        }
        assert.fail(message)
      }
    })
    it('should have correct tokens', function () {
      const code = fs.readFileSync(path.join(dir, 'tokens.json'), 'utf8')
      assert.equal(stringify(data.tokens), code, 'tokens do match')
    })
    it('should have correct ast', function () {
      const code = fs.readFileSync(path.join(dir, 'ast.json'), 'utf8')
      assert.equal(stringify(data.ast), code, 'tokens do match')
    })
  })
}