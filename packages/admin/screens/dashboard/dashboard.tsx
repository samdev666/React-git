import React, { useState } from 'react';
import {
  Button, Card, CustomTabs, Stepper,
} from '@wizehub/components';
import {
  Box, Divider, Grid, Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { otherColour } from '@wizehub/common/theme/style.palette';
import { Option } from '@wizehub/common/models';
import {
  StyledCountsTypography, StyledCountsTypographyContainer,
  StyledCorporateFareIcon, StyledCountIconContainer,
  StyledCountsBox, StyledCountsBoxContainer,
  StyledCountsNumberText, StyledInfoText,
  StyledNotificationContainer,
  StyledCountsPercentageContainer, StyledArrowOutwardIcon,
  StyledArrowIconText, StyledCountsTimeText, StyledCallReceivedIcon,
  StyledBox, StyledBoxItem, StyledInfoContainer, StyledInfoTextDiv,
  StyledSupervisedUserCircleIcon, StyledTableHeading, StyledTableContainer, StyledTableViewText,
} from './styles';
import { StyledUserManagementHeadingContainer, StyledUserManagementLeftHeadingContainer } from '../userManagement/styles';
import { Container } from '../../components';
import RecentlyEnded from './recentlyEnded';
import EndingSoon from './endingSoon';

const dashboardStatusTabs: Option[] = [
  {
    id: 'endingSoon',
    label: 'Ending Soon',
  },
  {
    id: 'recentlyEnded',
    label: 'Recently Ended',
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'endingSoon' | 'recentlyEnded'>('endingSoon');
  return (
    <Container noPadding>
      <StyledUserManagementHeadingContainer>
        <StyledUserManagementLeftHeadingContainer>
          <Stepper />
        </StyledUserManagementLeftHeadingContainer>
      </StyledUserManagementHeadingContainer>
      <Card
        cardCss={{
          margin: '10px 0px 20px 20px',
          border: 'none',
          overflow: 'visible',
        }}
        noHeaderPadding
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <StyledBox>
            <StyledBoxItem>
              <StyledNotificationContainer>
                <StyledInfoContainer>
                  <StyledInfoTextDiv
                    // marginBottom="8px"
                    marginBottom="12px"
                  >
                    <StyledInfoText>
                      Welcome aboard, John
                    </StyledInfoText>
                  </StyledInfoTextDiv>
                  <StyledInfoTextDiv
                    // marginBottom="30px"
                    marginBottom="34px"
                  >
                    <Typography>
                      Your command deck. Find new things to do, or just grab a cup of coffee.
                    </Typography>
                  </StyledInfoTextDiv>
                  <StyledInfoTextDiv>
                    <Button
                      label="Check Notifications"
                      variant="contained"
                      color="primary"
                      endIcon={<NavigateNextIcon />}
                      sx={{ padding: '10px 20px 10px 20px !important' }}
                    />
                  </StyledInfoTextDiv>
                </StyledInfoContainer>
              </StyledNotificationContainer>
            </StyledBoxItem>

            {/* <StyledBoxItem>
              <StyledServicesContainer padding="0px">
                <div style={{ padding: '20px' }}>
                  <Typography>
                    Coach Serivces
                  </Typography>
                </div>
                <Divider orientation="horizontal" />
                <div style={{ padding: '20px' }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: '20px',
                    height: '128px'
                  }}>
                    Chart
                  </div>
                  <Grid container display="flex" alignItems="center">
                    <Grid item xs={1}>
                      <StyledGradientDiv />
                    </Grid>
                    <Grid item xs={11}>
                      <Typography>
                        52.30% Total account that utilizing coach services.
                      </Typography>
                    </Grid>
                  </Grid>
                </div>
              </StyledServicesContainer>
            </StyledBoxItem> */}

            <StyledCountsBoxContainer>
              <StyledCountsBox marginBottom="20px">
                <Box>
                  <Grid
                    container
                    marginBottom="10px"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <StyledCountsNumberText>
                        560
                      </StyledCountsNumberText>
                    </Grid>
                    <Grid item>
                      <StyledCountIconContainer>
                        <StyledCorporateFareIcon />
                      </StyledCountIconContainer>
                    </Grid>
                  </Grid>
                </Box>
                <StyledCountsTypographyContainer>
                  <StyledCountsTypography>
                    Total firms registered
                  </StyledCountsTypography>
                </StyledCountsTypographyContainer>
                <Box>
                  <Grid
                    container
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <StyledCountsPercentageContainer
                        backgroundColor={otherColour.successBg}
                      >
                        <Grid item>
                          <StyledArrowOutwardIcon />
                        </Grid>
                        <Grid item>
                          <StyledArrowIconText
                            color={otherColour.successDefault}
                          >
                            +5.78%
                          </StyledArrowIconText>
                        </Grid>
                      </StyledCountsPercentageContainer>
                    </Grid>
                    <Grid item>
                      <StyledCountsTimeText>
                        Since last month
                      </StyledCountsTimeText>
                    </Grid>
                  </Grid>
                </Box>
              </StyledCountsBox>

              <StyledCountsBox>
                <Box>
                  <Grid
                    container
                    marginBottom="10px"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <StyledCountsNumberText>
                        200
                      </StyledCountsNumberText>
                    </Grid>
                    <Grid item>
                      <StyledCountIconContainer>
                        <StyledCorporateFareIcon />
                      </StyledCountIconContainer>
                    </Grid>
                  </Grid>
                </Box>
                <StyledCountsTypographyContainer>
                  <StyledCountsTypography>
                    Total free registered firms
                  </StyledCountsTypography>
                </StyledCountsTypographyContainer>
                <Box>
                  <Grid
                    container
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <StyledCountsPercentageContainer
                        backgroundColor={otherColour.errorBg}
                      >
                        <Grid item>
                          <StyledCallReceivedIcon />
                        </Grid>
                        <Grid item>
                          <StyledArrowIconText
                            color={otherColour.errorDefault}
                          >
                            -3.82%
                          </StyledArrowIconText>
                        </Grid>
                      </StyledCountsPercentageContainer>
                    </Grid>
                    <Grid item>
                      <StyledCountsTimeText>
                        Since last month
                      </StyledCountsTimeText>
                    </Grid>
                  </Grid>
                </Box>
              </StyledCountsBox>
            </StyledCountsBoxContainer>

            <StyledCountsBoxContainer>
              <StyledCountsBox marginBottom="20px">
                <Box>
                  <Grid
                    container
                    marginBottom="10px"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <StyledCountsNumberText>
                        1260
                      </StyledCountsNumberText>
                    </Grid>
                    <Grid item>
                      <StyledCountIconContainer>
                        <StyledSupervisedUserCircleIcon />
                      </StyledCountIconContainer>
                    </Grid>
                  </Grid>
                </Box>
                <StyledCountsTypographyContainer>
                  <StyledCountsTypography>
                    Total tenant portals users
                  </StyledCountsTypography>
                </StyledCountsTypographyContainer>
                <Box>
                  <Grid
                    container
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <StyledCountsPercentageContainer
                        backgroundColor={otherColour.successBg}
                      >
                        <Grid item>
                          <StyledArrowOutwardIcon />
                        </Grid>
                        <Grid item>
                          <StyledArrowIconText
                            color={otherColour.successDefault}
                          >

                            +6.32%
                          </StyledArrowIconText>
                        </Grid>
                      </StyledCountsPercentageContainer>
                    </Grid>
                    <Grid item>
                      <StyledCountsTimeText>
                        Since last month
                      </StyledCountsTimeText>
                    </Grid>
                  </Grid>
                </Box>
              </StyledCountsBox>

              <StyledCountsBox>
                <Box>
                  <Grid
                    container
                    marginBottom="10px"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <StyledCountsNumberText>
                        360
                      </StyledCountsNumberText>
                    </Grid>
                    <Grid item>
                      <StyledCountIconContainer>
                        <StyledCorporateFareIcon />
                      </StyledCountIconContainer>
                    </Grid>
                  </Grid>
                </Box>
                <StyledCountsTypographyContainer>
                  <StyledCountsTypography>
                    Total paid registered firms
                  </StyledCountsTypography>
                </StyledCountsTypographyContainer>
                <Box>
                  <Grid
                    container
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <StyledCountsPercentageContainer
                        backgroundColor={otherColour.successBg}
                      >
                        <Grid item>
                          <StyledArrowOutwardIcon />
                        </Grid>
                        <Grid item>
                          <StyledArrowIconText
                            color={otherColour.successDefault}
                          >
                            +11.72%
                          </StyledArrowIconText>
                        </Grid>
                      </StyledCountsPercentageContainer>
                    </Grid>
                    <Grid item>
                      <StyledCountsTimeText>
                        Since last month
                      </StyledCountsTimeText>
                    </Grid>
                  </Grid>
                </Box>
              </StyledCountsBox>
            </StyledCountsBoxContainer>
          </StyledBox>

          <StyledBox>
            <Grid container>
              {/* <StyledBoxItem>
                <Box style={{
                  border: `1px solid ${greyScaleColour.grey80}`
                }}>
                  <Grid container display="flex" justifyContent={'space-between'} padding="20px">
                    <Grid item>
                      <StyledTableHeading>
                        Tenants Onboarded
                      </StyledTableHeading>
                    </Grid>
                    <Grid item>
                      <Typography>
                        Select year
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider orientation="horizontal" />
                  <Grid container>

                  </Grid>
                </Box>
              </StyledBoxItem> */}

              <StyledBoxItem>
                <StyledTableContainer>
                  <Grid container display="flex" justifyContent="space-between" padding="20px">
                    <Grid item>
                      <StyledTableHeading>
                        Free Trial Account
                      </StyledTableHeading>
                    </Grid>
                    <Grid item>
                      <StyledTableViewText>
                        View all
                      </StyledTableViewText>
                    </Grid>
                  </Grid>
                  <Divider orientation="horizontal" />
                  <Grid container>
                    <Grid
                      item
                      marginTop="10px"
                    >
                      <CustomTabs
                        tabs={dashboardStatusTabs}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      {activeTab === 'endingSoon'
                        ? <EndingSoon />
                        : <RecentlyEnded />}
                    </Grid>
                  </Grid>
                </StyledTableContainer>
              </StyledBoxItem>
            </Grid>
          </StyledBox>
        </Box>
      </Card>
    </Container>
  );
};

export default Dashboard;
