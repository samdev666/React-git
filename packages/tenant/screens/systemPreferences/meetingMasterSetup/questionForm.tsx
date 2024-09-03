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
  mapIdNameToOption,
  mapIdNameToOptionWithoutCaptializing,
  required,
  trimWordWrapper,
} from "@wizehub/common/utils";
import { Status } from "@wizehub/common/models/modules";
import { Id, MetaData, getDefaultMetaData } from "@wizehub/common/models";
import {
  Division,
  MeetingCategoryEntity,
  MeetingQuestionEntity,
} from "@wizehub/common/models/genericEntities";
import messages from "../../../messages";
import { apiCall } from "../../../redux/actions";
import {
  DIVISION_LISTING_API,
  MEETING_CATEGORY_LISTING_API,
  MEETING_QUESTION_BY_ID,
} from "../../../api";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";

const getDefaultMeetingCategoryFilter =
  (): MetaData<MeetingCategoryEntity> => ({
    ...getDefaultMetaData<MeetingCategoryEntity>(),
    order: "name",
    filters: {
      status: Status.active,
    },
  });

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  isUpdate?: boolean;
  meetingQuestionData?: MeetingQuestionEntity;
}

interface FormData {
  category: {
    id: Id;
  };
  division: Array<{
    id: Id;
  }>;
  question: string;
  status: Status;
}

const validators = {
  category: [
    required(
      messages?.settings?.systemPreferences?.meetingMasterSetup?.questions?.form
        ?.validators?.category
    ),
  ],
  division: [
    required(
      messages?.settings?.systemPreferences?.meetingMasterSetup?.questions?.form
        ?.validators?.division
    ),
  ],
  question: [
    required(
      messages?.settings?.systemPreferences?.meetingMasterSetup?.questions?.form
        ?.validators?.question
    ),
    emptyValueValidator,
  ],
};

const QuestionForm: React.FC<Props> = ({
  onCancel,
  onSuccess,
  meetingQuestionData,
  isUpdate = false,
}) => {
  const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
  const { options: meetingCategory, searchOptions } =
    useOptions<MeetingCategoryEntity>(
      MEETING_CATEGORY_LISTING_API.replace(":id", tenantId),
      true,
      getDefaultMeetingCategoryFilter()
    );

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
      categoryId: data?.category?.id,
      divisionIds: data?.division?.map((item) => Number(item?.id)),
      question: trimWordWrapper(data?.question),
      status: data?.status ? Status.active : Status.inactive,
    };

    return new Promise<void>((resolve, reject) => {
      reduxDispatch(
        apiCall(
          isUpdate
            ? `${MEETING_QUESTION_BY_ID}/${meetingQuestionData?.id}`
            : MEETING_QUESTION_BY_ID,
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
      change("category", {
        id: meetingQuestionData?.category?.id,
        label: meetingQuestionData?.category?.name,
      });
      change(
        "division",
        meetingQuestionData?.divisions?.map((item) => ({
          id: item.id,
          label: `${capitalizeLegend(item?.name)}`,
        }))
      );
      change("question", meetingQuestionData?.question);
      change("status", meetingQuestionData?.status === "ACTIVE");
    }
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow>
        <FormRowItem>
          {connectField("category", {
            label:
              messages?.settings?.systemPreferences?.meetingMasterSetup
                ?.questions?.form?.category,
            required: true,
            searchOptions,
            options: meetingCategory?.map(mapIdNameToOption),
          })(MaterialAutocompleteInput)}
        </FormRowItem>
        <FormRowItem>
          {connectField("division", {
            label:
              messages?.settings?.systemPreferences?.meetingMasterSetup
                ?.questions?.form?.division,
            required: true,
            options: divisionOptions?.map(mapIdNameToOptionWithoutCaptializing),
            searchOptions: searchDivisionOptions,
            multiple: true,
            isLimit: true,
          })(MaterialAutocompleteInput)}
        </FormRowItem>
      </FormRow>
      <FormRow minWidth="530px">
        <FormRowItem>
          {connectField("question", {
            label:
              messages?.settings?.systemPreferences?.meetingMasterSetup
                ?.questions?.form?.question,
            required: true,
            multiline: true,
            minRows: 3,
          })(MaterialTextInput)}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          {connectField("status", {
            label:
              messages?.settings?.systemPreferences?.meetingMasterSetup
                ?.questions?.form?.status,
          })(SwitchInput)}
        </FormRowItem>
      </FormRow>
      {submitError && (
        <FormRow>
          <FormRowItem>
            <FormError
              message={
                messages?.settings?.systemPreferences?.meetingMasterSetup
                  ?.questions?.form?.error?.serverError?.[submitError]
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
            messages?.settings?.systemPreferences?.meetingMasterSetup?.questions
              ?.form?.cancel
          }
        />
        <Button
          variant="contained"
          type="submit"
          disabled={submitting}
          label={
            messages?.settings?.systemPreferences?.meetingMasterSetup?.questions
              ?.form?.[isUpdate ? "update" : "create"]
          }
        />
      </FormRow>
    </Form>
  );
};

export default QuestionForm;
