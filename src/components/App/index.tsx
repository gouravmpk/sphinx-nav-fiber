import { Leva } from 'leva'
import { useCallback, useEffect } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import * as sphinx from 'sphinx-bridge-kevkevinpal'
import styled from 'styled-components'
import { AddNodeModal } from '~/components/AddNodeModal'
import { BudgetExplanationModal } from '~/components/BudgetExplanationModal'
import { DataRetriever } from '~/components/DataRetriever'
import { GlobalStyle } from '~/components/GlobalStyle'
import { Universe } from '~/components/Universe'
import { Flex } from '~/components/common/Flex'
import { isDevelopment, isE2E } from '~/constants'
import { getGraphDataPositions } from '~/network/fetchGraphData/const'
import { useAppStore } from '~/stores/useAppStore'
import { useDataStore } from '~/stores/useDataStore'
import { useModal } from '~/stores/useModalStore'
import { GraphData } from '~/types'
import { colors } from '~/utils/colors'
import { E2ETests } from '~/utils/tests'
import version from '~/utils/versionHelper'
import { Preloader } from '../Universe/Preloader'
import { AppBar } from './AppBar'
import { FooterMenu } from './FooterMenu'
import { AppProviders } from './Providers'
import { SecondarySideBar } from './SecondarySidebar'
import { SideBar } from './SideBar'
import { Toasts } from './Toasts'

const Wrapper = styled(Flex)`
  height: 100%;
  width: 100%;
  background-color: ${colors.black};
`

const Version = styled(Flex)`
  position: absolute;
  bottom: 8px;
  left: 8px;
  color: ${colors.white};
  font-size: 12px;
  opacity: 0.5;
`

export const App = () => {
  const { open } = useModal('budgetExplanation')

  const [setSidebarOpen, searchTerm, setCurrentSearch, hasBudgetExplanationModalBeSeen] = [
    useAppStore((s) => s.setSidebarOpen),
    useAppStore((s) => s.currentSearch),
    useAppStore((s) => s.setCurrentSearch),
    useAppStore((s) => s.hasBudgetExplanationModalBeSeen),
  ]

  const [data, setData, fetchData, graphStyle, setSphinxModalOpen] = [
    useDataStore((s) => s.data),
    useDataStore((s) => s.setData),
    useDataStore((s) => s.fetchData),
    useDataStore((s) => s.graphStyle),
    useDataStore((s) => s.setSphinxModalOpen),
  ]

  const runSearch = useCallback(async () => {
    if (searchTerm) {
      setSphinxModalOpen(true)

      // skipping this for end to end test because it requires a sphinx-relay to be connected
      if (!isE2E) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await sphinx.enable()
      }

      setSphinxModalOpen(false)
    }

    fetchData(searchTerm)
    setSidebarOpen(true)
  }, [fetchData, searchTerm, setSphinxModalOpen, setSidebarOpen])

  useEffect(() => {
    if (searchTerm) {
      if (!hasBudgetExplanationModalBeSeen) {
        open()

        return
      }
    }

    runSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, runSearch, hasBudgetExplanationModalBeSeen])

  const repositionGraphDataAfterStyleChange = () => {
    if (data) {
      const updatedData: GraphData = getGraphDataPositions(graphStyle, data.nodes)

      setData(updatedData)
    }
  }

  // switch graph style
  useEffect(() => {
    repositionGraphDataAfterStyleChange()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphStyle])

  return (
    <AppProviders>
      <GlobalStyle />

      <Leva hidden={!isDevelopment} />

      <Wrapper direction="row">
        <DataRetriever loader={<Preloader />}>
          <SideBar />

          <Universe />

          <SecondarySideBar />

          <AppBar />

          <FooterMenu />
          <Version>v{version}</Version>
        </DataRetriever>

        <AddNodeModal />

        <Toasts />

        <BudgetExplanationModal />
      </Wrapper>
      <E2ETests />
    </AppProviders>
  )
}
