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
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  HttpMethods,
  mapIdNameToOptionWithoutCaptializing,
  required,
} from "@wizehub/common/utils";
import { Status } from "@wizehub/common/models/modules";
import {
  Division,
  DivisionTeamEntity,
  PersonBasicDetailEntity,
} from "@wizehub/common/models/genericEntities";
import messages from "../../../messages";
import { apiCall } from "@wizehub/common/redux/actions";
import {
  DIVISION_LISTING_API,
  DIVISION_TEAM_LISTING_API,
  PEOPLE_LISTING_API,
  TEAM_EMPLOYEE_API,
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
import { mapIdFirstNameLastNameToOptionWithoutCaptializing } from "./addTeamMemberForm";
import { useLocation } from "react-router-dom";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  divisionId: Id;
  productionTeamId: Id;
}

interface FormData {
  employee: Option;
  team: Option;
}

const getDefaultProductionTeamMemberFilter =
  (): MetaData<DivisionTeamEntity> => ({
    ...getDefaultMetaData<DivisionTeamEntity>(),
    filters: {
      status: Status.active,
    },
  });

const getDefaultPeopleFilter = (): MetaData<PersonBasicDetailEntity> => ({
  ...getDefaultMetaData<PersonBasicDetailEntity>(),
  filters: {
    status: Status.active,
    isProdOrNull: true,
  },
});

const validators = {
  employee: [
    required(messages?.firmProfile?.teamStructure?.form?.validators?.name),
  ],
  team: [
    required(messages?.firmProfile?.teamStructure?.form?.validators?.team),
  ],
};

const AddProductionTeamMemberForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  divisionId,
  productionTeamId,
}) => {
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
  const { options, searchOptions } = useOptions<DivisionTeamEntity>(
    DIVISION_TEAM_LISTING_API.replace(":tenantId", tenantId).replace(
      ":divisionId",
      divisionId.toString()
    ),
    true,
    getDefaultProductionTeamMemberFilter()
  );

  const { options: peopleOptions, searchOptions: peopleSearchOptions } =
    useOptions<PersonBasicDetailEntity>(
      PEOPLE_LISTING_API.replace(":tenantId", tenantId),
      true,
      getDefaultPeopleFilter()
    );

  const { options: divisionOptions } =
    useOptions<Division>(DIVISION_LISTING_API);

  const onSubmit = async (data: FormData) => {
    const sanitizeBody: any = {
      tenantId: tenantId,
      employeeId: data?.employee?.id,
      teamId: data?.team?.id,
      isLead: null,
      divisionId: divisionOptions?.filter(
        (division) =>
          division?.name.toLowerCase() ===
          pathname?.split("/")[pathname?.split("/").length - 1]
      )[0]?.id,
    };

    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          TEAM_EMPLOYEE_API,
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

  useEffect(() => {
    const selectedOption = options?.filter(
      (opt) => opt?.id === productionTeamId
    )[0];
    if (productionTeamId && selectedOption) {
      change("team", {
        id: selectedOption?.id,
        label: selectedOption?.name,
      });
    }
  }, [productionTeamId, options]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField("team", {
            label: messages?.firmProfile?.teamStructure?.form?.productionTeam,
            required: true,
            options: options?.map(mapIdNameToOptionWithoutCaptializing),
            searchOptions: searchOptions,
            disabled: true,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField("employee", {
            label: messages?.firmProfile?.teamStructure?.form?.name,
            required: true,
            options: peopleOptions?.map(
              mapIdFirstNameLastNameToOptionWithoutCaptializing
            ),
            searchOptions: peopleSearchOptions,
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

export default AddProductionTeamMemberForm;
