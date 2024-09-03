import React from "react";
import {
  StyledChevronRightIcon,
  StyledMultiTabButton,
  StyledMultiTabMainContainer,
} from "./styles";
import { Id, TabsInterface } from "@wizehub/common/models";
import { useDispatch } from "react-redux";

interface Props {
  tabs: TabsInterface[];
  activeTabName?: string;
  activeTab?: Id;
  setActiveTab?: React.Dispatch<React.SetStateAction<Id>>;
  push?: any;
  orientation?: "horizontal" | "vertical";
  noBackgroundColor?: boolean;
}

const MultiTabComponent: React.FC<Props> = ({
  tabs,
  activeTab,
  setActiveTab,
  activeTabName,
  push,
  noBackgroundColor = false,
  orientation = "horizontal",
}) => {
  const reduxDispatch = useDispatch();
  return (
    <StyledMultiTabMainContainer
      orientation={orientation}
      noBackgroundColor={noBackgroundColor}
    >
      {tabs?.map((tab) => (
        <StyledMultiTabButton
          onClick={() => {
            if (activeTab) {
              setActiveTab(tab?.id);
            } else {
              reduxDispatch(push(tab?.route));
            }
          }}
          active={tab?.label === activeTabName || activeTab === tab?.id}
          key={tab?.id}
          orientation={orientation}
        >
          {tab?.label}
          {orientation === "vertical" &&
            (tab?.label === activeTabName || activeTab === tab?.id) && (
              <StyledChevronRightIcon />
            )}
        </StyledMultiTabButton>
      ))}
    </StyledMultiTabMainContainer>
  );
};

export default MultiTabComponent;
