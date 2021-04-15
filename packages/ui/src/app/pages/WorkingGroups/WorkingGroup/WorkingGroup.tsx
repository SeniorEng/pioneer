import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { PageHeader } from '../../../../common/components/page/PageHeader'
import { PageTitle } from '../../../../common/components/page/PageTitle'
import { PreviousPage } from '../../../../common/components/page/PreviousPage'
import { Tabs } from '../../../../common/components/Tabs'
import { useWorkingGroup } from '../../../../working-groups/hooks/useWorkingGroup'
import { AppPage } from '../../../components/AppPage'
import { AboutTab } from '../components/AboutTab'

import { HistoryTab } from './HistoryTab'
import { OpeningsTab } from './OpeningsTab'

type Tab = 'OPENINGS' | 'ABOUT' | 'HISTORY'

export function WorkingGroup() {
  const [currentTab, setCurrentTab] = useState<Tab>('OPENINGS')
  const { id } = useParams<{ id: string }>()
  const group = useWorkingGroup(id)

  const crumbs = [
    { href: '#', text: 'Working Groups' },
    { href: '#', text: 'Working Groups' },
    { href: '#', text: group?.name ?? 'Group' },
  ]

  const tabs = [
    { title: 'Openings', active: currentTab === 'OPENINGS', onClick: () => setCurrentTab('OPENINGS') },
    { title: 'About', active: currentTab === 'ABOUT', onClick: () => setCurrentTab('ABOUT') },
    { title: 'History', active: currentTab === 'HISTORY', onClick: () => setCurrentTab('HISTORY') },
  ]

  return (
    <AppPage crumbs={crumbs}>
      <PageHeader>
        <PreviousPage>
          <PageTitle>{group?.name}</PageTitle>
        </PreviousPage>
        <Tabs tabs={tabs} />
      </PageHeader>
      {currentTab === 'OPENINGS' && <OpeningsTab workingGroup={group} />}
      {currentTab === 'ABOUT' && <AboutTab />}
      {currentTab === 'HISTORY' && <HistoryTab />}
    </AppPage>
  )
}