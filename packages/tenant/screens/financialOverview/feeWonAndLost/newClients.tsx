import { Grid } from "@mui/material";
import { Card, Modal, Toast } from "@wizehub/components";
import React, { useEffect, useState } from "react";
import {
    StyledInnerGridDashedTableContainer,
    StyledInnerGridTableContainer,
    StyledInnerGridTableHeadingTypography,
    StyledTeamBudgetScrollableContainer
} from "../styles";
import { StyledTeamBudgetMonthTypography } from "../../plan/budgetAndCapacity/styles";
import { Id, UserActionConfig, UserActionType } from "@wizehub/common/models";
import { apiCall } from "../../../redux/actions";
import { FEE_WONS_API, FEE_WONS_LISTING_API } from "../../../api";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { FeeWonsEntity } from "@wizehub/common/models/genericEntities";
import { formatCurrency, HttpMethods } from "@wizehub/common/utils";
import DeleteCTAForm from "../../systemPreferences/launchPadSetup/deleteCTAForm";
import { toast } from "react-toastify";
import messages from "../../../messages";
import { usePopupReducer } from "@wizehub/common/hooks";
import { StyledDeleteIcon, StyledEditIcon, StyledTextContainer, StyledTotalTypography } from "./styles";
import { greyScaleColour } from "@wizehub/common/theme/style.palette";

interface Props {
    showClientForm: (metaData?: Partial<UserActionConfig>) => void;
    feeWonAndLostId: Id;
    feeWonAndLostTeamId: Id;
    getFeeWonsClientsData: () => Promise<void>;
    feeWonsData: FeeWonsEntity[];
}

const NewClients: React.FC<Props> = ({
    showClientForm,
    feeWonAndLostId,
    feeWonAndLostTeamId,
    getFeeWonsClientsData,
    feeWonsData
}) => {
    const {
        visibility: deleteFormVisibility,
        showPopup: showDeleteForm,
        hidePopup: hideDeleteForm,
        metaData: deleteConfig,
    } = usePopupReducer<UserActionConfig>();

    useEffect(() => {
        if (feeWonAndLostId && feeWonAndLostTeamId) {
            getFeeWonsClientsData();
        }
    }, [feeWonAndLostId, feeWonAndLostTeamId]);


    const calculateTotalCurrentYearAccountingFee = feeWonsData?.reduce((sum: number, item: FeeWonsEntity) => {
        return sum + (item?.currentYearAccountingFee || 0);
    }, 0);
    const calculateTotalCurrentYearBookkeepingFee = feeWonsData?.reduce((sum: number, item: FeeWonsEntity) => {
        return sum + (item?.currentYearBookkeepingFee || 0);
    }, 0);
    const calculateTotalNextYearAccountingFee = feeWonsData?.reduce((sum: number, item: FeeWonsEntity) => {
        return sum + (item?.nextYearAccountingFee || 0);
    }, 0);
    const calculateTotalNextYearBookkeepingFee = feeWonsData?.reduce((sum: number, item: FeeWonsEntity) => {
        return sum + (item?.nextYearBookkeepingFee || 0);
    }, 0);

    const calculateTotal = feeWonsData?.reduce((sum: number, item: FeeWonsEntity) => {
        return sum + (item?.currentYearAccountingFee +
            item?.currentYearBookkeepingFee +
            item?.nextYearAccountingFee +
            item?.nextYearBookkeepingFee || 0);
    }, 0);

    return (
        <>
            <Card
                cardCss={{
                    margin: "12px 0px 0px 10px",
                    width: "100%",
                }}
                noHeader
            >
                <Grid container item xs={12} gap={2}>
                    <StyledTeamBudgetScrollableContainer
                        container
                        item
                        xs
                        flexGrow={1}
                        display="grid"
                        gridAutoFlow="column"
                        overflow="auto"
                    >
                        <Grid container item xs minWidth="165px" flexGrow={1}>
                            <StyledInnerGridDashedTableContainer
                                item
                                xs={12}
                                noBorderBottom={!feeWonsData?.length}
                                height="118px"
                            >
                                <StyledInnerGridTableHeadingTypography>
                                    {messages?.measure?.financialOverview?.feesWonAndLost?.newClientsTab?.heading}
                                </StyledInnerGridTableHeadingTypography>
                            </StyledInnerGridDashedTableContainer>
                            <StyledInnerGridDashedTableContainer
                                item
                                xs={12}
                                noBackgroundColor={true}
                                noBorderBottom={!feeWonsData?.length}
                                display={!feeWonsData?.length && "none"}
                                height="10px"
                            />
                            {feeWonsData?.map((item: FeeWonsEntity, index: number) => {
                                return (
                                    <>
                                        <StyledInnerGridDashedTableContainer
                                            item
                                            xs={12}
                                            paddingValue="4px 14px"
                                        >
                                            <StyledInnerGridTableHeadingTypography inputColor={greyScaleColour.secondaryMain}>
                                                {item?.client?.businessName}
                                                <StyledTeamBudgetMonthTypography>
                                                    {`(${item?.client?.contactName})`}
                                                </StyledTeamBudgetMonthTypography>
                                            </StyledInnerGridTableHeadingTypography>
                                        </StyledInnerGridDashedTableContainer>
                                        <StyledInnerGridDashedTableContainer
                                            item
                                            xs={12}
                                            noBackgroundColor={true}
                                            noBorderBottom={false}
                                            height="10px"
                                        />
                                    </>
                                )
                            })}
                            {feeWonsData?.length ?
                                <StyledTextContainer>
                                    <StyledInnerGridTableContainer
                                        item
                                        xs={12}
                                        height="40%"
                                    >
                                        <StyledInnerGridTableHeadingTypography>
                                            Total
                                        </StyledInnerGridTableHeadingTypography>
                                    </StyledInnerGridTableContainer>
                                    <StyledInnerGridDashedTableContainer
                                        item
                                        xs={12}
                                        noBorderBottom={true}
                                        height="60%"
                                    >
                                        <StyledTeamBudgetMonthTypography style={{ visibility: 'hidden' }}>
                                            -
                                        </StyledTeamBudgetMonthTypography>
                                    </StyledInnerGridDashedTableContainer>
                                </StyledTextContainer> : <></>
                            }
                        </Grid>

                        <Grid container item xs minWidth="405px" flexGrow={1} textAlign={"center"}>
                            <StyledInnerGridTableContainer
                                item
                                xs={12}
                            >
                                <StyledInnerGridTableHeadingTypography>
                                    {`${messages?.measure?.financialOverview?.feesWonAndLost?.newClientsTab?.subHeading1FirstText}`}
                                    <div>
                                        {`${messages?.measure?.financialOverview?.feesWonAndLost?.newClientsTab?.subHeading1SecondText}(${new Date().getFullYear()})`}
                                    </div>
                                </StyledInnerGridTableHeadingTypography>
                            </StyledInnerGridTableContainer>
                            <StyledInnerGridDashedTableContainer
                                item
                                xs={12}
                                noBorderBottom={!feeWonsData?.length}
                            >
                                <Grid container>
                                    <Grid item xs={6}>
                                        <StyledTeamBudgetMonthTypography>
                                            {messages?.measure?.financialOverview?.feesWonAndLost?.newClientsTab?.taxAccountingDivision}
                                        </StyledTeamBudgetMonthTypography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <StyledTeamBudgetMonthTypography>
                                            {messages?.measure?.financialOverview?.feesWonAndLost?.newClientsTab?.bookkeepingDivision}
                                        </StyledTeamBudgetMonthTypography>
                                    </Grid>
                                </Grid>
                            </StyledInnerGridDashedTableContainer>
                            <StyledInnerGridDashedTableContainer
                                item
                                xs={12}
                                noBackgroundColor={true}
                                noBorderBottom={!feeWonsData?.length}
                                display={!feeWonsData?.length && "none"}
                                height="10px"
                            />
                            {feeWonsData?.map((item: FeeWonsEntity, index: number) => {
                                return (
                                    <>
                                        <StyledInnerGridDashedTableContainer
                                            item
                                            xs={12}
                                            paddingValue="12px 14px"
                                        >
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <StyledTeamBudgetMonthTypography>
                                                        {item?.currentYearAccountingFee
                                                            ? formatCurrency(item?.currentYearAccountingFee, false)
                                                            : '-'}
                                                    </StyledTeamBudgetMonthTypography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <StyledTeamBudgetMonthTypography>
                                                        {item?.currentYearBookkeepingFee
                                                            ? formatCurrency(item?.currentYearBookkeepingFee, false)
                                                            : '-'}
                                                    </StyledTeamBudgetMonthTypography>
                                                </Grid>
                                            </Grid>
                                        </StyledInnerGridDashedTableContainer>
                                        <StyledInnerGridDashedTableContainer
                                            item
                                            xs={12}
                                            noBackgroundColor={true}
                                            noBorderBottom={false}
                                            height="10px"
                                        />
                                    </>
                                )
                            })}
                            {feeWonsData?.length ?
                                <>
                                    <StyledInnerGridTableContainer
                                        item
                                        xs={12}
                                    >
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <StyledTotalTypography>
                                                    {formatCurrency(calculateTotalCurrentYearAccountingFee, false)}
                                                </StyledTotalTypography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <StyledTotalTypography>
                                                    {formatCurrency(calculateTotalCurrentYearBookkeepingFee, false)}
                                                </StyledTotalTypography>
                                            </Grid>
                                        </Grid>
                                    </StyledInnerGridTableContainer>
                                    <StyledInnerGridDashedTableContainer
                                        item
                                        xs={12}
                                        noBorderBottom={true}
                                    >
                                        <StyledTeamBudgetMonthTypography>
                                            <StyledInnerGridTableHeadingTypography>
                                                {messages?.measure?.financialOverview?.feesWonAndLost?.newClientsTab?.totalFeesWon}
                                            </StyledInnerGridTableHeadingTypography>
                                            <div>
                                                <StyledInnerGridTableHeadingTypography inputColor={greyScaleColour.secondaryMain}>
                                                    {formatCurrency(
                                                        (calculateTotalCurrentYearAccountingFee + calculateTotalCurrentYearBookkeepingFee),
                                                        false)}
                                                </StyledInnerGridTableHeadingTypography>
                                            </div>
                                        </StyledTeamBudgetMonthTypography>
                                    </StyledInnerGridDashedTableContainer>
                                </>
                                : <></>}
                        </Grid>

                        <Grid container item xs minWidth="405px" flexGrow={1} textAlign={"center"}>
                            <StyledInnerGridTableContainer
                                item
                                xs={12}
                            >
                                <StyledInnerGridTableHeadingTypography>
                                    {`${messages?.measure?.financialOverview?.feesWonAndLost?.newClientsTab?.subHeading2FirstText}`}
                                    <div>
                                        {`${messages?.measure?.financialOverview?.feesWonAndLost?.newClientsTab?.subHeading2SecondText}(${new Date().getFullYear() + 1})`}
                                    </div>
                                </StyledInnerGridTableHeadingTypography>
                            </StyledInnerGridTableContainer>
                            <StyledInnerGridDashedTableContainer
                                item
                                xs={12}
                                noBorderBottom={!feeWonsData?.length}
                            >
                                <Grid container>
                                    <Grid item xs={6}>
                                        <StyledTeamBudgetMonthTypography>
                                            {messages?.measure?.financialOverview?.feesWonAndLost?.newClientsTab?.taxAccountingDivision}
                                        </StyledTeamBudgetMonthTypography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <StyledTeamBudgetMonthTypography>
                                            {messages?.measure?.financialOverview?.feesWonAndLost?.newClientsTab?.bookkeepingDivision}
                                        </StyledTeamBudgetMonthTypography>
                                    </Grid>
                                </Grid>
                            </StyledInnerGridDashedTableContainer>
                            <StyledInnerGridDashedTableContainer
                                item
                                xs={12}
                                noBackgroundColor={true}
                                noBorderBottom={!feeWonsData?.length}
                                display={!feeWonsData?.length && "none"}
                                height="10px"
                            />
                            {feeWonsData?.map((item: FeeWonsEntity, index: number) => {
                                return (
                                    <>
                                        <StyledInnerGridDashedTableContainer
                                            item
                                            xs={12}
                                            paddingValue="12px 14px"
                                        >
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <StyledTeamBudgetMonthTypography>
                                                        {item?.nextYearAccountingFee
                                                            ? formatCurrency(item?.nextYearAccountingFee, false)
                                                            : '-'}
                                                    </StyledTeamBudgetMonthTypography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <StyledTeamBudgetMonthTypography>
                                                        {item?.nextYearBookkeepingFee
                                                            ? formatCurrency(item?.nextYearBookkeepingFee, false)
                                                            : '-'}
                                                    </StyledTeamBudgetMonthTypography>
                                                </Grid>
                                            </Grid>
                                        </StyledInnerGridDashedTableContainer>
                                        <StyledInnerGridDashedTableContainer
                                            item
                                            xs={12}
                                            noBackgroundColor={true}
                                            noBorderBottom={false}
                                            height="10px"
                                        />
                                    </>
                                )
                            })}
                            {feeWonsData?.length
                                ? <>
                                    <StyledInnerGridTableContainer
                                        item
                                        xs={12}
                                    >
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <StyledTotalTypography>
                                                    {formatCurrency(calculateTotalNextYearAccountingFee, false)}
                                                </StyledTotalTypography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <StyledTotalTypography>
                                                    {formatCurrency(calculateTotalNextYearBookkeepingFee, false)}
                                                </StyledTotalTypography>
                                            </Grid>
                                        </Grid>
                                    </StyledInnerGridTableContainer>
                                    <StyledInnerGridDashedTableContainer
                                        item
                                        xs={12}
                                        noBorderBottom={true}
                                    >
                                        <StyledTeamBudgetMonthTypography>
                                            <StyledInnerGridTableHeadingTypography>
                                                {messages?.measure?.financialOverview?.feesWonAndLost?.newClientsTab?.totalFeesWon}
                                            </StyledInnerGridTableHeadingTypography>
                                            <div>
                                                <StyledInnerGridTableHeadingTypography inputColor={greyScaleColour.secondaryMain}>
                                                    {formatCurrency(
                                                        (calculateTotalNextYearAccountingFee + calculateTotalNextYearBookkeepingFee),
                                                        false)}
                                                </StyledInnerGridTableHeadingTypography>
                                            </div>
                                        </StyledTeamBudgetMonthTypography>
                                    </StyledInnerGridDashedTableContainer>
                                </> : <></>
                            }
                        </Grid>

                        <Grid container item xs minWidth="200px" flexGrow={1} textAlign={"center"}>
                            <StyledTextContainer>
                                <StyledInnerGridTableContainer
                                    item
                                    xs={12}
                                    height="60%"
                                >
                                    <StyledInnerGridTableHeadingTypography style={{ visibility: 'hidden' }}>
                                        -
                                    </StyledInnerGridTableHeadingTypography>
                                </StyledInnerGridTableContainer>
                                <StyledInnerGridDashedTableContainer
                                    item
                                    xs={12}
                                    noBorderBottom={!feeWonsData?.length}
                                    height="40%"
                                >
                                    <StyledTeamBudgetMonthTypography>
                                        {messages?.measure?.financialOverview?.feesWonAndLost?.newClientsTab?.totals}
                                    </StyledTeamBudgetMonthTypography>
                                </StyledInnerGridDashedTableContainer>
                            </StyledTextContainer>
                            <StyledInnerGridDashedTableContainer
                                item
                                xs={12}
                                noBackgroundColor={true}
                                noBorderBottom={!feeWonsData?.length}
                                display={!feeWonsData?.length && "none"}
                                height="10px"
                            />
                            {feeWonsData?.map((item: FeeWonsEntity, index: number) => {
                                return (
                                    <>
                                        <StyledInnerGridDashedTableContainer
                                            item
                                            xs={12}
                                            paddingValue="12px 14px"
                                        >
                                            <StyledTeamBudgetMonthTypography>
                                                {formatCurrency((
                                                    item?.currentYearAccountingFee +
                                                    item?.currentYearBookkeepingFee +
                                                    item?.nextYearAccountingFee +
                                                    item?.nextYearBookkeepingFee),
                                                    false
                                                )}
                                            </StyledTeamBudgetMonthTypography>
                                        </StyledInnerGridDashedTableContainer>
                                        <StyledInnerGridDashedTableContainer
                                            item
                                            xs={12}
                                            noBackgroundColor={true}
                                            noBorderBottom={false}
                                            height="10px"
                                        />
                                    </>
                                )
                            })}
                            {feeWonsData?.length
                                ? <StyledTextContainer>
                                    <StyledInnerGridTableContainer
                                        item
                                        xs={12}
                                        height="40%"
                                    >
                                        <StyledTeamBudgetMonthTypography>
                                            {formatCurrency(calculateTotal, false)}
                                        </StyledTeamBudgetMonthTypography>
                                    </StyledInnerGridTableContainer>
                                    <StyledInnerGridDashedTableContainer
                                        item
                                        xs={12}
                                        noBorderBottom={true}
                                        height="60%"
                                    >
                                        <StyledTeamBudgetMonthTypography style={{ visibility: 'hidden' }}>
                                            -
                                        </StyledTeamBudgetMonthTypography>
                                    </StyledInnerGridDashedTableContainer>
                                </StyledTextContainer> : <></>}
                        </Grid>

                        <Grid container item xs minWidth="122px" flexGrow={1} textAlign={"center"}>
                            <StyledTextContainer>
                                <StyledInnerGridTableContainer
                                    item
                                    xs={12}
                                    height="60%"
                                >
                                    <StyledInnerGridTableHeadingTypography style={{ visibility: 'hidden' }}>
                                        -
                                    </StyledInnerGridTableHeadingTypography>
                                </StyledInnerGridTableContainer>
                                <StyledInnerGridDashedTableContainer
                                    item
                                    xs={12}
                                    noBorderBottom={!feeWonsData?.length}
                                    height="40%"
                                >
                                    <StyledTeamBudgetMonthTypography style={{ visibility: 'hidden' }}>
                                        -
                                    </StyledTeamBudgetMonthTypography>
                                </StyledInnerGridDashedTableContainer>
                            </StyledTextContainer>
                            <StyledInnerGridDashedTableContainer
                                item
                                xs={12}
                                noBackgroundColor={true}
                                noBorderBottom={!feeWonsData?.length}
                                display={!feeWonsData?.length && "none"}
                                height="10px"
                            />
                            {feeWonsData?.map((item: FeeWonsEntity, index: number) => {
                                return (
                                    <>
                                        <StyledInnerGridDashedTableContainer
                                            item
                                            xs={12}
                                            paddingValue="12px 14px"
                                        >
                                            <Grid container gap="20px" justifyContent={"center"}>
                                                <Grid item>
                                                    <StyledEditIcon onClick={() => {
                                                        showClientForm({
                                                            type: UserActionType.EDIT,
                                                            id: item?.id
                                                        })
                                                    }} />
                                                </Grid>
                                                <Grid item>
                                                    <StyledDeleteIcon onClick={() => {
                                                        showDeleteForm({
                                                            type: UserActionType.DELETE,
                                                            id: item?.id
                                                        })
                                                    }} />
                                                </Grid>
                                            </Grid>
                                        </StyledInnerGridDashedTableContainer>
                                        <StyledInnerGridDashedTableContainer
                                            item
                                            xs={12}
                                            noBackgroundColor={true}
                                            noBorderBottom={false}
                                            height="10px"
                                        />
                                    </>
                                )
                            })}
                            {feeWonsData?.length
                                ? <StyledTextContainer>
                                    <StyledInnerGridTableContainer
                                        item
                                        xs={12}
                                        height="40%"
                                    >
                                        <StyledTeamBudgetMonthTypography style={{ visibility: 'hidden' }}>
                                            -
                                        </StyledTeamBudgetMonthTypography>
                                    </StyledInnerGridTableContainer>
                                    <StyledInnerGridDashedTableContainer
                                        item
                                        xs={12}
                                        noBorderBottom={true}
                                        height="60%"
                                    >
                                        <StyledTeamBudgetMonthTypography style={{ visibility: 'hidden' }}>
                                            -
                                        </StyledTeamBudgetMonthTypography>
                                    </StyledInnerGridDashedTableContainer>
                                </StyledTextContainer> : <></>}
                        </Grid>
                    </StyledTeamBudgetScrollableContainer>
                </Grid >
            </Card >
            <Modal
                show={deleteFormVisibility}
                heading={messages?.measure?.financialOverview?.feesWonAndLost?.delete}
                onClose={hideDeleteForm}
                fitContent
            >
                <DeleteCTAForm
                    onCancel={hideDeleteForm}
                    onSuccess={() => {
                        hideDeleteForm();
                        toast(
                            <Toast
                                text={
                                    messages?.measure?.financialOverview?.feesWonAndLost?.newClientsTab?.success?.deleted
                                }
                            />
                        );
                        getFeeWonsClientsData();
                    }}
                    api={`${FEE_WONS_API}/${deleteConfig?.id}`}
                    bodyText={messages?.measure?.financialOverview?.feesWonAndLost?.deleteHeading}
                    cancelButton={messages?.settings?.accountManagement?.form?.cancel}
                    confirmButton={
                        messages?.settings?.accountManagement?.form?.deleteButton
                    }
                    apiMethod={HttpMethods.DELETE}
                />
            </Modal>
        </>
    )
};

export default NewClients;