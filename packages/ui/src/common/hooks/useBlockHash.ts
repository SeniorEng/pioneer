import { useApi } from '@/api/hooks/useApi'
import { useFirstObservableValue } from '@/common/hooks/useFirstObservableValue'

export function useBlockHash(num?: string) {
  const { api } = useApi()

  return useFirstObservableValue(() => api?.rpc.chain.getBlockHash(num), [api?.isConnected, num])?.toHex()
}
