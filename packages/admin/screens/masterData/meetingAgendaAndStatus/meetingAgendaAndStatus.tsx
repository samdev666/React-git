import React, { useState } from 'react';
import { Button, CustomTabs, Stepper } from '@wizehub/components';
import { usePopupReducer } from '@wizehub/common/hooks';
import { Option } from '@wizehub/common/models';
import { Container } from '../../../components';
import {
  StyledMasterDataHeadingContainer,
  StyledMasterDataLeftHeadingContainer,
} from '../styles';
import messages from '../../../messages';
import MeetingAgenda from './agenda';
import ProgressStatus from './progressStatus';
import { StyledHeadingTypography } from '../../userManagement/styles';
import { ResponsiveAddIcon } from '../../productManagement/productManagement';

interface Props {

}

const meetingAgendaStatusTabs: Option[] = [
  {
    id: 'agenda',
    label: messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
      .subItems.meetingAgendaAndStatus.agenda,
  },
  {
    id: 'status',
    label: messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
      .subItems.meetingAgendaAndStatus.progressStatus,
  },
];

const MeetingAgendaAndStatus: React.FC<Props> = () => {
  const [activeTab, setActiveTab] = useState<'agenda' | 'status'>('agenda');

  const {
    visibility: agendaFormVisibility,
    showPopup: showAgendaForm,
    hidePopup: hideAgendaForm,
  } = usePopupReducer();

  const {
    visibility: statusFormVisibility,
    showPopup: showStatusForm,
    hidePopup: hideStatusForm,
  } = usePopupReducer();

  return (
    <Container noPadding>
      <StyledMasterDataHeadingContainer>
        <StyledMasterDataLeftHeadingContainer>
          <Stepper />
          <StyledHeadingTypography>
            {messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.meetingAgendaAndStatus.heading}
          </StyledHeadingTypography>
        </StyledMasterDataLeftHeadingContainer>
        <Button
          startIcon={<ResponsiveAddIcon />}
          variant="contained"
          color="primary"
          label={activeTab === 'agenda'
            ? messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.meetingAgendaAndStatus.agendaButtonText
            : messages.sidebar.menuItems.secondaryMenu.subMenuItems.masterData
              .subItems.meetingAgendaAndStatus.progressButtonText}
          onClick={() => (activeTab === 'agenda' ? showAgendaForm() : showStatusForm())}
        />
      </StyledMasterDataHeadingContainer>

      <CustomTabs
        tabs={meetingAgendaStatusTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'agenda'
        ? (
          <MeetingAgenda
            formVisibility={agendaFormVisibility}
            hideForm={hideAgendaForm}
          />
        )
        : (
          <ProgressStatus
            formVisibility={statusFormVisibility}
            hideForm={hideStatusForm}
          />
        )}
    </Container>
  );
};

export default MeetingAgendaAndStatus;
