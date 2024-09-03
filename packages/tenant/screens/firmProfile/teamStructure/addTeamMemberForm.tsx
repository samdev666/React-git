import { useFormReducer, useOptions } from "@wizehub/common/hooks";
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialAutocompleteInput,
  Toast,
} from "@wizehub/components";
import React from "react";
import { useDispatch } from "react-redux";
import { HttpMethods, required } from "@wizehub/common/utils";
import { Status } from "@wizehub/common/models/modules";
import {
  Division,
  PersonBasicDetailEntity,
} from "@wizehub/common/models/genericEntities";
import messages from "../../../messages";
import { apiCall } from "@wizehub/common/redux/actions";
import {
  ADD_TEAM_MEMBER_API,
  DIVISION_LISTING_API,
  PEOPLE_LISTING_API,
} from "../../../api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import {
  Id,
  MetaData,
  Option,
  getDefaultMetaData,
} from "@wizehub/common/models";
import { useLocation } from "react-router-dom";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
}

interface FormData {
  employee: Option;
}

const validators = {
  employee: [
    required(messages?.firmProfile?.teamStructure?.form?.validators?.name),
  ],
};

export const getDefaultTeamMemberFilter =
  (): MetaData<PersonBasicDetailEntity> => ({
    ...getDefaultMetaData<PersonBasicDetailEntity>(),
    filters: {
      status: Status.active,
    },
  });

export const mapIdFirstNameLastNameToOptionWithoutCaptializing = (entity: {
  id: Id;
  firstName: string;
  lastName: string;
}): Option => ({
  id: entity?.id,
  label: `${entity?.firstName} ${entity?.lastName}`,
});

const AddTeamMemberForm: React.FC<Props> = ({ onCancel, onSuccess }) => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    change,
    setSubmitError,
  } = useFormReducer(validators);

  const { pathname } = useLocation();

  const reduxDispatch = useDispatch();
  const { options, searchOptions } = useOptions<PersonBasicDetailEntity>(
    PEOPLE_LISTING_API.replace(":tenantId", tenantId),
    true,
    getDefaultTeamMemberFilter()
  );

  const { options: divisionOptions } =
    useOptions<Division>(DIVISION_LISTING_API);

  const onSubmit = async (data: FormData) => {
    const sanitizeBody = {
      tenantId: tenantId,
      employeeId: data?.employee?.id,
      divisionId: divisionOptions?.filter(
        (division) =>
          division?.name.toLowerCase() ===
          pathname?.split("/")[pathname?.split("/").length - 1]
      )[0]?.id,
    };

    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          ADD_TEAM_MEMBER_API,
          resolve,
          reject,
          HttpMethods.POST,
          sanitizeBody
        )
      );
    })
      .then(() => {
        onSuccess();
        toast(
          <Toast
            text={messages?.firmProfile?.teamStructure?.form?.success?.created}
          />
        );
      })
      .catch((error) => {
        setSubmitError(error?.message);
      });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField("employee", {
            label: messages?.firmProfile?.teamStructure?.form?.name,
            required: true,
            options: options?.map(
              mapIdFirstNameLastNameToOptionWithoutCaptializing
            ),
            searchOptions: searchOptions,
            enableClearable: true,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
      </FormRow>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.firmProfile?.teamStructure?.form?.error
                  ?.serverError?.[submitError]
              }
            />
          </FormRowItem>
        </FormRow>
      )}
      <FormRow justifyContent="end" mb={0}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          label={messages?.firmProfile?.teamStructure?.form?.cancel}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={messages?.firmProfile?.teamStructure?.form?.create}
        />
      </FormRow>
    </Form>
  );
};

export default AddTeamMemberForm;
