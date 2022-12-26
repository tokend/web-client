import { abbreviate } from './abbreviate'

describe('abbreviate helper', () => {
  describe('transforms the given', () => {
    const testCases = [
      { input: 'account', expectedOutput: 'A' },
      { input: 'Account', expectedOutput: 'A' },
      { input: 'unverified account', expectedOutput: 'UA' },
      { input: 'Unverified account', expectedOutput: 'UA' },
      { input: 'unverified Account', expectedOutput: 'UA' },
      { input: 'Unverified Account', expectedOutput: 'UA' },
      { input: 'Unverified A', expectedOutput: 'UA' },
      { input: 'Unverified a', expectedOutput: 'UA' },
      { input: 'u account', expectedOutput: 'UA' },
      { input: 'u Account', expectedOutput: 'UA' },
      { input: 'u a', expectedOutput: 'UA' },
      { input: 'u A', expectedOutput: 'UA' },
      { input: 'u a ', expectedOutput: 'UA' },
      { input: ' u a ', expectedOutput: 'UA' },
    ]

    for (const testCase of testCases) {
      it(`"${testCase.input}" to "${testCase.expectedOutput}"`, () => {
        const result = abbreviate(testCase.input)

        expect(result).to.equal(testCase.expectedOutput)
      })
    }
  })
})
