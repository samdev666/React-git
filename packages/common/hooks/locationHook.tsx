import { useLocation } from "react-router-dom";
import { TabsInterface } from "../models";

interface Entity<T> {
  activeTabName: string;
  pathname: string;
}

/* eslint-disable import/prefer-default-export */
export const useActiveTabLocation = <T,>(
  tabs: TabsInterface[]
): Entity<T | undefined> => {
  const { pathname } = useLocation();

  console.log(tabs, "tabs", pathname);

  const activeTabName: any = tabs?.length ? tabs?.find(
    (tab: TabsInterface) => tab?.route === pathname
  )?.label : '';

  return { activeTabName, pathname };
};
