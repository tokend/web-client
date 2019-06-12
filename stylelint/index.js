const path = require('path')
let stylelint = require('stylelint')
let ruleName = 'plugin/kebab-case-file-name'

let messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: 'css files should have kebab-case names',
})

module.exports = stylelint.createPlugin(ruleName, function (max, options) {
  const kebabCaseRegex = new RegExp('^[_a-z0-9]+((\-[a-z0-9]+){1,})?.scss$')
  const scssRegex = new RegExp('.s[a|c]ss$')

  return function (root, result) {     
    // to access the variable for the whole of this file scss =           
    const filename = path.basename(root.source.input.file)

    // return new Promise(function(resolve) {
    if (scssRegex.test(filename) && !kebabCaseRegex.test(filename)) {
      console.log(filename)
      root.walkAtRules(function (atrule) {
        stylelint.utils.report({
          message: messages.rejected,
          node: atrule,
          result: result,
          ruleName: ruleName
        });
      })
    }
    // })
  }
});

module.exports.ruleName = ruleName
module.exports.messages = messages
