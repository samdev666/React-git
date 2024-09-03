import React from "react";
import { Container } from "../../components";
import {
  StyledDetailHeading,
  StyledDetailHeadingContainer,
  StyledDetailTableContent,
  StyledDetailTableHeading,
  StyledHeadingTypography,
  StyledMainHeadingButtonContainer,
  StyledMainHeadingContainer,
  StyledMainLeftHeadingContainer,
} from "@wizehub/components/detailPageWrapper/styles";
import messages from "../../messages";
import { Button, Card, Modal } from "@wizehub/components";
import { ResponsiveEditIcon } from "../systemPreferences/launchPadSetup/launchPadSetupDetail";
import { Grid } from "@mui/material";
import {
  StyledDetailChildren,
  StyledFirmDetailImage,
  StyledGridCircleContainer,
  StyledGridImageContainer,
} from "./styles";
import { useEntity, usePopupReducer } from "@wizehub/common/hooks";
import { FIRM_DETAIL_BY_ID } from "../../api";
import { FirmProfileEntity } from "@wizehub/common/models/genericEntities";
import { useSelector } from "react-redux";
import { ReduxState } from "../../redux/reducers";
import { formatStatus } from "@wizehub/components/table";
import { config } from "../../config";
import { nullablePlaceHolder, trimWordWrapper } from "@wizehub/common/utils";
import EditFirmDetailForm from "./editFirmDetail";
import moment from "moment";
import { Country } from "@wizehub/common/models/modules";
import { Right } from "../../redux/reducers/auth";

interface Props { }

const FirmDetails: React.FC<Props> = () => {
  const { tenantData, auth } = useSelector((state: ReduxState) => state);
  const { tenantId } = tenantData;
  const {
    visibility: editFormVisibility,
    showPopup: showEditForm,
    hidePopup: hideEditForm,
    metaData: firmDetailConfig,
  } = usePopupReducer<{
    details: FirmProfileEntity;
  }>();
  const { entity: firmDetail, refreshEntity } = useEntity<FirmProfileEntity>(
    FIRM_DETAIL_BY_ID,
    tenantId
  );

  const disabledItems = auth?.rights?.some(
    (item) => item === Right.TENANT_FIRM_DETAILS_MANAGEMENT_READ_ONLY
  );

  const formatABN = (abn: string): string => {
    const abnData = abn?.replace(/\s+/g, '');
    return abnData?.replace(/(.{2})(.{3})(.{3})(.{3})/, '$1 $2 $3 $4');
  }

  return (
    <Container noPadding>
      <StyledMainHeadingContainer>
        <StyledMainLeftHeadingContainer>
          <StyledHeadingTypography>
            {messages?.firmProfile?.firmDetails?.heading}
          </StyledHeadingTypography>
        </StyledMainLeftHeadingContainer>
        <StyledMainHeadingButtonContainer>
          {!disabledItems && (
            <Button
              startIcon={<ResponsiveEditIcon />}
              variant="outlined"
              color="secondary"
              label={messages?.firmProfile?.firmDetails?.button}
              onClick={() =>
                showEditForm({
                  details: firmDetail,
                })
              }
            />
          )}
        </StyledMainHeadingButtonContainer>
      </StyledMainHeadingContainer>
      <Card noHeader cardCss={{ margin: "0 20px" }}>
        <Grid container>
          <StyledDetailHeadingContainer
            container
            item
            alignItems="center"
            justifyContent="space-between"
          >
            <StyledDetailHeading>
              {messages?.firmProfile?.firmDetails?.generalInformation}
            </StyledDetailHeading>
          </StyledDetailHeadingContainer>
          <StyledDetailChildren container item>
            <Grid container item xs={2.5}>
              <StyledGridImageContainer item>
                <StyledGridCircleContainer>
                  {firmDetail?.logoPath ? (
                    <StyledFirmDetailImage
                      src={`${config?.baseImageUrl}/${firmDetail?.logoPath}`}
                      alt={firmDetail?.logoPath}
                    />
                  ) : (
                    <StyledDetailTableHeading>
                      {messages?.firmProfile?.firmDetails?.noImage}
                    </StyledDetailTableHeading>
                  )}
                </StyledGridCircleContainer>
              </StyledGridImageContainer>
            </Grid>
            <Grid container item xs={9} gap={2}>
              <Grid item xs={2.5}>
                <StyledDetailTableHeading>
                  {messages?.firmProfile?.firmDetails?.firmName}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {firmDetail?.name ? firmDetail?.name : "-"}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2.5}>
                <StyledDetailTableHeading>
                  {messages?.firmProfile?.firmDetails?.group}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {firmDetail?.group?.name ? firmDetail?.group?.name : "-"}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2.5}>
                <StyledDetailTableHeading>
                  {firmDetail?.countryId?.name === Country.AUSTRALIA
                    ? messages?.firmProfile?.firmDetails?.abn
                    : messages?.firmProfile?.firmDetails?.firmIdentifier}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {firmDetail?.abn
                    ? firmDetail?.countryId?.name === Country.AUSTRALIA
                      ? formatABN(firmDetail?.abn)
                      : firmDetail?.abn
                    : "-"}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2.5}>
                <StyledDetailTableHeading>
                  {messages?.firmProfile?.firmDetails?.country}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {firmDetail?.countryId?.name
                    ? firmDetail?.countryId?.name
                    : "-"}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2.5}>
                <StyledDetailTableHeading>
                  {messages?.firmProfile?.firmDetails?.streetAddress}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {firmDetail?.streetAddress ? firmDetail?.streetAddress : "-"}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2.5}>
                <StyledDetailTableHeading>
                  {messages?.firmProfile?.firmDetails?.city}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {firmDetail?.city ? firmDetail?.city : "-"}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2.5}>
                <StyledDetailTableHeading>
                  {messages?.firmProfile?.firmDetails?.postalCode}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {firmDetail?.postalCode ? firmDetail?.postalCode : "-"}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2.5}>
                <StyledDetailTableHeading>
                  {messages?.firmProfile?.firmDetails?.status}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {formatStatus(firmDetail?.status)}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2.5}>
                <StyledDetailTableHeading>
                  {messages?.firmProfile?.firmDetails?.financialYearStartMonth}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {firmDetail?.financialStartMonth
                    ? moment()
                      .month(firmDetail?.financialStartMonth - 1)
                      .format("MMMM")
                    : "-"}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2.5}>
                <StyledDetailTableHeading>
                  {messages?.firmProfile?.firmDetails?.currency}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {firmDetail?.countryId?.currencySymbol &&
                    firmDetail?.countryId?.currencyCode
                    ? `${trimWordWrapper(
                      firmDetail?.countryId?.currencyCode
                    )} - ${firmDetail?.countryId?.currencySymbol}`
                    : "-"}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2.5}>
                <StyledDetailTableHeading>
                  {messages?.firmProfile?.firmDetails?.displayDateFormat}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {firmDetail?.dateFormat ? firmDetail?.dateFormat : "-"}
                </StyledDetailTableContent>
              </Grid>
            </Grid>
          </StyledDetailChildren>
        </Grid>
      </Card>
      <Modal
        fitContent
        show={editFormVisibility}
        onClose={hideEditForm}
        heading={messages?.firmProfile?.firmDetails?.form?.editHeading}
      >
        <EditFirmDetailForm
          onCancel={() => hideEditForm()}
          onSuccess={() => {
            hideEditForm();
            refreshEntity();
          }}
          firmDetailData={firmDetailConfig?.details}
        />
      </Modal>
    </Container>
  );
};

export default FirmDetails;
