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
            name: 'custom delimiters, variant',
            in: 'item1::item2::item3::item4',
            inParams: { delimiters: ['::'] },
            expected: [['item1', 'item2', 'item3', 'item4']],
          },
          {
            name: 'custom multiple delimiters',
            in: 'item1,item2,item3::item4',
            inParams: { delimiters: [',', '::'] },
            expected: [['item1', 'item2', 'item3', 'item4']],
          },
          {
            name: 'custom multiple delimiters, variant',
            // eslint-disable-next-line no-tabs
            in: 'item1,item2??item3\nitem4^item5 item6	item7',
            inParams: { delimiters: [',', '\n', '^', '??', ' ', '\t'] },
            expected: [
              ['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7'],
            ],
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
            name: 'whitespace trimmed to both, variant',
            in: 'item1 , item2, item3 , item4, ',
            inParams: { trim: true },
            expected: [['item1', 'item2', 'item3', 'item4', '']],
          },
          {
            name: 'multiple rows',
            in: 'col1,col2\nitem11,item12\nitem21,item22',
            inParams: { trimLeft: true, trimRight: true },
            expected: [
              ['col1', 'col2'],
              ['item11', 'item12'],
              ['item21', 'item22'],
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
          {
            name: 'empty results filtered',
            in: ',, ,,,,,   ,item1,item2,,item3,item4,',
            inParams: { filterEmpty: true },
            expected: [['item1', 'item2', 'item3', 'item4']],
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

    describe('parseConcat()', () => {
      it('returns concatenated result of CsvUtil.parse()', () => {
        sinon.stub(CsvUtil, 'parse')
        CsvUtil.parse
          .withArgs('item1,item2', { delimiters: ',' })
          .returns([['item1', 'item2']])
          .withArgs('item1\nitem2\nitem3', { delimiters: ',' })
          .returns([['item1'], ['item2'], ['item3']])

        expect(
          CsvUtil.parseConcat('item1,item2', { delimiters: ',' }),
          'variant 1'
        ).to.eql(['item1', 'item2'])

        expect(
          CsvUtil.parseConcat('item1\nitem2\nitem3', { delimiters: ',' }),
          'variant 2'
        ).to.eql(['item1', 'item2', 'item3'])

        CsvUtil.parse.restore()
      })
    })
  })
})
