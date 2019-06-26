# i18n flow

When formatting a string you are able to not only interpolate values,
but also to format them. We achieved it by using [i18next][i18next] translation
library. You can find interpolations and formatting guides in
their [docs][i18next].

Currently available formats are:
* `money` - format the money depending on currency (2213 USD -> $2,213);
* `date` - format the date to human-friendly format;
* `number` - format the number;
* `order-number` - format the order number (1 -> 1st, 10 -> 10th);
* `integer` - convert and round number to a localized human-readable format (1000.3412 -> 1,000);
* `fee_type` - convert fee type code to a localized fee type string;
* `fee_subtype` - convert fee subtype code (depending on fee type code) to a localized fee subtype string

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

## And some details:

### Adding validator errors

To handle the validator error we're using `i18next`'s [context][context] feature.
Consider an example: you're adding a validation rule to your component

```javascript
// IMPORTANT: form mixin will handle for you most of the work for linking
// vuelidate to proper i18n messages
import FormMixin from '@/vue/mixins/form.mixin'

export default {
  validations: {
    // Don't forget to nest the validation rules in the form object, if your
    // fields are also nested there
    form: {
      email: { required, email, max10: maxLength(10) }
    }
  },
  mixins: [FormMixin]
}
```

You'll simply need to add a `validation.field-error` field to the i18n list
with the context === name of your validator:

```json
{
  "validations": {
    "field-error_required": "Something should be here",
    "field-error_email": "This should be a valid email",
    "field-error_max10": "Only 10 symbols please!"
  }
}
```

And now the `errorMessage` of the `FormMixin` will know where to find the message
when it decides the field is invalid.

> NOTE: if the validator rule is camelCased in your component, the i18next context
should be camelCased too:

```
export default {
  validations: {
    myField: { myAwesomeValidationRule }
  }
}
```

```json
{
  "validations": {
    "field-error_myAwesomeValidationRule": "Your message here"
  }
}
```

[i18next]: https://www.i18next.com
[context]: https://www.i18next.com/translation-function/context
