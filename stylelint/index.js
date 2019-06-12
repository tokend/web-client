const path = require('path')
let stylelint = require('stylelint')
let ruleName = 'plugin/kebab-case-file-name'

let messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: 'steve rejects this',
});

module.exports = stylelint.createPlugin(ruleName, function (max, options) {
  const kebabCaseRegex = new RegExp('^[a-z0-9]+((\-[a-z0-9]+){1,})?.scss$')
  const scssRegex = new RegExp('.s[a|c]ss$')

  return function (root, result) {     
    // to access the variable for the whole of this file scss =           
    const filename = path.basename(root.source.input.file)

    // return new Promise(function(resolve) {
    if (scssRegex.test(filename)) {
      console.log(filename)

      if (!kebabCaseRegex.test(filename)) {
        // root.utils.report("Filename '{{name}}' is not in kebab-case.", {
        // filename,
        // })
        // console.log(filename)
        // resolve()
      }
    }
    // })
  }
});

module.exports.ruleName = ruleName
module.exports.messages = messages