import { groupBy, values } from 'lodash'
import { NodeExtended } from '~/types'
import { videoTimetoSeconds } from '~/utils/videoTimetoSeconds'

export const getNodesBelongingToShow = (selectedNode: NodeExtended, allNodes: NodeExtended[]) =>
  allNodes.filter(
    (node) =>
      node.show_title &&
      node.link &&
      node.show_title === selectedNode.show_title &&
      node.episode_title === selectedNode.episode_title,
  )

export const getSelectedNodeTimestamps = (nodes: NodeExtended[], selectedNode: NodeExtended | null) => {
  if (!selectedNode) {
    return null
  }

  const selectedNodeShowEpisodes = getNodesBelongingToShow(selectedNode, nodes)

  const groupedTimestamps = groupBy(selectedNodeShowEpisodes, (n) => n.timestamp)

  const timestamps = values(groupedTimestamps).reduce((acc, items) => {
    if (items[0]) {
      acc.push(items[0])
    }

    return acc
  }, [])

  timestamps.sort((a, b) => {
    const aTime = videoTimetoSeconds(a.timestamp).start
    const bTime = videoTimetoSeconds(b.timestamp).start

    return aTime - bTime
  })

  return timestamps
}
