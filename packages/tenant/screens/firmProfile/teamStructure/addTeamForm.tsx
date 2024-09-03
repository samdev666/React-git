import { useFormReducer } from "@wizehub/common/hooks";
import {
  Button,
  Form,
  FormError,
  FormRow,
  FormRowItem,
  MaterialTextInput,
  Toast,
} from "@wizehub/components";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { emptyValueValidator, HttpMethods, required, trimWordWrapper } from "@wizehub/common/utils";
import messages from "../../../messages";
import { apiCall } from "@wizehub/common/redux/actions";
import { ADD_TEAM_API, ADD_TEAM_MEMBER_API } from "../../../api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { Id } from "@wizehub/common/models";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  divisionId: Id;
  team: {
    id: Id;
    name: string;
  };
}

interface FormData {
  name: string;
}

const validators = {
  name: [
    required(messages?.firmProfile?.teamStructure?.form?.validators?.name),
    emptyValueValidator
  ],
};

const AddTeamForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  divisionId,
  team,
}) => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    setSubmitError,
    change,
  } = useFormReducer(validators);

  const reduxDispatch = useDispatch();

  const onSubmit = async (data: FormData) => {
    const sanitizeBody = {
      tenantId: tenantId,
      name: trimWordWrapper(data?.name),
      divisionId: divisionId,
    };

    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          team?.id ? `${ADD_TEAM_API}/${team?.id}` : ADD_TEAM_API,
          resolve,
          reject,
          team?.id ? HttpMethods.PATCH : HttpMethods.POST,
          sanitizeBody
        )
      );
    })
      .then(() => {
        onSuccess();
        toast(
          <Toast
            text={
              team?.id
                ? messages?.firmProfile?.teamStructure?.form?.success
                    ?.teamUpdated
                : messages?.firmProfile?.teamStructure?.form?.success
                    ?.teamCreated
            }
          />
        );
      })
      .catch((error) => {
        setSubmitError(error?.message);
      });
  };

  useEffect(() => {
    if (team?.id) {
      change("name", team?.name);
    }
  }, [team]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField("name", {
            label: messages?.firmProfile?.teamStructure?.form?.name,
            required: true,
          })(MaterialTextInput)}
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
          label={
            team?.id
              ? messages?.firmProfile?.teamStructure?.form?.update
              : messages?.firmProfile?.teamStructure?.form?.create
          }
        />
      </FormRow>
    </Form>
  );
};

export default AddTeamForm;
