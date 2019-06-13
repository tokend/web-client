const path = require('path')
let stylelint = require('stylelint')
let ruleName = 'plugin/kebab-case-file-name'

let messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: value => ` ${value} file name should have kebab-case namespace`,
})

module.exports = stylelint.createPlugin(ruleName, function (max, options) {
  const kebabCaseRegex = new RegExp('^[_a-z0-9]+((\-[a-z0-9]+){1,})?.s[a|c]ss$')
  const scssRegex = new RegExp('.s[a|c]ss$')
  const vueRegex = new RegExp('.vue$')

  return function (root, result) {
    const filename = path.basename(root.source.input.file)
    if (vueRegex.test(filename)) {
      return
    }
    if (scssRegex.test(filename) && kebabCaseRegex.test(filename)) {
      return
    }

    stylelint.utils.report({
      message: messages.rejected(filename),
      line: 1,
      result: result,
      ruleName: ruleName,
    })
  }
})

module.exports.ruleName = ruleName
module.exports.messages = messages
