import { ClipLoader } from "react-spinners";
import styled, { css } from "styled-components";
import { Booster } from "~/components/Booster";
import { Flex } from "~/components/common/Flex";
import { Text } from "~/components/common/Text";
import { useDataStore } from "~/stores/useDataStore";
import { NodeExtended } from "~/types";
import { ColorName, colors } from "~/utils/colors";
import { formatTimestamp } from "~/utils/formatTimestamp";

const Wrapper = styled(Flex).attrs<{ isSelected?: boolean }>(
  ({ isSelected }) => ({
    background: isSelected ? "lightBlue100" : "white",
    direction: "row",
  })
)<{ isSelected?: boolean }>`
  cursor: pointer;

  ${({ isSelected }) =>
    !isSelected &&
    css`
      &:hover {
        background: #f1f1f1;
      }
    `}
`;

type Props = {
  timestamp: NodeExtended;
  onClick?: () => void;
};

export const Timestamp = ({ onClick, timestamp }: Props) => {
  const selectedTimestamp = useDataStore((s) => s.selectedTimestamp);
  const isTimestampLoaded = useDataStore((s) => s.isTimestampLoaded);

  const isSelected = !!(
    selectedTimestamp && selectedTimestamp.timestamp === timestamp.timestamp
  );

  const color: ColorName = isSelected ? "lightBlue500" : "gray500";

  //   const selectedStyle = isSelected
  //     ? {
  //         fontWeight: 500,
  //         background: "#cde0ff4d",
  //         color: "#5D8FDD !important",
  //       }
  //     : {
  //         fontWeight: 300,
  //         background: "#fff",
  //       };

  //   const errorStyle = isError
  //     ? {
  //         color: "red",
  //       }
  //     : {};

  return (
    <Wrapper isSelected={isSelected} onClick={onClick} px={20} py={12}>
      <Flex direction="row" px={20}>
        {isSelected && !isTimestampLoaded ? (
          <ClipLoader color={colors[color]} loading size={14} />
        ) : (
          <span
            className="material-icons"
            style={{
              color: colors[color],
              fontSize: 18,
            }}
          >
            {isSelected ? "play_arrow" : "access_time"}
            {/* {isError ? "error" : isSelected ? "play_arrow" : "access_time"} */}
          </span>
        )}
      </Flex>

      <div>
        {timestamp.timestamp && (
          <Text color={color} kind={isSelected ? "mediumBold" : "medium"}>
            {formatTimestamp(timestamp.timestamp)}
          </Text>
        )}

        {!!timestamp.boost && (
          <Flex pl={10}>
            <Booster count={timestamp.boost} readOnly />
          </Flex>
        )}

        <Flex pt={4}>
          <Text color={color} kind={isSelected ? "regularBold" : "regular"}>
            {timestamp.description}
          </Text>
        </Flex>
      </div>
    </Wrapper>
  );
};
