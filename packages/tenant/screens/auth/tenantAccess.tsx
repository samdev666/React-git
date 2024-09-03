import React, { useEffect, useState } from 'react';
import { Container } from '../../components';
import {
    StyledFormContainer,
    StyledScreenWrapper
} from './styles';
import { SidePanel } from '.';
import {
    Button,
    Form,
    FormRow,
    FormRowItem,
    MaterialAutocompleteInput,
} from '@wizehub/components';
import { useFormReducer } from '@wizehub/common/hooks';
import { routes } from '../../utils';
import {
    HttpMethods,
    mapIdNameToOption,
    required
} from '@wizehub/common/utils';
import { useDispatch, useSelector } from 'react-redux';
import messages from '../../messages';
import { apiCall, hideLoader, showLoader, updateAuthenticationStatus, updateTenantGroup, updateTenantId } from '../../redux/actions';
import { push } from 'connected-react-router';
import { StyledInfoContainer, StyledFormHeading, StyledFormSubHeading } from '@wizehub/admin/screens/auth/styles';
import { GET_TENANT_FORMS, GET_USER_LINKED_GROUPS, GET_USER_LINKED_TENANTS } from '../../api';
import { GroupData, TenantData, TenantFormData } from '@wizehub/common/models/genericEntities';
import { AuthenticationStatus, Right } from '../../redux/reducers/auth';
import { TenantFormsCode } from '../../utils/constant';
import { ReduxState } from '../../redux/reducers';

const TenantAccess = () => {
    const [linkedGroups, setLinkedGroups] = useState<GroupData[]>(null);
    const [linkedTenant, setLinkedTenant] = useState<TenantData[]>(null);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [loadingTenants, setLoadingTenants] = useState(true);
    const auth = useSelector((state: ReduxState) => state.auth);

    const validators = {
        tenantName: [
            required(messages?.tenantGroup?.form?.errors?.tenantNameRequired)
        ]
    };

    const {
        submitting,
        submitError,
        handleSubmit,
        connectField,
        setSubmitError,
        formValues
    } = useFormReducer(validators);

    const reduxDispatch = useDispatch();

    const fetchData = async () => {
        setLoadingGroups(true);
        setLoadingTenants(true);
        try {
            const data: any = await getLinkedGroupsData();
            await getLinkedTenantsData(data);
        } catch (error) {
            console.log(error, "error");
        } finally {
            setLoadingGroups(false);
            setLoadingTenants(false);
            reduxDispatch(hideLoader());
        }
    }

    const getTenantForms = async (id: string) => {
        return new Promise((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    GET_TENANT_FORMS.replace(':tenantId', id).replace(
                        ':code',
                        TenantFormsCode.businessAssessment
                    ),
                    resolve,
                    reject,
                    HttpMethods.GET
                )
            );
        })
            .then((res: TenantFormData) => {
                if (res?.completionStatus === 'COMPLETED') {
                    return res?.completionStatus;
                }
            })
            .catch((error) => {
                console.log(error, 'error');
            });
    };

    const getLinkedGroupsData = async () => {
        return (
            new Promise((resolve, reject) => {
                reduxDispatch(
                    apiCall(
                        GET_USER_LINKED_GROUPS,
                        resolve,
                        reject,
                        HttpMethods.GET
                    )
                );
            })
                .then((res: GroupData[]) => {
                    return res;
                })
                .catch((error) => {
                    console.log(error, "error");
                })
        )
    }

    const getLinkedTenantsData = async (groupData?: GroupData[]) => {
        return (
            new Promise((resolve, reject) => {
                reduxDispatch(
                    apiCall(
                        GET_USER_LINKED_TENANTS,
                        resolve,
                        reject,
                        HttpMethods.GET
                    )
                );
            })
                .then((response: TenantData[]) => {
                    if (groupData) {
                        const groupsWithMultipleTenants = groupData?.filter(group => {
                            const tenantCount = response.filter(tenant => tenant.groupId === Number(group.id))?.length;
                            return tenantCount > 0;
                        });
                        setLinkedGroups(groupsWithMultipleTenants);
                        reduxDispatch(updateTenantGroup(true))
                        setLinkedTenant(response);
                    } else {
                        if (formValues?.groupName?.value?.id) {
                            const filteredTenantByGroup = response?.filter((item: TenantData) => item?.groupId &&
                                (item?.groupId === formValues?.groupName?.value?.id));
                            setLinkedTenant(filteredTenantByGroup);
                        } else {
                            setLinkedTenant(response);
                        }
                    }
                })
                .catch((error) => {
                    console.log(error, "error");
                })
        )
    }

    const onSubmit = async () => {
        reduxDispatch(updateTenantId(formValues?.tenantName?.value?.id));
        const data = await getTenantForms(formValues?.tenantName?.value?.id)
        if (auth.rights?.includes(Right.BUSINESS_ASSESSMENT)) {
            if (data) {
                reduxDispatch(updateAuthenticationStatus(AuthenticationStatus.AUTHENTICATED));
                reduxDispatch(push(routes.overview));
            } else {
                reduxDispatch(updateAuthenticationStatus(AuthenticationStatus.INCOMPLETE_BUSINESS_ASSESSMENT));
                reduxDispatch(push(routes.businessScoreccards.businessAssessment));
            }
        } else {
            reduxDispatch(updateAuthenticationStatus(AuthenticationStatus.AUTHENTICATED));
            reduxDispatch(push(routes.overview));
        }
    };

    useEffect(() => {
        reduxDispatch(showLoader());
        fetchData();
    }, []);

    useEffect(() => {
        formValues.tenantName.value = null;
        getLinkedTenantsData();
    }, [formValues?.groupName?.value?.id]);

    return (
        <Container noPadding hideSidebar hasHeader={false}>
            <StyledScreenWrapper>
                <SidePanel />
                <StyledFormContainer>
                    <StyledInfoContainer>
                        <StyledFormHeading variant="h1">
                            {messages?.tenantGroup?.heading}
                        </StyledFormHeading>
                        <StyledFormSubHeading>
                            {messages?.tenantGroup?.subHeading}
                        </StyledFormSubHeading>
                    </StyledInfoContainer>
                    {loadingGroups || loadingTenants ? (
                        <></>
                    ) : (
                        <Form
                            onSubmit={handleSubmit(onSubmit)}
                            style={{ padding: '24px 0px' }}
                            hasPadding
                        >
                            {linkedGroups?.length ? (
                                <>
                                    <FormRow marginBottom="24px">
                                        <FormRowItem>
                                            {connectField('groupName', {
                                                label: messages?.tenantGroup?.form?.groupName,
                                                options: linkedGroups ? linkedGroups?.map(mapIdNameToOption) : [],
                                                enableClearable: true
                                            })(MaterialAutocompleteInput)}
                                        </FormRowItem>
                                    </FormRow>
                                    <FormRow marginBottom="24px">
                                        <FormRowItem>
                                            {connectField('tenantName', {
                                                label: messages?.tenantGroup?.form?.tenantName,
                                                required: true,
                                                options: linkedTenant ? linkedTenant?.map(mapIdNameToOption) : []
                                            })(MaterialAutocompleteInput)}
                                        </FormRowItem>
                                    </FormRow>
                                </>
                            )
                                : <FormRow marginBottom="24px">
                                    <FormRowItem>
                                        {connectField('tenantName', {
                                            label: messages?.tenantGroup?.form?.tenantName,
                                            required: true,
                                            options: linkedTenant ? linkedTenant?.map(mapIdNameToOption) : []
                                        })(MaterialAutocompleteInput)}
                                    </FormRowItem>
                                </FormRow>}
                            <FormRow>
                                <FormRowItem>
                                    <Button
                                        label={messages?.tenantGroup?.form?.btnText}
                                        type={"submit"}
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        fullWidth
                                        disabled={submitting}
                                    />
                                </FormRowItem>
                            </FormRow>
                        </Form>
                    )}
                </StyledFormContainer>
            </StyledScreenWrapper>
        </Container>
    );
};

export default TenantAccess;