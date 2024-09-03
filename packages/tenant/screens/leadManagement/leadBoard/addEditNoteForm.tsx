import { Button, Form, FormRow, FormRowItem, MaterialAutocompleteInput, MaterialTextInput } from "@wizehub/components";
import React, { useEffect, useState } from "react";
import { StyledClientDetailsModalSeparator } from "./styles";
import { useFormReducer } from "@wizehub/common/hooks";
import messages from "../../../messages";
import { apiCall } from "../../../redux/actions";
import { useDispatch } from "react-redux";
import { HttpMethods, required } from "@wizehub/common/utils";
import { useSelector } from "react-redux";
import { ReduxState } from "../../../redux/reducers";
import { NOTES_API } from "../../../api";

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
    clientId: string;
    isEdit?: boolean;
    id?: number;
}

const validators = {
    note: [
        required(messages?.leadManagement?.note?.form?.validators?.noteRequired)
    ]
};

const AddEditNoteForm: React.FC<Props> = ({
    onCancel, onSuccess, clientId, isEdit, id
}) => {
    const reduxDispatch = useDispatch();
    const { tenantId } = useSelector((state: ReduxState) => state?.tenantData);
    const [noteData, setNoteData] = useState(null);

    const {
        submitting,
        handleSubmit,
        connectField,
        change,
        setSubmitError
    } = useFormReducer(validators);

    const getNoteDataById = async () => {
        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    `${NOTES_API}/${id}`,
                    resolve,
                    reject,
                    HttpMethods.GET
                )
            );
        })
            .then((res: any) => {
                setNoteData(res);
            })
            .catch((error) => {
                console.log(error?.message)
            });
    }

    const onSubmit = async (data: any) => {
        let sanitizeBody: any = {
            tenantId: tenantId,
            clientId: clientId,
            note: data?.note
        };

        return new Promise<void>((resolve, reject) => {
            reduxDispatch(
                apiCall(
                    isEdit ? `${NOTES_API}/${id}` : NOTES_API,
                    resolve,
                    reject,
                    isEdit ? HttpMethods.PATCH : HttpMethods.POST,
                    sanitizeBody
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
        getNoteDataById();
    }, [id])

    useEffect(() => {
        change("note", noteData?.note);
    }, [noteData])

    return (
        <Form style={{ width: '562px' }} onSubmit={handleSubmit(onSubmit)}>
            <FormRow mb={"16px"}>
                <FormRowItem>
                    {connectField("note", {
                        label: messages?.leadManagement?.note?.label,
                        multiline: true,
                        minRows: 3,
                        required: true,
                    })(MaterialTextInput)}
                </FormRowItem>
            </FormRow>
            <StyledClientDetailsModalSeparator borderColor={"#D9D9D9"} />
            <FormRow mt={"28px"} mb={0} justifyContent={"end"}>
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
                    label={isEdit ? 'Update' : messages?.plan?.budgetAndCapacity?.teamCapacityTab?.teamMemberForm?.add}
                />
            </FormRow>
        </Form>
    )
};

export default AddEditNoteForm;