import React from "react";
import Card from "../card";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
import { Grid } from "@mui/material";
import {
  StyledCustomChartHeading,
  StyledCustomChartLegend,
  StyledFiberManualRecordOutlinedIcon,
} from "./styles";

interface Props {
  heading: string;
  legends?: Array<{
    color: string;
    value: string;
  }>;
  chart?: any;
}

const ChartWrapperComponent: React.FC<Props> = ({
  heading,
  legends,
  chart,
}) => {
  return (
    <Card
      headerCss={{
        borderBottom: `1px solid ${greyScaleColour.grey80}`,
      }}
      header={
        <Grid
          container
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding="0px 20px"
        >
          <Grid item>
            <StyledCustomChartHeading>{heading}</StyledCustomChartHeading>
          </Grid>
          <Grid item display="flex" gap="8px">
            {legends?.map((entry) => (
              <Grid display="flex" gap="8px" alignItems="center">
                <StyledFiberManualRecordOutlinedIcon color={entry?.color} />
                <StyledCustomChartLegend>
                  {entry?.value}
                </StyledCustomChartLegend>
              </Grid>
            ))}
          </Grid>
        </Grid>
      }
      cardCss={{
        width: "100%",
      }}
    >
      {chart}
    </Card>
  );
};

export default ChartWrapperComponent;
