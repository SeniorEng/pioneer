import React, { ReactElement, useState } from 'react'
import { Account, BaseMember } from '../../common/types'
import { TransferDetailsModal } from './TransferDetailsModal'
import BN from 'bn.js'
import { SignTransferModal } from './SignTransferModal'
import { TransferSuccessModal } from './TransferSuccessModal'
import { TransferFailureModal } from './TransferFailureModal'

interface Props {
  onClose: () => void
  icon: ReactElement
  member?: BaseMember
}

type ModalState = 'PREPARE' | 'AUTHORIZE' | 'SUCCESS' | 'ERROR'

export function TransferInviteModal({ onClose, icon, member }: Props) {
  const [step, setStep] = useState<ModalState>('PREPARE')
  const [amount, setAmount] = useState<BN>(new BN(0))
  const [sourceMember, setSourceMember] = useState(member)
  const [targetMember, setTargetMember] = useState<BaseMember>()
  const [signer, setSigner] = useState<Account>()

  const onAccept = (amount: BN, from: BaseMember, to: BaseMember, signer: Account) => {
    setAmount(amount)
    setTargetMember(to)
    setSourceMember(from)
    setSigner(signer)
    setStep('AUTHORIZE')
  }

  const onDone = (result: boolean) => {
    setStep(result ? 'SUCCESS' : 'ERROR')
  }

  if (step === 'PREPARE' || !sourceMember || !targetMember || !signer) {
    return <TransferDetailsModal onClose={onClose} onAccept={onAccept} icon={icon} member={member} />
  }

  if (step === 'AUTHORIZE') {
    return (
      <SignTransferModal
        onClose={onClose}
        sourceMember={sourceMember}
        targetMember={targetMember}
        signer={signer}
        amount={amount}
        onDone={onDone}
      />
    )
  }

  if (step === 'SUCCESS') {
    return <TransferSuccessModal onClose={onClose} recipient={targetMember} amount={amount} />
  }

  return <TransferFailureModal onClose={onClose} />
}