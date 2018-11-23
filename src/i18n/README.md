# i18n flow

When formatting a string you are able to not only interpolate values,
but also to format them. We achieved it by using [i18next][i18next] translation 
library. You can find interpolations and formatting guides in 
their [docs][i18next].

Currently available formats are:  
* `money` - format the money depending on currency (2213 USD -> $2,213);
* `date` - format the date to human-friendly format;
* `number` - format the number;
* `order_number` - format the order number (1 -> 1st, 10 -> 10th);
* `integer` - convert and round number to a localized human-readable format (1000.3412 -> 1,000)

The `money` formatter is a bit tricky. You can work with it like with any 
other default formatter by just passing the value to format:

You passing not the string, but the object with `value` and `currency` params 
to format the preset currency:

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
(that is also available as a Vue filter): 

```html
<div class="some-text">
  {{
    'balance' | globalize({
      balance: {
        value: '1000.05',
        currency: 'BTC'
      }
    })
  }}
  
</div>
```

Also there are the set of proxies to 
format only the values (not the whole string). All the proxies are available 
inside the `vue/filters` directory.


[i18next]: https://i18next.com
