import React from 'react';
import {
    Card,
    Table,
    Modal,
    Button
} from '@wizehub/components';
import {
    usePagination,
    usePopupReducer,
} from '@wizehub/common/hooks';
import {
    MetaData,
    getDefaultMetaData,
    PaginatedEntity,
    UserActionConfig
} from '@wizehub/common/models';
import { FeeHistoryEntity } from '@wizehub/common/models/genericEntities';
import { ResponsiveAddIcon } from '@wizehub/admin/screens/productManagement/productManagement';
import { FEE_HISTORY } from '../../../redux/actions';
import { GET_FEE_HISTORY_LISTING } from '../../../api';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../../redux/reducers';
import FeeHistoryForm from './addFeeHistoryForm';
import { StyledFeeHistoryHeading } from './styles';
import messages from '../../../messages';

interface Props {
    feeHistoryData: any;
    applyFilters: (loadMore?: boolean) => void;
    fetchPage: (page?: number) => void;
    updateLimit: (limit?: number) => void;
    updateFilters: (filter: Partial<MetaData<FeeHistoryEntity>>) => void;
}

const FeeHistory: React.FC<Props> = ({
    feeHistoryData, applyFilters, fetchPage, updateLimit, updateFilters
}) => {
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);

    const {
        visibility: formVisibility,
        showPopup: showForm,
        hidePopup: hideForm,
    } = usePopupReducer<UserActionConfig>();

    return (
        <>
            <Card
                noHeaderPadding
                header={
                    <Grid
                        container
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        padding={"0px 20px"}
                    >
                        <Grid item>
                            <StyledFeeHistoryHeading>
                                {messages?.businessAssessment?.feeHistory?.heading}
                            </StyledFeeHistoryHeading>
                        </Grid>
                        <Grid item>
                            <Button
                                startIcon={<ResponsiveAddIcon />}
                                variant="contained"
                                color="primary"
                                label={messages?.businessAssessment?.feeHistory?.addYear}
                                onClick={() => showForm()}
                            />
                        </Grid>
                    </Grid>
                }
                cardCss={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '14px 0px',
                    gap: "14px"
                }}
            >
                <Table
                    data={feeHistoryData?.records}
                    metadata={feeHistoryData?.metadata}
                    fetchPage={fetchPage}
                    updateLimit={updateLimit}
                    disableSorting={['annualFee', 'growthPercentage', 'ebita', 'ebitaPercentage']}
                    updateFilters={(filterParams: any) => {
                        updateFilters(filterParams);
                        applyFilters();
                    }}
                    specs={[
                        {
                            id: 'year',
                            label: messages?.businessAssessment?.feeHistory?.labels?.tradingYear
                        },
                        {
                            id: 'annualFee',
                            label: messages?.businessAssessment?.feeHistory?.labels?.annualFee
                        },
                        {
                            id: 'growthPercentage',
                            label: messages?.businessAssessment?.feeHistory?.labels?.growthPercentage,
                            getValue: (row) => row?.growthPercentage ? `${row.growthPercentage}%` : '-'
                        },
                        {
                            id: 'ebita',
                            label: messages?.businessAssessment?.feeHistory?.labels?.ebitdaReview
                        },
                        {
                            id: 'ebitaPercentage',
                            label: messages?.businessAssessment?.feeHistory?.labels?.ebitdaPercent,
                            getValue: (row) => row?.ebitaPercentage ? `${row.ebitaPercentage}%` : '-'
                        },
                    ]}
                />
            </Card>

            <Modal
                show={formVisibility}
                heading={messages?.businessAssessment?.feeHistory?.forms?.heading}
                onClose={hideForm}
                fitContent
            >
                <FeeHistoryForm
                    onCancel={hideForm}
                    onSuccess={() => {
                        hideForm();
                        applyFilters();
                    }}
                    tenantId={tenantId}
                />
            </Modal>
        </>
    );
};

export default FeeHistory;
