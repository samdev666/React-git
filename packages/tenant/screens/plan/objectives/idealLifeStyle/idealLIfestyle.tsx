import React,{useState} from 'react';
import {Container} from "../../../../components";
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../../../redux/reducers';
import { Button,MaterialAutocompleteInput,MultiTabComponent} from '@wizehub/components';
import { ResponsiveDayViewIcon } from '../../budgetAndCapacity/budgetAndCapacity';
import {StyledHeadingTypography,StyledIdealContainer,StyledMainHeadingContainer,StyledMultiTabContainer} from './style';
import messages from "../../../../messages";
import { PLAN_LISTING_API } from "../../../../api";
import {
    mapIdNameToOptionWithoutCaptializing,
    required,
  } from "@wizehub/common/utils";
import {
    UserActionConfig,
    MetaData,
    getDefaultMetaData,
    Id
  } from "@wizehub/common/models";
import { DIVISION_LISTING_API } from '../../../../api';
import { PlanEntity } from "@wizehub/common/models/genericEntities";
import { Division } from "@wizehub/common/models/genericEntities";
import {useFormReducer,usePopupReducer,useOptions} from "@wizehub/common/hooks";

const IdealLifestyle =()=>{
    const { connectField, formValues, connectFieldReplicate } = useFormReducer();
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);

    const {
        visibility: createPlanFormVisibility,
        showPopup: showCreatePlanForm,
        hidePopup: hideCreatePlanForm,
      } = usePopupReducer<UserActionConfig>();

      const getDefaulBudgetAndCapacityPlanFilter = (): MetaData<PlanEntity> => ({
        ...getDefaultMetaData<PlanEntity>(),
        allResults: true,
      });

      const { options: planOptions, refreshOptions } = useOptions<PlanEntity>(
        PLAN_LISTING_API.replace(":tenantId", tenantId),
        true,
        getDefaulBudgetAndCapacityPlanFilter()
      );

      const { options: divisionOptions } =
      useOptions<Division>(DIVISION_LISTING_API);

      const divisionTabs = divisionOptions.map((division) => {
        return {
            id: division?.id,
            label: division?.name
        };
    })

      const idealLifestyleTabs = divisionTabs?.length ? [
        {
            id: 'all',
            label: 'All',
        },
        ...divisionTabs
    ] : [];
    const [activeTab, setActiveTab] = useState<Id>('all');
    return (
        <Container noPadding> 
        <StyledMainHeadingContainer>
        <StyledIdealContainer container xs={7}>
          <StyledHeadingTypography>
            {messages?.plan?.objectives?.idealLifestyle?.heading}
          </StyledHeadingTypography>
          <Grid container item xs={4} gap={2}>
            <Grid item xs={7}>
              {connectField("plan", {
                label: messages?.plan?.objectives?.idealLifestyle?.plan,
                options: planOptions?.map(mapIdNameToOptionWithoutCaptializing),
              })(MaterialAutocompleteInput)}
            </Grid>
            <Grid item xs={3}>
              <Button
                startIcon={<ResponsiveDayViewIcon />}
                variant="text"
                color="primary"
                label={messages?.plan?.objectives?.idealIncome?.plan}
                onClick={() => {
                  showCreatePlanForm();
                }}
              ></Button>
            </Grid>
          </Grid>
        </StyledIdealContainer>
        </StyledMainHeadingContainer>
        <StyledMultiTabContainer>
            <MultiTabComponent
            tabs={idealLifestyleTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            />
        </StyledMultiTabContainer>


        </Container>
    )
}
export default IdealLifestyle;