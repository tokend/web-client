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
        'percent': '0.[00]%',
        'order_number': '0o'
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
    it('formats the simple number', () => {
      const result = i18next.t('withFormattedNumber', {
        count: '1000'
      })
      expect(result).to.equal('Congrats, it is your 1,000 visit!')
    })

    it('formats the custom currency', () => {
      const result = i18next.t('withFormattedCurrency', {
        amount: {
          value: '1020',
          currency: 'ETH'
        }
      })
      expect(result).to.equal('Your balance is 1,020 ETH')
    })

    it('formats the custom currency with floating point', () => {
      const result = i18next.t('withFormattedCurrency', {
        amount: {
          value: '5000.560010',
          currency: 'QTK'
        }
      })
      expect(result).to.equal('Your balance is 5,000.56001 QTK')
    })

    it('formats the preset currency', () => {
      const result = i18next.t('withFormattedCurrency', {
        amount: {
          value: '1002.500000',
          currency: 'USD'
        }
      })
      expect(result).to.equal('Your balance is $1,002.5')
    })

    it('formats the currency without the provided code', () => {
      const result = i18next.t('withFormattedCurrency', {
        amount: '2010.500000'
      })

      expect(result).to.equal('Your balance is 2,010.5')
    })

    it('formats the order number', () => {
      const result = i18next.t('withFormattedOrderNumber', {
        place: 1
      })

      expect(result).to.equal('You are in the 1st place')
    })

    it('formats the integer', () => {
      const result = i18next.t('withFormattedInteger', {
        amount: 5.00001
      })

      expect(result).to.equal('John bought 5 apples')
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
