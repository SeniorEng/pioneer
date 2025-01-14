import React, { ReactNode, useCallback, useEffect, useState } from 'react'

import { DEFAULT_NETWORK, NetworkEndpoints, pickEndpoints } from '@/app/config'
import { Loading } from '@/common/components/Loading'
import { useLocalStorage } from '@/common/hooks/useLocalStorage'
import { useNetwork } from '@/common/hooks/useNetwork'
import { isDefined, objectEquals } from '@/common/utils'

import { NetworkEndpointsContext } from './context'

interface Props {
  children: ReactNode
}

export const NetworkEndpointsProvider = ({ children }: Props) => {
  const { network, setNetwork } = useNetwork()
  const [endpoints, setEndpoints] = useState<NetworkEndpoints>()
  const [autoConfEndpoints, storeAutoConfEndpoints] = useLocalStorage<NetworkEndpoints>('auto_network_config')
  const [isLoading, setIsLoading] = useState(false)

  const updateNetworkConfig = useCallback(
    async (configEndpoint: string) => {
      setIsLoading(true)
      let config
      try {
        config = await (await fetch(configEndpoint)).json()
      } catch (err) {
        setIsLoading(false)
        const errMsg = `Failed to fetch the network configuration from ${configEndpoint}.`
        throw new Error(`${errMsg}`)
      }

      const newAutoConfEndpoints = {
        queryNodeEndpointSubscription: config['graphql_server_websocket'],
        queryNodeEndpoint: config['graphql_server'],
        membershipFaucetEndpoint: config['member_faucet'],
        nodeRpcEndpoint: config['websocket_rpc'],
      }

      if (!endpointsAreDefined(newAutoConfEndpoints)) {
        setIsLoading(false)
        throw new Error('fetched config missing endpoints')
      }

      const shouldUpdateConfig = !objectEquals<Partial<NetworkEndpoints>>(newAutoConfEndpoints)(autoConfEndpoints ?? {})
      const shouldUpdateNetwork = network !== 'auto-conf'

      if (shouldUpdateConfig) {
        storeAutoConfEndpoints(newAutoConfEndpoints)
      }
      if (shouldUpdateNetwork) {
        setNetwork('auto-conf')
      }
      if (shouldUpdateConfig || shouldUpdateNetwork) {
        return window.location.reload()
      }
      setIsLoading(false)
    },
    [network]
  )

  useEffect(() => {
    const endpoints = pickEndpoints(network)

    if (endpointsAreDefined(endpoints)) {
      setEndpoints(endpoints)
    } else if (network === 'auto-conf' && endpointsAreDefined(autoConfEndpoints)) {
      setEndpoints(autoConfEndpoints)
    } else {
      setNetwork(DEFAULT_NETWORK.type)
      setEndpoints(DEFAULT_NETWORK.endpoints)
    }
  }, [network])

  if (!endpointsAreDefined(endpoints) || isLoading) {
    return <Loading text="Loading network endpoints" />
  }

  return (
    <NetworkEndpointsContext.Provider value={[endpoints, updateNetworkConfig]}>
      {children}
    </NetworkEndpointsContext.Provider>
  )
}

export const endpointsAreDefined = (endpoints: Partial<NetworkEndpoints> = {}): endpoints is NetworkEndpoints =>
  Object.values(endpoints).length === 4 && Object.values(endpoints).every(isDefined)
