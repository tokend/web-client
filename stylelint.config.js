// https://stylelint.io/user-guide/rules/

module.exports = {
  // Default <stylelint-processor-html> sometimes shows wrong number of the line
  // that has an error, so we use this add-on
  processors: [
    [
      '@mapbox/stylelint-processor-arbitrary-tags',
      { fileFilterRegex: [/\.vue$/] },
    ],
  ],
  plugins: ['stylelint-scss', 'stylelint-declaration-strict-value'],
  // css also is a valid scss so we don't need to use both - scss is enough
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'color-no-invalid-hex': [true, { severity: 'warning' }],
    'font-family-no-duplicate-names': [true, { severity: 'warning' }],
    'font-family-no-missing-generic-family-keyword': [
      true,
      { severity: 'warning' },
    ],
    'function-calc-no-unspaced-operator': [true, { severity: 'warning' }],
    'function-linear-gradient-no-nonstandard-direction': [
      true,
      { severity: 'warning' },
    ],
    'string-no-newline': [true, { severity: 'warning' }],
    'unit-no-unknown': [true, { severity: 'warning' }],
    'property-no-unknown': [
      true,
      {
        severity: 'warning',
        checkPrefixed: true,
      },
    ],
    'keyframe-declaration-no-important': [true, { severity: 'warning' }],
    'declaration-block-no-duplicate-properties': [
      true,
      { severity: 'warning' },
    ],
    'declaration-block-no-shorthand-property-overrides': [
      true,
      { severity: 'warning' },
    ],
    'block-no-empty': [true, { severity: 'warning' }],
    'selector-type-no-unknown': [true, { severity: 'warning' }],
    'media-feature-name-no-unknown': [true, { severity: 'warning' }],
    'comment-no-empty': [true, { severity: 'warning' }],
    'no-duplicate-at-import-rules': [true, { severity: 'warning' }],
    'no-extra-semicolons': [true, { severity: 'warning' }],
    'number-max-precision': [6, { severity: 'warning' }],
    'time-min-milliseconds': [100, { severity: 'warning' }],
    'unit-disallowed-list': [
      ['px', 'cm', 'mm', 'pt', 'in', 'pc'],
      {
        severity: 'warning',
        /**
         * it's not working with '["px", "dpi"]' syntax
         * as in example in the docs
         * so we need to use this hack with regex.
         */
        ignoreMediaFeatureNames: {
          px: [/a-zA-Z0-9/],
          dpi: [/a-zA-Z0-9/],
        },
        /**
         * allow to use 'px' and 'dpi' in variables that has prefix 'media-'
         *
         * we need to use "." (dot) at the beginning of the regex to prevent
         * handle variables values because linter doesn't read '$' value in the
         * "/^\$media-/" regex, so we try not to match the first character
         */
        ignoreProperties: {
          px: ['/^.media-/'],
          dpi: ['/^.media-/'],
        },
      },
    ],
    'shorthand-property-no-redundant-values': [true, { severity: 'warning' }],
    'value-no-vendor-prefix': [
      true,
      {
        severity: 'warning',
        ignoreValues: ['inline-box'],
      },
    ],
    'property-no-vendor-prefix': [
      true,
      {
        severity: 'warning',
        ignoreProperties: [
          'background-clip',
          'box-decoration-break',
          'box-orient',
          'transition-property',
          'appearance',
        ],
      },
    ],
    'declaration-block-no-redundant-longhand-properties': [
      true,
      { severity: 'warning' },
    ],
    'declaration-no-important': [true, { severity: 'warning' }],
    'declaration-block-single-line-max-declarations': [
      1,
      { severity: 'warning' },
    ],
    'selector-max-empty-lines': [0, { severity: 'warning' }],
    'at-rule-no-vendor-prefix': [true, { severity: 'warning' }],
    'no-unknown-animations': [true, { severity: 'warning' }],
    'color-hex-case': ['lower', { severity: 'warning' }],
    'color-hex-length': ['long', { severity: 'warning' }],
    'font-family-name-quotes': [
      'always-unless-keyword',
      { severity: 'warning' },
    ],
    'font-weight-notation': ['numeric', { severity: 'warning' }],
    'function-comma-newline-after': [
      'always-multi-line',
      { severity: 'warning' },
    ],
    'function-comma-newline-before': [
      'never-multi-line',
      { severity: 'warning' },
    ],
    'function-comma-space-after': [
      'always-single-line',
      { severity: 'warning' },
    ],
    'function-comma-space-before': ['never', { severity: 'warning' }],
    'function-max-empty-lines': [0, { severity: 'warning' }],
    'function-parentheses-newline-inside': [
      'always-multi-line',
      { severity: 'warning' },
    ],
    'function-parentheses-space-inside': [
      'never-single-line',
      { severity: 'warning' },
    ],
    'function-url-quotes': ['always', { severity: 'warning' }],
    'function-whitespace-after': ['always', { severity: 'warning' }],
    'number-leading-zero': ['always', { severity: 'warning' }],
    'number-no-trailing-zeros': [true, { severity: 'warning' }],
    'string-quotes': ['single', { severity: 'warning' }],
    'length-zero-no-unit': [true, { severity: 'warning' }],
    'unit-case': ['lower', { severity: 'warning' }],
    'value-keyword-case': ['lower', { severity: 'warning' }],
    'value-list-comma-space-after': [
      'always-single-line',
      { severity: 'warning' },
    ],
    'value-list-comma-space-before': ['never', { severity: 'warning' }],
    'value-list-max-empty-lines': [0, { severity: 'warning' }],
    'property-case': ['lower', { severity: 'warning' }],
    'declaration-bang-space-after': ['never', { severity: 'warning' }],
    'declaration-bang-space-before': ['always', { severity: 'warning' }],
    'declaration-colon-space-after': [
      'always-single-line',
      { severity: 'warning' },
    ],
    'declaration-colon-space-before': ['never', { severity: 'warning' }],
    'declaration-block-semicolon-newline-after': [
      'always-multi-line',
      { severity: 'warning' },
    ],
    'declaration-block-semicolon-space-after': [
      'always-single-line',
      { severity: 'warning' },
    ],
    'declaration-block-trailing-semicolon': ['always', { severity: 'warning' }],
    'block-closing-brace-empty-line-before': ['never', { severity: 'warning' }],
    'block-closing-brace-newline-after': ['always', { severity: 'warning' }],
    'block-closing-brace-space-before': [
      'always-single-line',
      { severity: 'warning' },
    ],
    'block-opening-brace-newline-after': [
      'always-multi-line',
      { severity: 'warning' },
    ],
    'block-opening-brace-space-after': [
      'always-single-line',
      { severity: 'warning' },
    ],
    'block-opening-brace-space-before': ['always', { severity: 'warning' }],
    'selector-attribute-brackets-space-inside': [
      'never',
      { severity: 'warning' },
    ],
    'selector-attribute-operator-space-after': [
      'never',
      { severity: 'warning' },
    ],
    'selector-attribute-operator-space-before': [
      'never',
      { severity: 'warning' },
    ],
    'selector-attribute-quotes': ['always', { severity: 'warning' }],
    'selector-combinator-space-after': ['always', { severity: 'warning' }],
    'selector-combinator-space-before': ['always', { severity: 'warning' }],
    'selector-pseudo-class-case': ['lower', { severity: 'warning' }],
    'selector-pseudo-class-parentheses-space-inside': [
      'never',
      { severity: 'warning' },
    ],
    'selector-pseudo-element-case': ['lower', { severity: 'warning' }],
    'selector-pseudo-element-colon-notation': [
      'single',
      { severity: 'warning' },
    ],
    'selector-type-case': ['lower', { severity: 'warning' }],
    'selector-list-comma-newline-after': ['always', { severity: 'warning' }],
    'selector-list-comma-space-after': [
      'always-single-line',
      { severity: 'warning' },
    ],
    'selector-list-comma-space-before': ['never', { severity: 'warning' }],
    'rule-empty-line-before': [
      'always-multi-line',
      {
        severity: 'warning',
        ignore: ['after-comment', 'first-nested'],
      },
    ],
    'media-feature-colon-space-after': ['always', { severity: 'warning' }],
    'media-feature-colon-space-before': ['never', { severity: 'warning' }],
    'media-feature-name-case': ['lower', { severity: 'warning' }],
    'media-feature-parentheses-space-inside': [
      'never',
      { severity: 'warning' },
    ],
    'media-feature-range-operator-space-after': [
      'always',
      { severity: 'warning' },
    ],
    'media-feature-range-operator-space-before': [
      'always',
      { severity: 'warning' },
    ],
    'media-query-list-comma-newline-after': [
      'always-multi-line',
      { severity: 'warning' },
    ],
    'media-query-list-comma-space-after': [
      'always-single-line',
      { severity: 'warning' },
    ],
    'at-rule-empty-line-before': [
      'always',
      {
        severity: 'warning',
        ignore: ['after-comment', 'first-nested'],
      },
    ],
    'at-rule-name-case': ['lower', { severity: 'warning' }],
    'at-rule-name-space-after': ['always', { severity: 'warning' }],
    'at-rule-semicolon-newline-after': ['always', { severity: 'warning' }],
    'at-rule-semicolon-space-before': ['never', { severity: 'warning' }],
    'comment-whitespace-inside': ['always', { severity: 'warning' }],
    indentation: [
      2,
      {
        severity: 'warning',
        baseIndentLevel: 0,
        ignore: ['param'],
      },
    ],
    linebreaks: ['unix', { severity: 'warning' }],
    'max-empty-lines': [
      1,
      {
        severity: 'warning',
        ignore: ['comments'],
      },
    ],
    'max-line-length': [
      80,
      {
        severity: 'warning',
        ignore: ['comments'],
      },
    ],
    'no-eol-whitespace': [true, { severity: 'warning' }],
    /**
     * disallow to use defined properties without variables
     */
    'scale-unlimited/declaration-strict-value': [
      ['/color/', 'z-index', 'fill', 'stroke'],
      {
        ignoreFunctions: false,
        ignoreKeywords: {
          // '' means default, for all
          '': ['currentColor', 'transparent', 'inherit', 'initial'],
          fill: ['none'],
          stroke: ['none'],
        },
      },
    ],
    'selector-pseudo-class-no-unknown': [true, { severity: 'warning' }],
    'selector-pseudo-element-no-unknown': [true, { severity: 'warning' }],
    'no-duplicate-selectors': [true, { severity: 'warning' }],
    'no-descending-specificity': [true, { severity: 'warning' }],
    'color-function-notation': 'legacy',
    'scss/at-mixin-parentheses-space-before': 'always',
    'alpha-value-notation': 'number',
    /* TEMP. disable */
    'no-empty-first-line': null,
    'selector-class-pattern': null,
    'function-name-case': null,
    'selector-no-vendor-prefix': null,
    'custom-property-empty-line-before': null,
    'no-empty-source': null,
    'scss/at-else-empty-line-before': null,
    'scss/at-if-closing-brace-space-after': null,
    'scss/at-if-closing-brace-newline-after': null,
    'scss/at-else-closing-brace-newline-after': null,
    'scss/at-else-closing-brace-space-after': null,
    'declaration-colon-newline-after': null,
    'scss/at-function-pattern': null,
    'selector-not-notation': 'simple',
  },
}
