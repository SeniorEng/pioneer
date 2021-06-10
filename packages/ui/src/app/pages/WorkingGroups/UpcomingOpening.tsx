import React, { memo, useRef } from 'react'
import { useParams } from 'react-router-dom'

import { AppPage } from '@/app/components/AppPage'
import { BadgesRow, BadgeStatus } from '@/common/components/BadgeStatus'
import { BlockTime } from '@/common/components/BlockTime'
import { ButtonGhost, ButtonsGroup } from '@/common/components/buttons/Buttons'
import { BellIcon } from '@/common/components/icons/BellIcon'
import { Loading } from '@/common/components/Loading'
import { MarkdownPreview } from '@/common/components/MarkdownPreview'
import { ContentWithSidepanel, MainPanel, PageFooter, RowGapBlock } from '@/common/components/page/PageContent'
import { PageHeader } from '@/common/components/page/PageHeader'
import { PageTitle } from '@/common/components/page/PageTitle'
import { PreviousPage } from '@/common/components/page/PreviousPage'
import { SidePanel } from '@/common/components/page/SidePanel'
import { DurationStatistics, Statistics, TokenValueStat } from '@/common/components/statistics'
import { NumericValueStat } from '@/common/components/statistics/NumericValueStat'
import { ApplicationStatusWrapper } from '@/working-groups/components/ApplicationStatusWrapper'
import { OpeningIcon } from '@/working-groups/components/OpeningIcon'
import { useUpcomingOpening } from '@/working-groups/hooks/useUpcomingOpening'

export const UpcomingOpening = () => {
  const { id } = useParams<{ id: string }>()
  const { isLoading, opening } = useUpcomingOpening(id)
  const sideNeighborRef = useRef<HTMLDivElement>(null)

  if (isLoading || !opening) {
    return (
      <AppPage lastBreadcrumb={id} rowGap="s">
        <RowGapBlock gap={24}>
          <ContentWithSidepanel>
            <Loading />
          </ContentWithSidepanel>
        </RowGapBlock>
      </AppPage>
    )
  }

  const ApplicationStatus = memo(() => (
    <ApplicationStatusWrapper>
      <OpeningIcon />
      <>
        <h4>The opening hasn't started yet</h4>
        <p>Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.</p>
      </>
    </ApplicationStatusWrapper>
  ))

  return (
    <AppPage lastBreadcrumb={opening.title} rowGap="s">
      <PageHeader>
        <PreviousPage>
          <PageTitle>{opening.title}</PageTitle>
        </PreviousPage>
        <ButtonsGroup>
          <ButtonGhost size="medium">
            <BellIcon />
            Notify me when it’s open
          </ButtonGhost>
        </ButtonsGroup>
      </PageHeader>
      <RowGapBlock gap={24}>
        <BadgesRow>
          <BadgeStatus inverted size="l" separated>
            {opening.groupName}
          </BadgeStatus>
          <BadgeStatus inverted size="l" separated>
            Upcoming
          </BadgeStatus>
        </BadgesRow>
        <Statistics>
          <TokenValueStat title="Current budget" tooltipText="Lorem ipsum..." value={opening.budget} />
          <DurationStatistics title="Opening Expected duration" value={opening.expectedEnding} />
          <TokenValueStat title="Reward per 3600 blocks" value={opening.reward.payout} />
          <NumericValueStat title="Hiring limit" value={opening.hiringLimit} />
        </Statistics>
        <ContentWithSidepanel>
          <MainPanel ref={sideNeighborRef}>
            <MarkdownPreview markdown={opening.description} />
          </MainPanel>
          <SidePanel neighbor={sideNeighborRef}>
            <ApplicationStatus />
          </SidePanel>
        </ContentWithSidepanel>
      </RowGapBlock>
      <PageFooter>
        <BlockTime block={opening.createdAtBlock} layout="row" dateLabel="Hired" />
      </PageFooter>
    </AppPage>
  )
}