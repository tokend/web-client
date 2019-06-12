const path = require('path')

module.exports = {
  rules: {
    'no-template-literals': {
      create: function (context) {
        const snakeCaseRegex = new RegExp('^[a-z0-9]+((\-[a-z0-9]+){1,})?.sass$')

        return {
          'Program': function (node) {
            const filename = path.resolve(context.getFilename())
            const name = path.basename(filename, path.extname(filename))
            console.log(filename)
            if (!snakeCaseRegex.test(name)) {
              context.report(node, "Filename '{{name}}' is not in kebab_case.", {
                name,
              })
            }
          }
        }
      },
    },
  },
}
