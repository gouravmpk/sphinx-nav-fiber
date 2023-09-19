import { PropsWithChildren } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { Flex } from '~/components/common/Flex'
import { AvailableModals, useModal } from '~/stores/useModalStore'
import { ColorName, colors } from '~/utils/colors'
import ClearIcon from '../Icons/ClearIcon'

const scaleAnimation = keyframes`
  0% {
    transform: scale(0.8);
  }

  100% {
    transform: scale(1);
  }
`

const getModalKindStyles = ({ kind = 'regular' }: Pick<Props, 'kind'>) => {
  switch (kind) {
    case 'small':
      return css`
        width: 300px;
        height: 502px;
      `
    case 'large':
      return css`
        width: 709px;
      `
    default:
      return css`
        width: 520px;
      `
  }
}

const ModalContainer = styled(Flex)<Pick<Props, 'kind'>>`
  z-index: 2000;
  margin: 0 auto;
  overflow: visible;
  animation: ${scaleAnimation} 0.2s ease-in-out;
  position: relative;
  max-width: 100%;
  overflow: hidden;
  ${getModalKindStyles}
`

const fadeAnimation = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

const Bg = styled(Flex)<{ hideBg?: boolean }>`
  position: fixed;
  width: 100%;
  height: 100vh;
  transition: all;
  z-index: 1500;
  animation: ${fadeAnimation} 0.2s ease-in-out;
  padding: 1rem;

  ${({ hideBg }) =>
    !hideBg &&
    css`
      background-color: ${colors.modalWhiteOverlayBg};
    `}
`

const CloseButton = styled(Flex)`
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 20px;
  color: ${colors.GRAY6};
  cursor: pointer;
  z-index: 1;
`

type ModalKind = 'small' | 'regular' | 'large'

type Props = PropsWithChildren<{
  id: AvailableModals
  background?: ColorName
  hideBg?: boolean
  kind?: ModalKind
  preventOutsideClose?: boolean
  noWrap?: boolean
  onClose?: () => void
}>

export const BaseModal = ({
  background = 'modalBg',
  children,
  id,
  hideBg,
  kind,
  preventOutsideClose,
  noWrap = false,
  onClose,
}: Props) => {
  const { visible, close } = useModal(id)

  if (!visible) {
    return null
  }

  return (
    <>
      <Bg
        align="center"
        hideBg={hideBg}
        justify="center"
        onClick={(e) => {
          if (!preventOutsideClose) {
            e.stopPropagation()

            close()
          }
        }}
      >
        <ModalContainer
          background={background}
          borderRadius={9}
          id={id}
          kind={kind}
          onClick={(e) => {
            e.stopPropagation()
          }}
          px={noWrap ? 0 : 20}
          py={noWrap ? 0 : 20}
        >
          {onClose && (
            <CloseButton onClick={onClose}>
              <ClearIcon />
            </CloseButton>
          )}
          {children}
        </ModalContainer>
      </Bg>
    </>
  )
}
