import { PaymentOp } from './payment'

describe('PaymentOp', () => {
  it('properly parses the record', () => {
    const record = {
      amount: '99.850653',
      sourceFee: {
        fixed: '1.001200',
        calculatedPercent: '0.201000',
      },
      destinationFee: {
        fixed: '1.001200',
        calculatedPercent: '0.201000',
      },
      sourcePayForDestination: true,
      subject: 'Thanks for the help!',
      reference: '8u12Nmxweqi9k',
      accountFrom: {
        id: 'GBNNNBLBHNEGOMLZ5T3A2VVHNQB7MBXU33YHLFGE7HTWTX23HFRL74WB',
        type: 'accounts',
      },
      accountTo: {
        id: 'GBLPOFIGESQI7LG4ILTYHOMYTA7FBLG6G76DMNGZJDJSIO7VM3Z4YZ2J',
        type: 'accounts',
      },
      balanceFrom: {
        id: 'BCQOBAIMVNNH7RHZTD4OVSRUX2W575VUK4RUYELRHDPXSXJ5TMS2BHAV',
        type: 'balances',
      },
      balanceTo: {
        id: 'BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FOJ',
        type: 'balances',
      },
      asset: {
        id: 'ETH',
        type: 'assets',
      },
    }

    const result = new PaymentOp(record)

    expect(result.sourceFixedFee).to.equal('1.001200')
    expect(result.sourceCalculatedPercentFee).to.equal('0.201000')
    expect(result.destinationFixedFee).to.equal('1.001200')
    expect(result.destinationCalculatedPercentFee).to.equal('0.201000')
    expect(result.sourcePayForDestination).to.equal(true)
    expect(result.subject).to.equal('Thanks for the help!')
    expect(result.reference).to.equal('8u12Nmxweqi9k')
  })
})
