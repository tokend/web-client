import _cloneDeep from 'lodash/cloneDeep'
import i18next from 'i18next'

const mockEn = {
  'config': {
    'number': {
      'formats': {
        'amounts': {
          'usd': '$0,0.[00]',
          'eur': '0,0.[00]€',
          'gbp': '0,0.[00]£',
          'default': '0,0.[000000]'
        },
        'default': '0,0.[000000]',
        'integer': '0,0',
        'percent': '0,0.[00]%',
        'order_number': '0,0o'
      }
    },

    'date': {
      'presets': {
        'time': 'h:mm',
        'date': 'MMMM D, YYYY',
        'datetime': 'MMMM D, YYYY [at] h:mm'
      },
      'formats': {
        'same_day': '[today at] HH:mm',
        'last_day': '[yesterday at] HH:mm',
        'next_day': '[tomorrow at] HH:mm',
        'last_week': '[last] dddd [at] HH:mm',
        'next_week': '[next] dddd [at] HH:mm'
      }
    }
  },

  'translations': {
    'simple': 'simple string',
    'interpolated': 'The text with some {{stuff}}',
    'withFormattedNumber': 'Congrats, it is your {{count, number}} visit!',
    'withFormattedCurrency': 'Your balance is {{amount, money}}',
    'withFormattedOrderNumber': 'You are in the {{place, order_number}} place',
    'withFormattedDateFuture': 'The offer ends {{when, calendar}}',
    'withFormattedDatePast': 'The offer ended {{when, calendar}}',
    'withFormattedInteger': 'John bought {{amount, integer}} apples'
  }
}

/* eslint-disable-next-line import/no-webpack-loader-syntax */
const webpackInjector = require('inject-loader!babel-loader!./index.js')
const { i18nOptions } = webpackInjector({
  './en': mockEn
})

describe('the i18n is properly configured', () => {
  beforeEach(() => {
    const options = _cloneDeep(i18nOptions)
    options.lng = 'en'
    options.debug = false // Set to true, if something is not working
    i18next.init(options)
  })

  it('init test', () => {
    expect(i18next.t('simple')).to.equal('simple string')
  })

  it('interpolates properly', () => {
    const result = i18next.t('interpolated', {
      stuff: 'awesome stuff'
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
        '400000': '400,000'
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
        '400000': '400,000 ETH'
      }

      for (const [given, expected] of Object.entries(amounts)) {
        it(`given = ${given}`, () => {
          const result = i18next.t('withFormattedCurrency', {
            amount: {
              value: given,
              currency: 'ETH'
            }
          })
          expect(result).to.equal(`Your balance is ${expected}`)
        })
      }
    })

    describe('formats the preset currency', () => {
      const amounts = {
        '1': '$1',
        '15.233': '$15.23',
        '105.23400': '$105.23',
        '509.22119821': '$509.22',
        '152.123000': '$152.12',
        '1200': '$1,200',
        '1200.123123': '$1,200.12',
        '10500': '$10,500',
        '21500.2300': '$21,500.23',
        '400000': '$400,000'
      }

      for (const [given, expected] of Object.entries(amounts)) {
        it(`given = ${given}`, () => {
          const result = i18next.t('withFormattedCurrency', {
            amount: {
              value: given,
              currency: 'USD'
            }
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
        '400000': '400,000'
      }

      for (const [given, expected] of Object.entries(amounts)) {
        it(`given = ${given}`, () => {
          const result = i18next.t('withFormattedCurrency', {
            amount: given
          })
          expect(result).to.equal(`Your balance is ${expected}`)
        })
      }
    })

    describe('formats the order number', () => {
      const numbers = {
        '1': '1st',
        '2': '2nd',
        '3': '3rd',
        '4': '4th',
        '10': '10th',
        '126': '126th',
        '1210': '1,210th',
        '100500': '100,500th'
      }

      for (const [given, expected] of Object.entries(numbers)) {
        it(`given = ${given}`, () => {
          const result = i18next.t('withFormattedOrderNumber', {
            place: given
          })
          expect(result).to.equal(`You are in the ${expected} place`)
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
        '400000': '400,000'
      }

      for (const [given, expected] of Object.entries(numbers)) {
        it(`given = ${given}`, () => {
          const result = i18next.t('withFormattedInteger', {
            amount: given
          })
          expect(result).to.equal(`John bought ${expected} apples`)
        })
      }
    })
  })

  describe('formats dates', () => {
    beforeEach(() => {
      sinon.restore()
      sinon.useFakeTimers({
        now: 1542968022000 // 23 Nov 2018
      })
    })

    it('formats the today\'s date', () => {
      const when = '2018-11-23T10:23:45Z'
      const result = i18next.t('withFormattedDateFuture', { when })
      expect(result).to.equal('The offer ends today at 10:23')
    })

    it('formats the next week date', () => {
      const when = '2018-11-29T10:23:45Z'
      const result = i18next.t('withFormattedDateFuture', { when })
      expect(result).to.equal('The offer ends next Thursday at 10:23')
    })

    it('formats the tomorrow\'s date', () => {
      const when = '2018-11-24T10:23:45Z'
      const result = i18next.t('withFormattedDateFuture', { when })
      expect(result).to.equal('The offer ends tomorrow at 10:23')
    })

    it('formats the yesterday\'s date', () => {
      const when = '2018-11-22T10:23:45Z'
      const result = i18next.t('withFormattedDatePast', { when })
      expect(result).to.equal('The offer ended yesterday at 10:23')
    })

    it('formats the last week date', () => {
      const when = '2018-11-17T10:23:45Z'
      const result = i18next.t('withFormattedDatePast', { when })
      expect(result).to.equal('The offer ended last Saturday at 10:23')
    })
  })
})
