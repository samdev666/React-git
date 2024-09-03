import React, { useEffect, useState } from "react";
import messages from "../../messages";
import { Button, Form, FormRow, FormRowItem, MaterialAutocompleteInput } from "@wizehub/components";
import { useFormReducer } from "@wizehub/common/hooks";
import { HttpMethods, mapIdNameToOption, required } from "@wizehub/common/utils";
import { StyledHeadingText } from "./styles";
import { GroupData, TenantData, TenantFormData } from "@wizehub/common/models/genericEntities";
import { apiCall, hideLoader, showLoader, updateAuthenticationStatus, updateTenantGroup, updateTenantId } from "../../redux/actions";
import { GET_TENANT_FORMS, GET_USER_LINKED_GROUPS, GET_USER_LINKED_TENANTS } from "../../api";
import { useDispatch } from "react-redux";
import { routes } from "../../utils";
import { push } from "connected-react-router";
import { TenantFormsCode } from "../../utils/constant";
import { ReduxState } from "../../redux/reducers";
import { useSelector } from "react-redux";
import { AuthenticationStatus, Right } from "../../redux/reducers/auth";

interface Props {
    onSuccess: () => void;
    onCancel: () => void;
}

const TenantAccessPopup: React.FC<Props> = ({
    onSuccess, onCancel
}) => {
    const [linkedGroups, setLinkedGroups] = useState<GroupData[]>(null);
    const [linkedTenant, setLinkedTenant] = useState<TenantData[]>(null);
    const { auth, tenantGroup } = useSelector((state: ReduxState) => state);

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
        change,
        formValues
    } = useFormReducer(validators);

    const reduxDispatch = useDispatch();

    const fetchData = async () => {
        const data: any = await getLinkedGroupsData();
        setLinkedGroups(data);
        getLinkedTenantsData(data);
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
                    reduxDispatch(updateTenantGroup(false));
                })
        )
    }

    const getLinkedTenantsData = async (groupData?: void | GroupData[]) => {
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
                        reduxDispatch(updateTenantGroup(true));
                        setLinkedGroups(groupsWithMultipleTenants);
                        setLinkedTenant(response);
                    } else {
                        if (formValues?.groupName?.value?.id) {
                            const filteredTenantByGroup = response?.filter((item: TenantData) => item?.groupId &&
                                (item?.groupId === formValues?.groupName?.value?.id));
                            setLinkedTenant(filteredTenantByGroup);
                        } else {
                            setLinkedTenant(response);
                        }
                    };
                })
                .catch((error) => {
                    console.log(error, "error");
                })
        )
    }

    const onSubmit = async () => {
        reduxDispatch(updateTenantId(formValues?.tenantName?.value?.id));
        onSuccess();
        reduxDispatch(showLoader());
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
        setTimeout(() => {
            reduxDispatch(hideLoader());
        }, 2000);
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        formValues.tenantName.value = null;
        getLinkedTenantsData();
    }, [formValues?.groupName?.value?.id]);

    return (
        <>
            <StyledHeadingText>
                {messages?.tenantGroup?.subHeading}
            </StyledHeadingText>
            <Form
                onSubmit={handleSubmit(onSubmit)}
                style={{ padding: '0px 24px 24px 24px' }}
                hasPadding
            >
                {(linkedGroups?.length || tenantGroup.hasGroup) ? (
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
                <FormRow justifyContent={"end"} mb={0}>
                    <Button
                        label={"Cancel"}
                        variant="outlined"
                        color="secondary"
                        size="large"
                        onClick={onCancel}
                        disabled={submitting}
                    />
                    <Button
                        label={messages?.tenantGroup?.form?.btnText}
                        type={"submit"}
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={submitting}
                    />
                </FormRow>
            </Form>
        </>
    )
};

export default TenantAccessPopup;