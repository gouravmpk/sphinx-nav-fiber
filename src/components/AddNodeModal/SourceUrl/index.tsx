import { FC, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import styled from 'styled-components'
import { Flex } from '~/components/common/Flex'
import { colors } from '~/utils/colors'
import { TagInput } from '../TagInput'
import { TextArea } from '../TextArea'
import { TextInput } from '../TextInput'
import { requiredRule } from '../index'

type Props = {
  startTime?: string
  latitude?: string
  longitude?: string
  setValue?: (field: string, value: boolean) => void
}

const tagRule = {
  required: {
    message: 'You need to enter at least 1 topic tag to submit a node.',
    value: true,
  },
}

const timeRegex = /^\d{2}:\d{2}:\d{2}$/
const locationRegex = /^-?\d{0,2}(\.\d{0,7})?$/

const twitterOrYoutubeRegexOrMp3 =
  /^(?:(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)[\w-]{11}(?:\S*)?|(?:https?:\/\/)?(?:www\.)?twitter\.com\/i\/spaces\/\d+.*$|.+\.mp3)$/i

export const SourceUrl: FC<Props> = ({ setValue, startTime, latitude, longitude }) => {
  const [enableTimestamps, setEnableTimestamps] = useState(false)
  const [enableLocation, setEnableLocation] = useState(false)

  const handleTimestamps = () => {
    if (setValue) {
      setValue('withTimeStamps', !enableTimestamps)
    }

    setEnableTimestamps(!enableTimestamps)
  }

  const showLocation = () => {
    if (setValue) {
      setValue('withLocation', !enableTimestamps)
    }

    setEnableLocation(!enableLocation)
  }

  return (
    <>
      <Flex>
        <TextInput
          id="add-node-link"
          label="Link"
          message="Paste a valid YouTube or Twitter Space link here."
          name="link"
          placeholder="Paste your link here..."
          rules={{
            ...requiredRule,
            pattern: {
              message: 'You must enter a valid YouTube, Twitter Space or mp3 link.',
              value: twitterOrYoutubeRegexOrMp3,
            },
          }}
        />
        <Flex direction="row" pt={12}>
          <CheckBoxWrapper>
            Add timestamps
            <button className="checkbox" id="add-node-timestamps-checkbox" onClick={handleTimestamps} type="button">
              {enableTimestamps && <FaCheck color={colors.lightBlue500} />}
            </button>
          </CheckBoxWrapper>
        </Flex>

        {enableTimestamps && (
          <>
            <Flex direction="row" pt={12}>
              <Flex basis="50%" pr={16}>
                <TextInput
                  id="add-node-start-time"
                  label="Start Time"
                  mask="99:99:99"
                  maskPlaceholder="_"
                  message="Enter start and end timestamps which will encompass the segment of video or audio you want to submit. [hh:mm:ss]"
                  name="startTime"
                  placeholder="00:00:00"
                  rules={{
                    ...requiredRule,
                    pattern: {
                      message: 'Timestamp must be in the format hh:mm:ss',
                      value: timeRegex,
                    },
                  }}
                  showMask
                />
              </Flex>

              <Flex basis="50%" pl={16}>
                <TextInput
                  id="add-node-end-time"
                  label="End Time"
                  mask="99:99:99"
                  maskPlaceholder="_"
                  message="Enter start and end timestamps which will encompass the segment of video or audio you want to submit. [hh:mm:ss]"
                  name="endTime"
                  placeholder="00:00:00"
                  rules={{
                    ...requiredRule,
                    pattern: {
                      message: 'Timestamp must be in the format hh:mm:ss',
                      value: timeRegex,
                    },
                    validate: {
                      endTime: (value) =>
                        value > (startTime || '00:00:00') || 'End time should be greater than start time',
                    },
                  }}
                  showMask
                />
              </Flex>
            </Flex>

            <Flex pt={12}>
              <TextArea
                id="add-node-description"
                label="Clip Description"
                maxLength={100}
                message="Enter a short description of your audio/video segment. Think of this as the title of your node. [max 100 characters]"
                name="description"
                rules={requiredRule}
              />
            </Flex>

            <Flex pt={12}>
              <TagInput
                id="add-node-tags"
                label="Tags"
                maxLength={50}
                message="Enter some topic tags that capture the main ideas of your segment. Be specific! Generic tags aren't useful for anyone. Think, 'What term(s) would someone search to find my node? [max: 15, max characters per tag: 50]"
                rules={tagRule}
              />
            </Flex>
          </>
        )}

        <Flex direction="row" pt={12}>
          <CheckBoxWrapper>
            Add location
            <button className="checkbox" id="add-node-location-checkbox" onClick={showLocation} type="button">
              {enableLocation && <FaCheck color={colors.lightBlue500} />}
            </button>
          </CheckBoxWrapper>
        </Flex>
      </Flex>

      {enableLocation && (
        <>
          <Flex direction="row" pt={12}>
            <Flex basis="50%" pr={16}>
              <TextInput
                id="add-node-latitude"
                label="Latitude"
                mask="99.999999"
                maskPlaceholder="_"
                message="Enter latitude coordinates"
                name="latitude"
                placeholder="Enter latitude (e.g., 45.7811111°)"
                rules={{
                  ...requiredRule,
                  pattern: {
                    message: 'Incorrect latitude format',
                    value: locationRegex,
                  },
                  validate: {
                    latitude: (value) => (!!longitude && !!value) || 'Both latitude and longitude should be set',
                  },
                }}
                showMask
              />
            </Flex>

            <Flex basis="50%" pl={16}>
              <TextInput
                id="add-node-location-longitude"
                label="Longitude"
                mask="99.9999999"
                maskPlaceholder="_"
                message="Enter longitude coordinates"
                name="longitude"
                placeholder="Enter longitude (e.g., 108.5038888°)"
                rules={{
                  ...requiredRule,
                  pattern: {
                    message: 'Incorrect longitude format',
                    value: locationRegex,
                  },
                  validate: {
                    longitude: (value) => (!!latitude && !!value) || 'Both latitude and longitude should be set',
                  },
                }}
                showMask
              />
            </Flex>
          </Flex>
        </>
      )}
    </>
  )
}

const CheckBoxWrapper = styled.div`
  color: ${colors.lightGray};
  font-size: 14px;
  font-weight: 600;
  display: flex;

  .checkbox {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 2px solid ${colors.lightBlue400};
    margin-left: 16px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: transparent;
    padding: 0;
  }
`
