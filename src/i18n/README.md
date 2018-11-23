# i18n flow

When formatting the string it's possible not only to interpolate the values, 
but also to format them. Internally, we use the [i18next][i18next] library. 
so the interpolations/formatting guides can be found in their [docs][i18next].

The currently available formats are:  
* `money` - will format the money depending on currency (2213 USD -> $2,213);
* `date` - will format the date to human-friendly format;
* `number` - will format the number;
* `order_number` - will format the order number (1 -> 1st, 10 -> 10th);
* `integer` - will round the number and format it as usual (1000.3412 -> 1,000)

To allow different formatting for different currencies, the `money` formatter is
a bit tricky. You can work with it like with any other default formatter by just
passing the value to format:

```javascript
const translations = {
  'balance': 'Your balance is {{balance, money}} ETH'
}

globalize('balance', {
  balance: '1000.05'
}) // will result in `Your balance is 1,000.05 ETH`
```

Or you can pass the object with `value` and `currency` params to format the
preset currency:

```javascript
const translations = {
  'balance': 'Your balance is {{balance, money}}'
}

globalize('balance', {
  balance: {
    value: '1000.05',
    currency: 'USD'
  }
}) // will result in `Your balance is $1,000.05`
```

If there is no preset for your currency, the return value will fallback to
default preset:

```javascript
const translations = {
  'balance': 'Your balance is {{balance, money}}'
}

globalize('balance', {
  balance: {
    value: '1000.05',
    currency: 'BTC'
  }
}) // will result in `Your balance is 1,000.05 BTC`
```

All the formatting functionalities are available through `globalize` method 
(that is also available as a Vue filter). Also there are the set of proxies to 
format only the values (not the whole string). All the proxies are available 
inside
the `vue/filters` directory.


[i18next]: https://i18next.com
