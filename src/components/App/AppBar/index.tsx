import styled from "styled-components";
import { Flex } from "~/components/common/Flex";
import { Text } from "~/components/common/Text";
import { SearchBar } from "~/components/SearchBar";
import { Stats } from "~/components/Stats";
import { colors } from "~/utils/colors";
import { useAppStore } from "~/stores/useAppStore";
import { media } from "~/utils/media";

const Header = styled(Flex).attrs({
  align: "center",
  direction: "row",
  grow: 1,
  justify: "space-between",
  p: 20,
})`
  height: 60px;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  pointer-events: none;
  transition: opacity 1s;
`;

const TitleWrapper = styled.div`
  ${media.smallOnly`
  display: none;
`}
`;

const StatsWrapper = styled.div`
  left: 25px;
  position: absolute;
  top: 75px;
`;

const SearchBarWrapper = styled.div`
  width: 60%;

  ${media.smallOnly`
    width: 100%;
  `}
`;

const BudgetExplainer = styled(Flex).attrs({
  direction: "row",
})`
  width: 25%;
  position: absolute;
  top: 220px;
  left: 25px;
  border: 1px solid ${colors.primaryBlueBorder};
  border-radius: 4px;
  padding: 1%;
  pointer-events: auto;
  z-index: 30;
`;

const CloseButton = styled(Flex)`
  color: ${colors.mainBottomIcons};
  cursor: pointer;
`;

type Props = {
  isEnabling: boolean;
  setEnabling: (value: boolean) => void;
};

export const AppBar = ({ isEnabling, setEnabling }: Props) => {
  const sidebarIsOpen = useAppStore((s) => s.sidebarIsOpen);

  if (sidebarIsOpen) {
    return null;
  }

  return (
    <Header>
      <TitleWrapper>
        <Text color="white" kind="bigHeadingBold">
          Second
        </Text>
        <Text color="white" kind="bigHeading">
          Brain
        </Text>
      </TitleWrapper>

      <StatsWrapper>
        <Stats />
      </StatsWrapper>

      {isEnabling && (
        <BudgetExplainer>
          <Text color="white" kind="regularBold">
            Each search of the graph costs 10 sats. Please enter a budget to buy
            an LSAT which will allow you to search up until your budget runs
            out. You will be able to set a new budget when that happens.
          </Text>
          <CloseButton
            onClick={() => {
              setEnabling(false);
            }}
          >
            <span className="material-icons" style={{ fontSize: 15 }}>
              close
            </span>
          </CloseButton>
        </BudgetExplainer>
      )}

      <SearchBarWrapper>
        <SearchBar />
      </SearchBarWrapper>

      <div />
    </Header>
  );
};
