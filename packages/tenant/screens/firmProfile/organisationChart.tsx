


import React, { useEffect, useState } from "react";
import { Container } from "../../components";
import {
  StyledHeadingTypography,
  StyledMainHeadingContainer,
  StyledMainLeftHeadingContainer,
} from "@wizehub/components/detailPageWrapper/styles";
import messages from "../../messages";
import { useOptions } from "@wizehub/common/hooks";
import {
  Division,
  DivisionTeamEntity,
  OrganisationStructureEntity,
} from "@wizehub/common/models/genericEntities";
import {
  DIVISION_LISTING_API,
  ORGANISATION_STRUCTURE_LISTING_API,
} from "../../api";
import { Card } from "@wizehub/components";
import { Grid } from "@mui/material";
import {
  StyledNameCardRoleText,
  StyledNameCardText,
  StyledOrganisationChartStructureCard,
  StyledOrganisationTeamAvatar,
  StyledOrganizationChartDataColumn,
  StyledOrganizationChartTableColumn,
  StyledOrganizationChartTableColumnHeading,
  StyledOrganizationChartTableColumnInfoIcon,
  StyledProductionAccordianExpandIcon,
  StyledProductionAccordianHeading,
  StyledProductionAccordion,
  StyledOrganisationGridContainer,
  StyledOrganisationInnerGridContainer,
  StyledOrganisationHeaderGridContainer,
  StyledOrganisationFlippedCard,
  StyledFilppedCardText,
} from "./styles";
import {
  Id,
  MetaData,
  PaginatedEntity,
  TeamStructureEnum,
  getDefaultMetaData,
} from "@wizehub/common/models";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { useDispatch } from "react-redux";
import {
  DIVISION_TEAM_ACTION,
  apiCall,
  updateOrganizationData,
} from "../../redux/actions";
import { config } from "../../config";
import { nullablePlaceHolder } from "@wizehub/common/utils";
import OrganisationChartProductionAccordianSummary from "./organisationChartProductionAccordianSummary";
import { routes } from "../../utils";
import { hideLoader, showLoader } from "@wizehub/common/redux/actions";
import { transform } from "lodash";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";
type GroupedByTeam = {
  [key: string]: OrganisationStructureEntity[];
};
interface SelectedIdx {
  index: number | string;
  flip: boolean;
}
const OrganisationChart = () => {
  const { options: divisionOptions } =
    useOptions<Division>(DIVISION_LISTING_API);
  const reduxDispatch = useDispatch();
  const { tenantData, organisationStructure } = useSelector(
    (state: ReduxState) => state
  );
  const [selectIndex, setSelectIndex] = useState<
    Record<number | string, boolean>
  >({});
  const [rotations, setRotations] = useState<Record<number | string, number>>(
    {}
  );
  const organisationTabs = divisionOptions.map((division) => {
    return {
      id: division?.id,
      label: division?.name,
    };
  });

  const employees: OrganisationStructureEntity[][] = [];

  divisionOptions?.map((division) => {
    return employees.push(
      organisationStructure?.filter(
        (org) => org?.division?.id.toString() === division?.id
      )
    );
  });

  const productionColumnIndex = employees?.findIndex(
    (employee) => employee[0]?.division?.name === TeamStructureEnum.PRODUCTION
  );

  const groupedByTeam = employees[productionColumnIndex]?.reduce<GroupedByTeam>(
    (acc, currentItem) => {
      const teamName = currentItem?.team?.name;
      if (!acc[teamName]) {
        acc[teamName] = [];
      }
      acc[teamName].push(currentItem);
      return acc;
    },
    {}
  );

  useEffect(() => {
    reduxDispatch(showLoader());
    reduxDispatch(
      apiCall(
        ORGANISATION_STRUCTURE_LISTING_API.replace(
          ":tenantId",
          tenantData?.tenantId
        ),
        (resolve) => {
          reduxDispatch(updateOrganizationData(resolve));
          reduxDispatch(hideLoader());
        },
        (reject) => {
          console.log(reject);
        }
      )
    );
  }, []);

  const handleFlip = (index: number | string) => {
    setRotations((prevRotations) => ({
      ...prevRotations,
      [index]: (prevRotations[index] || 0) + 180,
    }));
    setSelectIndex((prevSelectIndex) => ({
      ...prevSelectIndex,
      [index]: !(prevSelectIndex[index] || false),
    }));
  };

  return (
    <Container noPadding>
      <StyledMainHeadingContainer>
        <StyledMainLeftHeadingContainer>
          <StyledHeadingTypography>
            {messages?.firmProfile?.organisation?.heading}
          </StyledHeadingTypography>
        </StyledMainLeftHeadingContainer>
      </StyledMainHeadingContainer>

      <Card
        noHeader={true}
        cardCss={{
          margin: "0 20px",
          overflowY: "scroll",
          marginBottom: "20px",
          "&::-webkit-scrollbar": {
            width: "0px !important",
          },
        }}
      >
        <StyledOrganisationGridContainer>
          <StyledOrganisationInnerGridContainer container xs={12}>
            <StyledOrganisationHeaderGridContainer>
              {organisationTabs?.map((organisation, index) => (
                <StyledOrganizationChartTableColumn
                  key={index}
                  item
                  xs={
                    organisation?.label === TeamStructureEnum.PRODUCTION
                      ? 3
                      : 1.5
                  }
                  isLast={index === organisationTabs?.length - 1}
                  isRotated={rotations[index] && selectIndex[index] === true}
                  style={{
                    transform: `rotateY(${rotations[index] || 0}deg)`,
                    borderLeft:
                      index === organisationTabs.length - 1
                        ? "none"
                        : rotations[index] && selectIndex[index] === true
                        ? `1px solid ${greyScaleColour.grey80}`
                        : "",
                  }}
                  onClick={() => handleFlip(index)}
                >
                  <StyledOrganizationChartTableColumnHeading
                    style={{
                      transform: `rotateY(${rotations[index] || 0}deg)`,
                      gap: "10px",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    {organisation?.label}
                    <StyledOrganizationChartTableColumnInfoIcon />
                  </StyledOrganizationChartTableColumnHeading>
                </StyledOrganizationChartTableColumn>
              ))}
            </StyledOrganisationHeaderGridContainer>
          </StyledOrganisationInnerGridContainer>
          <Grid container xs={12} style={{ marginTop: "0rem", height: "70vh" }}>
            <StyledOrganisationHeaderGridContainer>
              {employees?.map((employee, index) => {
                return (
                  <StyledOrganizationChartDataColumn
                    xs={
                      organisationTabs?.filter(
                        (organisation) =>
                          organisation?.label === TeamStructureEnum.PRODUCTION
                      )[0]?.id === (index + 1).toString()
                        ? 3
                        : 1.5
                    }
                    item
                    isLast={index === organisationTabs?.length - 1}
                    isRotated={rotations[index] && selectIndex[index] === true}
                    style={{
                      transform: `rotateY(${rotations[index] || 0}deg)`,
                      borderLeft:
                        index === organisationTabs.length - 1
                          ? "none"
                          : rotations[index] && selectIndex[index] === true
                          ? `1px solid ${greyScaleColour.grey80}`
                          : "",
                      backgroundColor:
                        selectIndex[index] === true && greyScaleColour.grey60,
                    }}
                  >
                    {selectIndex[index] === true ? (
                      <StyledOrganisationFlippedCard>
                        <StyledFilppedCardText>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
                        </StyledFilppedCardText>
                      </StyledOrganisationFlippedCard>
                    ) : productionColumnIndex === index ? (
                      Object.entries(groupedByTeam).map(
                        ([teamName, members]) =>
                          teamName !== "undefined" && (
                            <StyledProductionAccordion
                              key={teamName}
                              id={teamName}
                            >
                              <StyledProductionAccordianHeading
                                expandIcon={
                                  <StyledProductionAccordianExpandIcon />
                                }
                              >
                                {teamName === "undefined" ? "-" : teamName}
                              </StyledProductionAccordianHeading>
                              <OrganisationChartProductionAccordianSummary
                                members={members}
                              />
                            </StyledProductionAccordion>
                          )
                      )
                    ) : (
                      employee?.map((emp) => {
                        return (
                          <>
                            {emp?.firstName && emp?.lastName && (
                              <StyledOrganisationChartStructureCard
                                onClick={() =>
                                  window.open(
                                    routes.firmProfile.peopleDetail.replace(
                                      ":id",
                                      emp?.id.toString()
                                    ),
                                    "_blank"
                                  )
                                }
                              >
                                <StyledNameCardText>
                                  {emp?.firstName ? emp?.firstName : "-"}{" "}
                                  {emp?.lastName ? emp?.lastName : "-"}
                                </StyledNameCardText>
                                <StyledNameCardRoleText>
                                  {emp?.role?.name ? emp?.role?.name : "-"}
                                </StyledNameCardRoleText>
                                <StyledOrganisationTeamAvatar
                                  src={`${config?.baseImageUrl}/${emp?.imageUrl}`}
                                />
                              </StyledOrganisationChartStructureCard>
                            )}
                          </>
                        );
                      })
                    )}
                  </StyledOrganizationChartDataColumn>
                );
              })}
            </StyledOrganisationHeaderGridContainer>
          </Grid>
        </StyledOrganisationGridContainer>
      </Card>
    </Container>
  );
};
export default OrganisationChart;
