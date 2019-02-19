import { CreateWithdrawRequestOp } from './create-withdrawal-request'

describe('CreateWithdrawRequestOp', () => {
  it('properly parses the record', () => {
    const record = {
      amount: '10.223000',
      fee: {
        fixed: '1.001200',
        calculatedPercent: '0.201000',
      },
      externalDetails: {
        fizz: 'buzz',
      },
      balance: {
        id: 'BA3HE33RGIQNQ6G5ED4LA25M4PZKDW26WBPVL3X3QUS3JNEQAV7D3YOA',
        type: 'balances',
      },
    }

    const result = new CreateWithdrawRequestOp(record)

    expect(result.externalDetails).to.have
      .property('fizz')
      .equal('buzz')
  })
})
