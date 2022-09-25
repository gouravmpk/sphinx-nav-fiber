import styled from "styled-components";
import { Avatar } from "~/components/common/Avatar";
import { Flex } from "~/components/common/Flex";
import { Text } from "~/components/common/Text";
import { useDataStore } from "~/stores/useDataStore";

const Wrapper = styled(Flex)`
  position: absolute;
  pointer-events: none;
  background: #ffffff;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.1);
  color: #000;
  z-index: 100;
  transition: opacity 0.6s;

  top: 20px;
  right: 20px;
  width: 300px;
`;

const Description = styled(Text)`
  font-style: italic;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
`;

export const Tooltip = () => {
  const node = useDataStore((s) => s.hoveredNode);

  if (!node) {
    return null;
  }

  const {
    node_type: nodeType,
    image_url: imageUrl,
    show_title: showTitle,
    episode_title: episodeTitle,
    description,
    guests,
    text,
    timestamp,
  } = node;

  return (
    <Wrapper borderRadius={8} px={24} py={16}>
      <Flex align="center" pb={12}>
        <Text>{nodeType?.toUpperCase()}</Text>
      </Flex>

      <Flex direction="row">
        <Flex pr={12}>
          <Avatar src={imageUrl || ""} />
        </Flex>

        <div>
          <Text color="gray400" kind="tiny">
            {showTitle}
          </Text>

          <Flex pt={4}>
            <Text as="div" kind="regularBold">
              {episodeTitle}
            </Text>
          </Flex>

          <Text color="gray400" kind="tiny">
            {timestamp}
          </Text>

          {guests?.length && (
            <Flex pt={12}>
              <Text color="gray300">Guests</Text>
              <Flex pt={4}>
                <Text color="gray400" kind="tiny">
                  {guests.join(", ")}
                </Text>
              </Flex>
            </Flex>
          )}

          <Flex pt={12}>
            <Text color="gray300">{description}</Text>
            <Flex pt={4}>
              <Description color="gray300" kind="tiny">
                {text}
              </Description>
            </Flex>
          </Flex>
        </div>
      </Flex>
    </Wrapper>
  );
};
