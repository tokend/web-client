import { CsvUtil } from './csv.util'

describe.only('CsvUtil', () => {
  describe('static method', () => {
    describe('parse()', () => {
      describe('parses input with', () => {
        const suite = [
          {
            name: 'happy path',
            in: 'item1,item2,item3,item4',
            expected: [['item1', 'item2', 'item3', 'item4']],
          },
          {
            name: 'custom delimiters',
            in: 'item1::item2::item3::item4',
            inParams: { delimiters: '::' },
            expected: [['item1', 'item2', 'item3', 'item4']],
          },
          {
            name: 'extra trailing delimiter',
            in: 'item1,item2,item3,item4,',
            expected: [['item1', 'item2', 'item3', 'item4', '']],
          },
          {
            name: 'whitespace not trimmed',
            in: 'item1 , item2, item3 , item4, ',
            expected: [['item1 ', ' item2', ' item3 ', ' item4', ' ']],
          },
          {
            name: 'whitespace trimmed to left',
            in: 'item1 , item2, item3 , item4, ',
            inParams: { trimLeft: true },
            expected: [['item1 ', 'item2', 'item3 ', 'item4', '']],
          },
          {
            name: 'whitespace trimmed to right',
            in: 'item1 , item2, item3 , item4, ',
            inParams: { trimRight: true },
            expected: [['item1', ' item2', ' item3', ' item4', '']],
          },
          {
            name: 'whitespace trimmed to both',
            in: 'item1 , item2, item3 , item4, ',
            inParams: { trimLeft: true, trimRight: true },
            expected: [['item1', 'item2', 'item3', 'item4', '']],
          },
          {
            name: 'multiple rows',
            in: 'col1,col2\nitem11,item12\nitem21,item22',
            inParams: { trimLeft: true, trimRight: true },
            expected: [
              ['col1', 'col2'],
              ['item11', 'item12'],
              ['item21', 'item22']
            ],
          },
          {
            name: 'multiple rows but with holes',
            in: 'col1,\nitem11,\n,item22\nitem31,item32\n,',
            inParams: { trimLeft: true, trimRight: true },
            expected: [
              ['col1', ''],
              ['item11', ''],
              ['', 'item22'],
              ['item31', 'item32'],
              ['', ''],
            ],
          },
        ]

        for (const item of suite) {
          it(item.name, () => {
            const result = CsvUtil.parse(item.in, item.inParams)

            expect(result).to.eql(item.expected)
          })
        }
      })
    })
  })
})
