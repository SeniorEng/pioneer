import { Meta, Story } from '@storybook/react'
import BN from 'bn.js'
import React from 'react'

import { RowGapBlock } from '@/common/components/page/PageContent'

import { ProposalProperties } from './ProposalProperties'

export default {
  title: 'Proposals/ProposalPreview/ProposalProperties',
  component: ProposalProperties,
} as Meta

type Props = Parameters<typeof ProposalProperties>[0]

const Template: Story<Props> = (args) => (
  <RowGapBlock gap={24}>
    <ProposalProperties {...args} />
  </RowGapBlock>
)

export const CreateLeadOpening = Template.bind({})
CreateLeadOpening.args = {
  details: {
    type: 'createWorkingGroupLeadOpening',
    stakeAmount: new BN(10000),
    unstakingPeriod: new BN(14400),
    rewardPerBlock: new BN(12),
    group: {
      id: 'storageWorkingGroup',
      name: 'storage',
    },
    openingDescription:
      '# itaque numquam magni et velit\n\nSunt numquam et molestiae alias quia aut sed. Corporis quia non qui illum iure facilis. Quia quod ut omnis id aut omnis exercitationem neque recusandae. Animi nesciunt consequatur. Qui velit voluptatem unde numquam et dolore impedit eveniet saepe.\n\n## dolores iste eos quidem\n\nPlaceat eaque esse aut qui et autem quo ab. Ipsa facere dolorem quasi amet. Quae corporis omnis. Corporis vel nihil placeat.',
  },
}

export const FundingRequest = Template.bind({})
FundingRequest.args = {
  details: {
    type: 'fundingRequest',
    destinations: [
      {
        account: '5GBVQJZzv2nrRVtjgTg4JwCwbEfKeueiKqQ5ysFxLfiQPRiY',
        amount: 30000,
      },
      {
        account: '5JwCwbEfKeueiKqQ5ysFxLfiQPRiYGBVQJZzv2nrRVtjgTg4',
        amount: 140000,
      },
    ],
  },
}