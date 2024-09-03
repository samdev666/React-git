import React from 'react';
import { Grid } from '@mui/material';
import {
  Button, Card, Modal, Stepper, Toast,
} from '@wizehub/components';
import { usePopupReducer, useEntity } from '@wizehub/common/hooks';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { toast } from 'react-toastify';
import { formatStatus } from '@wizehub/components/table';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { UserActionConfig, UserActionType } from '@wizehub/common/models';
import { ProductManagementDetailEntity } from '@wizehub/common/models/genericEntities';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { HttpMethods } from '@wizehub/common/utils';
import { Status } from '@wizehub/common/models/modules';
import { StyledResponsiveIcon } from '@wizehub/components/table/styles';
import { routes } from '../../utils';
import DeleteCTAForm from '../tenantManagement/deleteCTAForm';
import ProductManagementForm from './addProductManagement';
import {
  StyledDetailChildren,
  StyledDetailFooter,
  StyledDetailHeading,
  StyledDetailHeadingContainer,
  StyledDetailTableContent,
  StyledDetailTableHeading,
  StyledHeadingTypography,
} from '../userManagement/styles';
import {
  StyledProductManagementHeadingContainer,
  StyledProductManagementLeftHeadingContainer,
} from './styles';
import { PRODUCT_MANAGEMENT } from '../../api';
import messages from '../../messages';
import { Container } from '../../components';

import { ReduxState } from '../../redux/reducers';
import { Right } from '../../redux/reducers/auth';

export const ResponsiveDeleteIcon = StyledResponsiveIcon(
  DeleteOutlineOutlinedIcon,
);

export const ResponsiveEditIcon = StyledResponsiveIcon(EditOutlinedIcon);

const toastComponent = () => (
  <Toast
    text={messages.productManagement?.form?.deleted?.success}
  />
);

const ProductManagementDetails: React.FC = () => {
  const reduxDispatch = useDispatch();
  const { entity: productDetail, refreshEntity } = useEntity<ProductManagementDetailEntity>(PRODUCT_MANAGEMENT);
  const { id } = useParams<{ id?: string }>();
  const auth = useSelector((state: ReduxState) => state.auth);

  const disabledItems = auth.rights.some((item) => item === Right.PRODUCT_MANAGEMENT_READ_ONLY);

  const {
    visibility: deleteFormVisibility,
    showPopup: showDeleteForm,
    hidePopup: hideDeleteForm,
  } = usePopupReducer();

  const {
    visibility: editFormVisibility,
    showPopup: showEditForm,
    hidePopup: hideEditForm,
    metaData: editConfig,
  } = usePopupReducer<UserActionConfig>();

  return (
    <Container noPadding>
      <StyledProductManagementHeadingContainer>
        <StyledProductManagementLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {messages.productManagement.productDetail.heading}
          </StyledHeadingTypography>
        </StyledProductManagementLeftHeadingContainer>
        {
          !disabledItems && (
          <Button
            startIcon={<ResponsiveEditIcon />}
            variant="outlined"
            color="secondary"
            label={messages.productManagement.productDetail.button}
            onClick={() => showEditForm({
              type: UserActionType.EDIT,
            })}
            disabled={disabledItems}
          />
          )
        }
      </StyledProductManagementHeadingContainer>
      <Card noHeader cardCss={{ margin: '0 20px' }}>
        <Grid container>
          <StyledDetailHeadingContainer
            container
            item
            alignItems="center"
            justifyContent="space-between"
          >
            <StyledDetailHeading>
              {messages.productManagement.productDetail.generalInformation}
            </StyledDetailHeading>
          </StyledDetailHeadingContainer>
          <StyledDetailChildren container item>
            <Grid container item xs={12} gap="32px">
              <Grid item xs={2}>
                <StyledDetailTableHeading>
                  {messages.productManagement.productDetail.name}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {productDetail?.name ? productDetail?.name : '-'}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2}>
                <StyledDetailTableHeading>
                  {messages.productManagement.productDetail.basePrice}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {productDetail?.basePrice ? `$${productDetail?.basePrice}` : '-'}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2}>
                <StyledDetailTableHeading>
                  {messages.productManagement.productDetail.trialPeriod}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {productDetail?.trialPeriod
                    ? `${productDetail?.trialPeriod} days`
                    : '-'}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2}>
                <StyledDetailTableHeading>
                  {messages.productManagement.productDetail.gracePeriod}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {productDetail?.gracePeriod
                    ? `${productDetail?.gracePeriod} days`
                    : '-'}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2}>
                <StyledDetailTableHeading>
                  {messages.productManagement.productDetail.extraUserPrice}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {productDetail?.perUserPrice
                    ? `$${productDetail?.perUserPrice}`
                    : '-'}
                </StyledDetailTableContent>
              </Grid>
              <Grid item xs={2}>
                <StyledDetailTableHeading>
                  {messages.productManagement.productDetail.status}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {productDetail?.status
                    ? formatStatus(productDetail?.status)
                    : '-'}
                </StyledDetailTableContent>
              </Grid>
              <Grid item>
                <StyledDetailTableHeading>
                  {messages.productManagement.productDetail.noOfUsers}
                </StyledDetailTableHeading>
                <StyledDetailTableContent>
                  {productDetail?.baseUsers ? productDetail?.baseUsers : '-'}
                </StyledDetailTableContent>
              </Grid>
            </Grid>
          </StyledDetailChildren>
          {
            !disabledItems && (
            <StyledDetailFooter justifyContent="flex-end" container item>
              <Button
                startIcon={<ResponsiveDeleteIcon />}
                variant="contained"
                color="error"
                disabled={productDetail?.status === Status.inactive}
                label={messages.productManagement.productDetail.deleteProduct}
                onClick={() => showDeleteForm()}
              />
            </StyledDetailFooter>
            )
          }
        </Grid>
      </Card>
      <Modal
        show={editFormVisibility}
        heading={messages?.productManagement?.form?.editProduct}
        onClose={hideEditForm}
        fitContent
      >
        <ProductManagementForm
          isUpdate={editConfig?.type === UserActionType.EDIT}
          onCancel={hideEditForm}
          onSuccess={() => {
            hideEditForm();
            refreshEntity();
          }}
          productManagement={id}
        />
      </Modal>
      <Modal
        show={deleteFormVisibility}
        heading={messages.productManagement.deactivateProduct.heading}
        onClose={hideDeleteForm}
        fitContent
      >
        <DeleteCTAForm
          api={`${PRODUCT_MANAGEMENT}/${id}`}
          bodyText={messages.productManagement.deactivateProduct.note}
          cancelButton={messages?.general?.cancel}
          confirmButton={
            messages.productManagement.deactivateProduct.deactivateProduct
          }
          onCancel={hideDeleteForm}
          onSuccess={() => {
            hideDeleteForm();
            toast(toastComponent());
            reduxDispatch(push(routes.productmanagement.root));
          }}
          apiMethod={HttpMethods.PATCH}
          deleteBody={{
            status: Status.inactive,
          }}
        />
      </Modal>
    </Container>
  );
};

export default ProductManagementDetails;
