import { CreateAMLAlertRequestOp } from './create-aml-alert-request'

describe('CreateAMLAlertRequestOp', () => {
  it('properly parses the record', () => {
    const record = {
      amount: '12.250000',
      creatorDetails: 'You did something bad',
      balance: {
        id: 'BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FOJ',
        type: 'balances',
      },
    }

    const result = new CreateAMLAlertRequestOp(record)

    expect(result.creatorDetails).to.equal('You did something bad')
  })
})
