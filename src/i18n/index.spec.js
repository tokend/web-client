import _cloneDeep from 'lodash/cloneDeep'
import i18next from 'i18next'
import moment from 'moment-timezone'

const mockEn = {
  'config': {
    'number': {
      'formats': {
        'amounts': {
          'default': {
            'decimalSeparator': '.',
            'groupSeparator': ',',
            'groupSize': 3,
            'decimalPlaces': 6,
          },
        },
        'default': {
          'decimalSeparator': '.',
          'groupSeparator': ',',
          'groupSize': 3,
          'decimalPlaces': 6,
        },
        'integer': {
          'groupSeparator': ',',
          'groupSize': 3,
          'decimalPlaces': 0,
        },
        'percent': {
          'decimalSeparator': '.',
          'groupSeparator': ',',
          'groupSize': 3,
          'decimalPlaces': 6,
          'suffix': '%',
        },
      },
    },

    'date': {
      'presets': {
        'time': 'H:mm',
        'date': 'MMMM D, YYYY',
        'datetime': 'MMMM D, YYYY [at] H:mm',
      },
      'formats': {
        'same_day': '[today at] H:mm',
        'last_day': '[yesterday at] H:mm',
        'next_day': '[tomorrow at] H:mm',
        'last_week': '[last] dddd [at] H:mm',
        'next_week': '[next] dddd [at] H:mm',
      },
    },
  },

  'translations': {
    'simple': 'simple string',
    'interpolated': 'The text with some {{stuff}}',
    'withFormattedNumber': 'Congrats, it is your {{count, number}} visit!',
    'withFormattedCurrency': 'Your balance is {{amount, money}}',
    'withFormattedOrderNumber': 'You are in the {{place, order_number}} place',
    'withFormattedCalendar': 'The offer end date is {{when, calendar}}',
    'withFormattedDate': 'The offer end date is {{when, calendar}}',
    'withFormattedInteger': 'John bought {{amount, integer}} apples',
    'withFormattedFeeType': 'It\'s the {{type, fee_type}} fee type',
    'withFormattedFeeSubtype': 'It\'s the {{value, fee_subtype}} fee subtype',
    'fee-types': {
      'payment': 'Payment',
      'offer': 'Offer',
      'withdrawal': 'Withdrawal',
      'issuance': 'Issuance',
      'invest': 'Invest',
      'capital-deployment': 'Capital deployment',
      'operation': 'Operation',
      'payout': 'Payout',
      'incoming-outgoing': 'Incoming & Outgoing',
      'outgoing': 'Outgoing',
      'incoming': 'Incoming',
    },
  },
}

/* eslint-disable-next-line import/no-webpack-loader-syntax */
const webpackInjector = require('inject-loader!babel-loader!./index.js')
const { i18nOptions } = webpackInjector({
  './en': mockEn,
})

describe('the i18n is properly configured', () => {
  beforeEach(() => {
    const options = _cloneDeep(i18nOptions)
    options.lng = 'en'
    options.debug = false // Set to true, if something is not working
    moment.tz.setDefault('UTC') // Set timezone to 'UTC', so tests won't convert to local timezone
    i18next.init(options)
  })

  it('init test', () => {
    expect(i18next.t('simple')).to.equal('simple string')
  })

  it('interpolates properly', () => {
    const result = i18next.t('interpolated', {
      stuff: 'awesome stuff',
    })
    expect(result).to.equal('The text with some awesome stuff')
  })

  describe('formats the number', () => {
    describe('formats the simple number', () => {
      const numbers = {
        '1': '1',
        '15.233': '15.233',
        '105.23400': '105.234',
        '509.22119821': '509.221198',
        '152.123000': '152.123',
        '1200': '1,200',
        '1200.123123': '1,200.123123',
        '10500': '10,500',
        '21500.2300': '21,500.23',
        '400000': '400,000',
      }

      for (const [given, expected] of Object.entries(numbers)) {
        it(`given = ${given}`, () => {
          const result = i18next.t('withFormattedNumber', { count: given })
          expect(result).to.equal(`Congrats, it is your ${expected} visit!`)
        })
      }
    })

    describe('formats the custom currency', () => {
      const amounts = {
        '1': '1 ETH',
        '15.233': '15.233 ETH',
        '105.23400': '105.234 ETH',
        '509.22119821': '509.221198 ETH',
        '152.123000': '152.123 ETH',
        '1200': '1,200 ETH',
        '1200.123123': '1,200.123123 ETH',
        '10500': '10,500 ETH',
        '21500.2300': '21,500.23 ETH',
        '400000': '400,000 ETH',
      }

      for (const [given, expected] of Object.entries(amounts)) {
        it(`given = ${given}`, () => {
          const result = i18next.t('withFormattedCurrency', {
            amount: {
              value: given,
              currency: 'ETH',
            },
          })
          expect(result).to.equal(`Your balance is ${expected}`)
        })
      }
    })

    describe('formats the currency without the provided code', () => {
      const amounts = {
        '1': '1',
        '15.233': '15.233',
        '105.23400': '105.234',
        '509.22119821': '509.221198',
        '152.123000': '152.123',
        '1200': '1,200',
        '1200.123123': '1,200.123123',
        '10500': '10,500',
        '21500.2300': '21,500.23',
        '400000': '400,000',
        '85070591730234615847396907.784233': '85,070,591,730,234,615,847,396,907.784233',
      }

      for (const [given, expected] of Object.entries(amounts)) {
        it(`given = ${given}`, () => {
          const result = i18next.t('withFormattedCurrency', {
            amount: given,
          })
          expect(result).to.equal(`Your balance is ${expected}`)
        })
      }
    })

    describe('formats the integer', () => {
      const numbers = {
        '1': '1',
        '15.233': '15',
        '105.23400': '105',
        '509.22119821': '509',
        '152.123000': '152',
        '1200': '1,200',
        '1200.123123': '1,200',
        '10500': '10,500',
        '21500.2300': '21,500',
        '400000': '400,000',
      }

      for (const [given, expected] of Object.entries(numbers)) {
        it(`given = ${given}`, () => {
          const result = i18next.t('withFormattedInteger', {
            amount: given,
          })
          expect(result).to.equal(`John bought ${expected} apples`)
        })
      }
    })
  })

  describe('formats calendars', () => {
    beforeEach(() => {
      sinon.useFakeTimers({
        now: 1542968022000, // 23 Nov 2018
      })
    })

    afterEach(() => {
      sinon.restore()
    })

    const dates = {
      '2018-11-23T17:40:30Z': 'today at 17:40',
      '2018-11-29T09:55:12Z': 'next Thursday at 9:55',
      '2018-11-24T11:11:40Z': 'tomorrow at 11:11',
      '2018-11-22T23:53:55Z': 'yesterday at 23:53',
      '2018-11-17T12:22:10Z': 'last Saturday at 12:22',
    }

    for (const [given, expected] of Object.entries(dates)) {
      it(expected, () => {
        const result = i18next.t('withFormattedCalendar', { when: given })
        expect(result).to.equal(`The offer end date is ${expected}`)
      })
    }
  })

  describe('formats date', () => {
    beforeEach(() => {
      sinon.useFakeTimers({
        now: 1542968022000, // 23 Nov 2018
      })
    })

    afterEach(() => {
      sinon.restore()
    })

    const dates = {
      '2016-05-11T10:56:10Z': 'May 11, 2016 at 10:56',
      '1990-10-29T21:44:02Z': 'October 29, 1990 at 21:44',
      '2010-09-14T20:40:40Z': 'September 14, 2010 at 20:40',
      '2022-01-20T12:55:22Z': 'January 20, 2022 at 12:55',
      '2040-02-10T10:12:59Z': 'February 10, 2040 at 10:12',
    }

    for (const [given, expected] of Object.entries(dates)) {
      it(expected, () => {
        const result = i18next.t('withFormattedDate', { when: given })
        expect(result).to.equal(`The offer end date is ${expected}`)
      })
    }
  })
})
