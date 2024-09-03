import { useFormReducer, useOptions } from "@wizehub/common/hooks";
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialAutocompleteInput,
  MaterialTextInput,
  SwitchInput,
} from "@wizehub/components";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  HttpMethods,
  capitalizeLegend,
  emptyValueValidator,
  mapIdNameToOptionWithoutCaptializing,
  required,
  trimWordWrapper,
} from "@wizehub/common/utils";
import { Status } from "@wizehub/common/models/modules";
import {
  Division,
  TeamPositionEntity,
} from "@wizehub/common/models/genericEntities";
import messages from "../../../messages";
import { apiCall } from "../../../redux/actions";
import { DIVISION_LISTING_API } from "../../../api";
import { PositionOptions } from "../../../utils/constant";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  endpoint: string;
  isUpdate?: boolean;
  positionData?: TeamPositionEntity;
}

interface DivisionEntity {
  id: string | number;
}

interface PositionLevel {
  id: string | number;
}

interface FormData {
  name: string;
  status: boolean;
  positionLevel?: PositionLevel;
  division?: DivisionEntity[];
  description?: string;
}

const validators = {
  name: [
    required(
      messages?.settings?.systemPreferences?.teamPositions?.form?.validators
        ?.name
    ),
    emptyValueValidator,
  ],
  positionLevel: [
    required(
      messages?.settings?.systemPreferences?.teamPositions?.form?.validators
        ?.positionLevel
    ),
  ],
  division: [
    required(
      messages?.settings?.systemPreferences?.teamPositions?.form?.validators
        ?.division
    ),
  ],
};

const TeamPositionForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  endpoint,
  isUpdate = false,
  positionData,
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

  const reduxDispatch = useDispatch();

  const { options: divisionOptions, searchOptions: searchDivisionOptions } =
    useOptions<Division>(DIVISION_LISTING_API);

  const onSubmit = async (data: FormData) => {
    const sanitizedBody = {
      tenantId: tenantId,
      name: trimWordWrapper(data?.name),
      code: trimWordWrapper(data?.name)?.replace(/\s+/g, "_")?.toUpperCase(),
      status: data?.status ? Status.active : Status.inactive,
      positionLevel: data?.positionLevel?.id,
      divisionIds: data?.division?.map((item) => Number(item?.id)),
      description: trimWordWrapper(data?.description)
        ? trimWordWrapper(data?.description)
        : null,
    };

    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          endpoint,
          resolve,
          reject,
          isUpdate ? HttpMethods.PATCH : HttpMethods.POST,
          sanitizedBody
        )
      );
    })
      .then(() => {
        onSuccess();
      })
      .catch((error) => {
        setSubmitError(error?.message);
      });
  };

  useEffect(() => {
    if (isUpdate) {
      change("name", positionData?.name);
      change("uniqueIdentifier", positionData?.code);
      change("status", positionData?.status === Status.active);
      change("positionLevel", {
        id: positionData?.positionLevel,
        label: PositionOptions?.find(
          (item) => item?.id === positionData?.positionLevel
        )?.label,
      });
      change(
        "division",
        positionData?.divisions?.map((option) => ({
          id: option.id,
          label: `${capitalizeLegend(option?.name)}`,
        }))
      );
      change("description", positionData?.description);
    }
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField("name", {
            label:
              messages?.settings?.systemPreferences?.teamPositions?.form?.name,
            required: true,
          })(MaterialTextInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField("uniqueIdentifier", {
            label:
              messages?.settings?.systemPreferences?.teamPositions?.form
                ?.uniqueIdentifier,
            disabled: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField("positionLevel", {
            label:
              messages?.settings?.systemPreferences?.teamPositions?.form
                ?.positionLevel,
            required: true,
            options: PositionOptions,
            enableClearable: true,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField("division", {
            label:
              messages?.settings?.systemPreferences?.teamPositions?.form
                ?.division,
            required: true,
            multiple: true,
            options: divisionOptions?.map(mapIdNameToOptionWithoutCaptializing),
            isLimit: true,
            searchOptions: searchDivisionOptions,
            enableClearable: true,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
      </FormRow>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField("description", {
            label:
              messages?.settings?.systemPreferences?.teamPositions?.form
                ?.description,
            minRows: 3,
            multiline: true,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField("status", {
            label:
              messages?.settings?.systemPreferences?.teamPositions?.form
                ?.status,
          })(SwitchInput)}
        </FormRowItem>
      </FormRow>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.settings?.systemPreferences?.teamPositions?.form
                  ?.error?.serverError?.[submitError]
              }
            />
          </FormRowItem>
        </FormRow>
      )}
      <FormRow justifyContent="end" marginBottom="0px">
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          disabled={submitting}
          label={
            messages?.settings?.systemPreferences?.teamPositions?.form.cancel
          }
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={
            messages?.settings?.systemPreferences?.teamPositions?.form?.[
              isUpdate ? "update" : "create"
            ]
          }
        />
      </FormRow>
    </Form>
  );
};

export default TeamPositionForm;
