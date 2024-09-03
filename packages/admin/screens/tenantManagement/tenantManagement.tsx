import React from 'react';
import { Stepper, Button, CustomTabs } from '@wizehub/components';
import { usePopupReducer, useActiveTabLocation } from '@wizehub/common/hooks';
import { TabsInterface, UserActionConfig } from '@wizehub/common/models';
import { push } from 'connected-react-router';
import { useSelector } from 'react-redux';
import { Container } from '../../components';
import messages from '../../messages';
import {
  StyledTenantManagementDetailButtonContainer,
  StyledTenantManagementHeadingContainer,
  StyledTenantManagementLeftHeadingContainer,
} from './styles';
import TenantListing from './tenantListing';
import TenantGroups from './tenantGroups';
import { StyledHeadingTypography } from '../userManagement/styles';
import { ResponsiveAddIcon } from '../productManagement/productManagement';
import { routes } from '../../utils';

import { ReduxState } from '../../redux/reducers';
import { Right } from '../../redux/reducers/auth';

interface RightBasedTabsInterface extends TabsInterface {
  right: Right[]
}

const tenantManagementTabs: RightBasedTabsInterface[] = [
  {
    id: 'listing',
    label: messages.tenantManagement.tenantListing,
    route: routes.tenantmanagement.root,
    right: [Right.TENANT_MANAGEMENT, Right.TENANT_MANAGEMENT_READ_ONLY],
  },
  {
    id: 'group',
    label: messages.tenantManagement.tenantGroups,
    route: routes.tenantmanagement.tenantManagementGroup,
    right: [Right.GROUP_MANAGEMENT, Right.GROUP_MANAGEMENT_READ_ONLY],
  },
];

const TenantManagement = () => {
  const { activeTabName, pathname } = useActiveTabLocation(tenantManagementTabs);
  const auth = useSelector((state: ReduxState) => state.auth);

  const finalTenantManagementTabs = tenantManagementTabs.filter((tab) => tab.right.some((right) => auth?.rights.includes(right)));

  const {
    visibility: formVisibility,
    showPopup: showForm,
    hidePopup: hideForm,
  } = usePopupReducer<UserActionConfig>();

  const {
    visibility: groupFormVisibility,
    showPopup: showGroupForm,
    hidePopup: hideGroupForm,
  } = usePopupReducer<UserActionConfig>();

  return (
    <Container noPadding>
      <StyledTenantManagementHeadingContainer>
        <StyledTenantManagementLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {messages.tenantManagement.heading}
          </StyledHeadingTypography>
        </StyledTenantManagementLeftHeadingContainer>
        {!auth?.rights?.includes(Right.TENANT_MANAGEMENT_READ_ONLY) && (
          pathname === routes.tenantmanagement.root ? (

            <StyledTenantManagementDetailButtonContainer>
              {/* <Button
              startIcon={<ImportExportIcon />}
              variant="outlined"
              color="secondary"
              label={messages.tenantManagement.exportTenantButton}
              onClick={() => showForm()}
            /> */}
              <Button
                startIcon={<ResponsiveAddIcon />}
                variant="contained"
                color="primary"
                label={messages.tenantManagement.addNewTenantButton}
                onClick={() => showForm()}
              />
            </StyledTenantManagementDetailButtonContainer>
          )
            : (
              <Button
                startIcon={<ResponsiveAddIcon />}
                variant="contained"
                color="primary"
                label={messages.tenantManagement.addNewGroup}
                onClick={() => showGroupForm()}
              />
            )
        )}
      </StyledTenantManagementHeadingContainer>
      <CustomTabs
        tabs={finalTenantManagementTabs}
        push={push}
        activeTabName={activeTabName}
      />
      {pathname === routes.tenantmanagement.root ? (
        <TenantListing
          formVisibility={formVisibility}
          hideForm={hideForm}
        />
      ) : (
        <TenantGroups
          formVisibility={groupFormVisibility}
          hideForm={hideGroupForm}
        />
      )}
    </Container>
  );
};

export default TenantManagement;
