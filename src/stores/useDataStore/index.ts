import create from 'zustand'
import { isChileGraph } from '~/constants'
import { getMockGraphData } from '~/mocks/getMockGraphData'
import { fetchGraphData } from '~/network/fetchGraphData'
import { GraphData, NodeExtended, NodeType, Sources } from '~/types'
import { saveSearchTerm } from '~/utils/relayHelper/index'

type DataStore = {
  scrollEventsDisabled: boolean
  categoryFilter: NodeType | null
  disableCameraRotation: boolean
  graphRadius: number | null
  data: GraphData | null
  isFetching: boolean
  isTimestampLoaded: boolean
  hoveredNode: NodeExtended | null
  selectedNode: NodeExtended | null
  selectedTimestamp: NodeExtended | null
  sources: Sources[] | null
  queuedSources: Sources[] | null
  sphinxModalIsOpen: boolean
  cameraFocusTrigger: boolean
  setScrollEventsDisabled: (scrollEventsDisabled: boolean) => void
  setCategoryFilter: (categoryFilter: NodeType | null) => void
  setDisableCameraRotation: (rotation: boolean) => void
  fetchData: (search?: string | null) => void
  setGraphRadius: (graphRadius?: number | null) => void
  setHoveredNode: (hoveredNode: NodeExtended | null) => void
  setSelectedNode: (selectedNode: NodeExtended | null) => void
  setSelectedTimestamp: (selectedTimestamp: NodeExtended | null) => void
  setSources: (sources: Sources[] | null) => void
  setQueuedSources: (sources: Sources[] | null) => void
  setSphinxModalOpen: (_: boolean) => void
  setCameraFocusTrigger: (_: boolean) => void
}

const defaultData: Omit<
  DataStore,
  | 'fetchData'
  | 'setCameraAnimation'
  | 'setScrollEventsDisabled'
  | 'setCategoryFilter'
  | 'setDisableCameraRotation'
  | 'setHoveredNode'
  | 'setSelectedNode'
  | 'setSelectedTimestamp'
  | 'setSphinxModalOpen'
  | 'setCameraFocusTrigger'
  | 'setSources'
  | 'setQueuedSources'
  | 'setGraphRadius'
> = {
  categoryFilter: null,
  data: null,
  scrollEventsDisabled: false,
  disableCameraRotation: false,
  graphRadius: isChileGraph ? 1600 : 3056, // calculated from initial load
  isFetching: false,
  isTimestampLoaded: false,
  queuedSources: null,
  hoveredNode: null,
  selectedNode: null,
  selectedTimestamp: null,
  sources: null,
  sphinxModalIsOpen: false,
  cameraFocusTrigger: false,
}

export const useDataStore = create<DataStore>((set, get) => ({
  ...defaultData,
  fetchData: async (search) => {
    if (get().isFetching) {
      return
    }

    set({ isFetching: true })

    if (search?.length) {
      set({ sphinxModalIsOpen: true })

      const data = await fetchGraphData(search)

      await saveSearchTerm(search)

      set({ data, isFetching: false, sphinxModalIsOpen: false })

      return
    }

    const mockGraphData = await getMockGraphData()

    set({ data: mockGraphData, isFetching: false })
  },
  setScrollEventsDisabled: (scrollEventsDisabled) => set({ scrollEventsDisabled }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setDisableCameraRotation: (rotation) => set({ disableCameraRotation: rotation }),
  setGraphRadius: (graphRadius) => set({ graphRadius }),
  setQueuedSources: (queuedSources) => set({ queuedSources }),
  setHoveredNode: (hoveredNode) => set({ hoveredNode }),
  setSelectedNode: (selectedNode) => set({ isTimestampLoaded: false, selectedNode }),
  setSelectedTimestamp: (selectedTimestamp) => set({ selectedTimestamp }),
  setSources: (sources) => set({ sources }),
  setSphinxModalOpen: (sphinxModalIsOpen) => set({ sphinxModalIsOpen }),
  setCameraFocusTrigger: (cameraFocusTrigger) => set({ cameraFocusTrigger }),
}))

export const useSelectedNode = () => useDataStore((s) => s.selectedNode)

export const setIsTimestampLoaded = (isTimestampLoaded: boolean) => useDataStore.setState({ isTimestampLoaded })
