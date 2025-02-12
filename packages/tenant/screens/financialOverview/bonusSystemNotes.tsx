import { Form, FormRow, FormRowItem } from "@wizehub/components";
import React from "react";
import messages from "../../messages";
import {
  StyledFirmWideResultsSecondaryContainerTypography,
  StyledValueTypography,
} from "../plan/budgetAndCapacity/styles";
import { StyledUnorderedItems } from "./styles";

const BonusSystemNotes = () => {
  return (
    <Form>
      <FormRow>
        <FormRowItem>
          <StyledFirmWideResultsSecondaryContainerTypography>
            {
              messages?.measure?.financialOverview?.ebidta?.bonusSystemNotesForm
                ?.proceduralNotes
            }
          </StyledFirmWideResultsSecondaryContainerTypography>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <StyledFirmWideResultsSecondaryContainerTypography>
            {
              messages?.measure?.financialOverview?.ebidta?.bonusSystemNotesForm
                ?.guidelines
            }
          </StyledFirmWideResultsSecondaryContainerTypography>
        </FormRowItem>
      </FormRow>
      <FormRow mb={0}>
        <FormRowItem>
          <StyledFirmWideResultsSecondaryContainerTypography>
            {
              messages?.measure?.financialOverview?.ebidta?.bonusSystemNotesForm
                ?.quantitaive
            }
          </StyledFirmWideResultsSecondaryContainerTypography>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <StyledUnorderedItems>
            <li>
              <StyledValueTypography>
                {
                  messages?.measure?.financialOverview?.ebidta
                    ?.bonusSystemNotesForm?.firstPoint
                }
              </StyledValueTypography>
            </li>
            <li>
              <StyledValueTypography>
                {
                  messages?.measure?.financialOverview?.ebidta
                    ?.bonusSystemNotesForm?.secondPoint
                }
              </StyledValueTypography>
            </li>
            <li>
              <StyledValueTypography>
                {
                  messages?.measure?.financialOverview?.ebidta
                    ?.bonusSystemNotesForm?.thirdPoint
                }
              </StyledValueTypography>
            </li>
            <li>
              <StyledValueTypography>
                {
                  messages?.measure?.financialOverview?.ebidta
                    ?.bonusSystemNotesForm?.fourthPoint
                }
              </StyledValueTypography>
            </li>
          </StyledUnorderedItems>
        </FormRowItem>
      </FormRow>
      <FormRow mb={0}>
        <FormRowItem>
          <StyledFirmWideResultsSecondaryContainerTypography>
            {
              messages?.measure?.financialOverview?.ebidta?.bonusSystemNotesForm
                ?.qualitative
            }
          </StyledFirmWideResultsSecondaryContainerTypography>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <StyledUnorderedItems>
            <li>
              <StyledValueTypography>
                {
                  messages?.measure?.financialOverview?.ebidta
                    ?.bonusSystemNotesForm?.first
                }
              </StyledValueTypography>
            </li>
            <li>
              <StyledValueTypography>
                {
                  messages?.measure?.financialOverview?.ebidta
                    ?.bonusSystemNotesForm?.second
                }
              </StyledValueTypography>
            </li>
            <li>
              <StyledValueTypography>
                {
                  messages?.measure?.financialOverview?.ebidta
                    ?.bonusSystemNotesForm?.third
                }
              </StyledValueTypography>
            </li>
            <li>
              <StyledValueTypography>
                {
                  messages?.measure?.financialOverview?.ebidta
                    ?.bonusSystemNotesForm?.fourth
                }
              </StyledValueTypography>
            </li>
          </StyledUnorderedItems>
        </FormRowItem>
      </FormRow>
      <FormRow>
        <FormRowItem>
          <StyledFirmWideResultsSecondaryContainerTypography>
            {
              messages?.measure?.financialOverview?.ebidta?.bonusSystemNotesForm
                ?.finalNote
            }
          </StyledFirmWideResultsSecondaryContainerTypography>
        </FormRowItem>
      </FormRow>
    </Form>
  );
};

export default BonusSystemNotes;
