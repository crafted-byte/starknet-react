import { useMutation } from '@tanstack/react-query'
import { ContractFactory, RawCalldata, number, Contract } from 'starknet'

/** Arguments for `useDeploy`. */
export interface UseDeployProps {
  /** The contract factory. */
  contractFactory?: ContractFactory
  /** Calldata passed to the constructor. */
  constructorCalldata?: RawCalldata
  /** Salt used when generating the address. */
  addressSalt?: number.BigNumberish
}

/** Value returned from `useDeploy`. */
export interface UseDeployResult {
  /** The deployed contract. */
  data?: Contract
  /** True if deploying. */
  loading: boolean
  /** Error while deploying. */
  error?: unknown
  /** Reset hook state. */
  reset: () => void
  /** Send deploy transaction. */
  deploy: () => Promise<Contract | undefined>
}

/**
 * Hook to deploy a StarkNet contract.
 *
 * @example
 * This example shows how to deploy a contract from the currently connected account.
 * ```ts
 * import { useAccount, useContractFactory, useDeploy } from '@starknet-react/core'
 *
 * function Component() {
 *   const { account } = useAccount()
 *   const { contractFactory } = useContractFactory({ compiledContract, providerOrAccount: account })
 *   const { deploy } = useDeploy({ contractFactory })
 *
 *   return (
 *     <button onClick={deploy}>Deploy contract</button>
 *   )
 * }
 * ```
 */
export function useDeploy({
  contractFactory,
  constructorCalldata,
  addressSalt,
}: UseDeployProps): UseDeployResult {
  const { data, isLoading, error, reset, mutateAsync } = useMutation(
    deployContract({ contractFactory, constructorCalldata, addressSalt })
  )

  return {
    data,
    loading: isLoading,
    error: error ?? undefined,
    reset,
    deploy: mutateAsync,
  }
}

function deployContract({ contractFactory, constructorCalldata, addressSalt }: UseDeployProps) {
  return async () => {
    if (contractFactory === undefined) {
      throw new Error('No contract factory defined')
    }
    return await contractFactory.deploy(constructorCalldata, addressSalt)
  }
}