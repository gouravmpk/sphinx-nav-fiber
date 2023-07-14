import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAppStore } from '~/stores/useAppStore'
import { colors } from '~/utils/colors'

type Props = {
  loading?: boolean
}

const Input = styled.input.attrs(() => ({
  autoCorrect: 'off',
}))<{ loading?: boolean }>`
  pointer-events: auto;
  height: 50px;
  padding: 0 20px;
  z-index: 2;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  color: #fff;
  background-color: ${colors.inputBg1};
  box-shadow: none;
  border: none;

  &:focus {
    outline: 1px solid ${colors.lightBlue100};
  }

  &:placeholder {
    color: ${colors.placeholderText};
  }

  ${({ loading }) =>
    loading &&
    css`
      background-image: url('https://i.gifer.com/ZZ5H.gif');
      background-size: 25px 25px;
      background-position: right center;
      background-position-x: 95%;
      background-repeat: no-repeat;
    `}
`

export const SearchBar = ({ loading }: Props) => {
  const [value, setValue] = useState('')

  const currentSearch = useAppStore((s) => s.currentSearch)
  const setCurrentSearch = useAppStore((s) => s.setCurrentSearch)

  useEffect(() => {
    setValue(currentSearch || '')
  }, [currentSearch])

  return (
    <Input
      disabled={loading}
      id="main-search"
      loading={loading}
      onKeyPress={(event) => {
        if (event.key === 'Enter') {
          setCurrentSearch(value)
        }
      }}
      onChange={(e) => setValue(e.target.value)}
      value={value}
      placeholder="Search (10 sats)"
      type="text"
    />
  )
}
