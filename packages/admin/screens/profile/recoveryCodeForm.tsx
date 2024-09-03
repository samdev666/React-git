import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Button, Form, FormRow, FormRowItem, Toast,
} from '@wizehub/components';
import { Checkbox } from '@mui/material';
import { Id } from '@wizehub/common/models';
import messages from '../../messages';
import {
  StyledCautionIcon,
  StyledCautionText,
  StyledCautionTextContainer,
  StyledRecoverCodeText,
  StyledUpdateMultiFactorAuthenticationNote,
} from './styles';
import { StyledFormControlLabel } from '../auth/styles';

interface Props {
  onSuccess: () => void;
  recoveryCodeConfig: {
    data?: {
      records: { id: Id; code: string }[]
    };
  };
}

const RecoveryCodeForm: React.FC<Props> = ({
  onSuccess,
  recoveryCodeConfig,
}) => {
  const [save, setSave] = useState<boolean>(false);

  const codes = recoveryCodeConfig?.data?.records
    ?.map((item: { id: Id; code: string }) => item?.code)
    .join('\n');

  const handleCopyRecoveryCode = () => {
    navigator.clipboard
      .writeText(codes)
      .then(() => {
        toast(() => (
          <Toast text={messages?.userManagement?.form?.textCopy?.success} />
        ));
      })
      .catch(() => {
        toast(() => (
          <Toast
            type="error"
            text={messages?.userManagement?.form?.textCopy?.error}
          />
        ));
      });
  };

  const handleDownloadRecoveryCode = () => {
    const element = document.createElement('a');
    const file = new Blob([codes], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'recovery_codes.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Form>
      <FormRow width="562px">
        <FormRowItem>
          <StyledUpdateMultiFactorAuthenticationNote>
            {messages?.profile?.recoveryCode?.note}
          </StyledUpdateMultiFactorAuthenticationNote>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <StyledCautionTextContainer>
            <StyledCautionIcon />
            <StyledCautionText>
              {messages?.profile?.recoveryCode?.cautionNote}
            </StyledCautionText>
          </StyledCautionTextContainer>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem alignItems="center" justifyContent="center" gap="32px">
          {recoveryCodeConfig?.data?.records?.map(
            (item: { id: Id; code: string }) => (
              <StyledRecoverCodeText key={item.id}>{item?.code}</StyledRecoverCodeText>
            ),
          )}
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem
          alignItems="center"
          justifyContent="center"
          gap="32px"
          padding="12px 0 0 0"
        >
          <Button
            variant="contained"
            color="info"
            label={messages?.profile?.recoveryCode?.download}
            onClick={handleDownloadRecoveryCode}
          />
          <Button
            variant="contained"
            color="info"
            label={messages?.profile?.recoveryCode?.copy}
            onClick={handleCopyRecoveryCode}
          />
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <StyledFormControlLabel
            control={(
              <Checkbox
                value={save}
                onChange={() => setSave((prev) => !prev)}
              />
            )}
            label={messages.profile.recoveryCode.savedCheckBox}
          />
        </FormRowItem>
      </FormRow>
      <FormRow justifyContent="end" mb={0}>
        <Button
          variant="contained"
          color="primary"
          disabled={!save}
          label={messages?.profile?.recoveryCode?.finishSetupButton}
          onClick={onSuccess}
        />
      </FormRow>
    </Form>
  );
};

export default RecoveryCodeForm;
