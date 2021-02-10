import BN from 'bn.js'
import { DeriveBalancesAll } from '@polkadot/api-derive/types'
import { useApi } from './useApi'
import { useObservable } from './useObservable'
import { Account } from './types'

export interface UseBalance {
  total: BN
  locked: BN
  recoverable: BN
  transferable: BN
}

export function toBalances(balances: DeriveBalancesAll): UseBalance {
  const { lockedBalance, availableBalance } = balances

  return {
    total: availableBalance.add(lockedBalance),
    transferable: availableBalance,
    locked: lockedBalance,
    recoverable: new BN(0),
  }
}

export function useBalance(account: Account | undefined): UseBalance | null {
  const { api } = useApi()
  const balances = useObservable(account && api?.derive.balances.all(account?.address), [api, account])

  if (balances === undefined) {
    return null
  }

  return toBalances(balances)
}