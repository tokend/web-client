import { CreateIssuanceRequestOp } from './create-issuance-request'

describe('CreateIssuanceRequestOp', () => {
  it('properly parses the record', () => {
    const record = {
      fee: {
        fixed: '1.001200',
        calculatedPercent: '0.201000',
      },
      amount: '10.233000',
      reference: '1qwWbaXnmTu2we2we',
      allTasks: 2,
      externalDetails: {
        foo: 'bar',
      },
      asset: {
        id: 'BTC',
        type: 'assets',
      },
      request: {
        id: '21',
        type: 'requests',
      },
      receiverAccount: {
        id: 'GBNNNBLBHNEGOMLZ5T3A2VVHNQB7MBXU33YHLFGE7HTWTX23HFRL74WB',
        type: 'accounts',
      },
      receiverBalance: {
        id: 'BA3HE33RGIQNQ6G5ED4LA25M4PZKDW26WBPVL3X3QUS3JNEQAV7D3YOA',
        type: 'balances',
      },
    }

    const result = new CreateIssuanceRequestOp(record)

    expect(result.reference).to.equal('1qwWbaXnmTu2we2we')
  })
})
