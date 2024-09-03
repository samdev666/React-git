import React from "react";
import { TabsInterface } from "@wizehub/common/models/baseEntities";
import { useDispatch } from "react-redux";
import {
  StyledActiveTab,
  StyledActiveTabText,
  StyledTabsContainer,
} from "./styles";

interface Props {
  tabs: TabsInterface[];
  activeTab?: any;
  setActiveTab?: (value: React.SetStateAction<any>) => void;
  activeTabName?: string;
  noMarginLeft?: boolean;
  isIconTab?: boolean;
  push?: any;
  noMarginRight?: boolean;
}

const CustomTabs: React.FC<Props> = ({
  tabs,
  activeTab,
  setActiveTab,
  activeTabName,
  push,
  noMarginLeft = false,
  isIconTab = false,
  noMarginRight = false,
}) => {
  const reduxDispatch = useDispatch();
  return (
    <StyledTabsContainer
      noMargingLeft={noMarginLeft}
      noMarginRight={noMarginRight}
    >
      {tabs?.map((tab: TabsInterface) => (
        <StyledActiveTab
          key={tab?.id}
          active={tab?.label === activeTabName || activeTab === tab?.id}
          onClick={() => {
            if (activeTab) {
              setActiveTab(tab?.id);
            } else {
              reduxDispatch(push(tab?.route));
            }
          }}
          isIconTab={isIconTab}
        >
          {isIconTab ? (
            tab?.label
          ) : (
            <StyledActiveTabText>{tab?.label}</StyledActiveTabText>
          )}
        </StyledActiveTab>
      ))}
    </StyledTabsContainer>
  );
};

export default CustomTabs;
