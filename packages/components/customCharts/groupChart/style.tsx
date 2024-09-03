import styled from "styled-components";

export const ChartContainer = styled.div`
  width: 100%;
  height: auto;
  justify-content: center;
  align-items: center;
  position: relative;
`;
export const Content = styled.div`
    width: 100%;
    display: flex;
    height: 2rem;
    justify-content: space-between;
    align-items: center;
    padding: 2px;
   
`;
export const Text = styled.p`
    font-size: 20px;
    font-weight: 700;
`
export const IndicatorContainer = styled.div`
    width: auto;
    display: flex;
    padding-right: 7px;
`
export const IndicatorText = styled.p`
    font-size: 18px;
    font-weight: 500;
    color: gray;
`
export const Indicator= styled.div`
    display: flex;
    align-items: center;
    gap:0;

`
export const TooltipContainer = styled.div`
  background-color: #000;
  color: #fff;
  white-space: nowrap;
  padding: 10px;
  border-radius: 7px;
  position: relative; /* Ensure the parent has position relative */
  font-size: 14px; /* Adjust font size for better readability */
  max-width: 200px; /* Prevent too wide tooltips */
  text-align: center; /* Center align text for better appearance */
  z-index: 999; /* Ensure tooltip is on top of other elements */

  /* Adjustments for tooltip arrow */
  ::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translateX(-50%);
    border-width: 10px; /* Adjust border width */
    border-style: solid;
    border-color: #000 transparent transparent transparent; /* Tooltip arrow color */
  }
`;


export const TooltipText = styled.p`
   
`
export const RenderText = styled.div`
`