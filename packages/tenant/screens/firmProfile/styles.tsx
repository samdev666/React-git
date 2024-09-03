import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import styled, { css } from "styled-components";
import {
  baseFontSize,
  fontSize,
  fontWeight,
} from "@wizehub/common/theme/style.typography";
import {
  brandColour,
  greyScaleColour,
  otherColour,
} from "@wizehub/common/theme/style.palette";
import { respondTo } from "@wizehub/common/theme/style.layout";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export const StyledGridImageContainer = styled(Grid)`
  padding: 24px 27px !important;
  border: 1px solid ${brandColour.primary80} !important;
  border-radius: 10px !important;
  width: 100%;
  height: 100%;
  min-height: 213px;
  max-width: 213px;
  display: flex;
  align-items: center;
`;

export const StyledRedDeleteIcon = styled(DeleteOutlineOutlinedIcon)`
  color: ${otherColour?.errorDefault} !important;
`;

export const StyledGridCircleContainer = styled(Grid)`
  flex: 1;
  /* height: 100%; */
  height: 157px;
  width: auto;
  border: 1px dashed ${brandColour.primary100} !important;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  display: flex;
`;

export const StyledDetailChildren = styled(Grid)`
  display: flex;
  gap: 32px !important;
  padding: 24px !important;
  ${respondTo.mdDown} {
    padding: 14px !important;
  }
`;

export const StyledFirmDetailImage = styled.img`
  width: 90%;
  height: 90%;
  object-fit: cover;
  border-radius: 50%;
`;

export const StyledEditFirmDetailAvatarContainer = styled(Avatar)`
  height: 120px !important;
  width: 120px !important;
  font-size: 60px !important;
  cursor: pointer !important;
`;

export const StyledEditFirmDetailText = styled(Typography)`
  font-weight: ${fontWeight.regular} !important;
  font-size: ${fontSize.b1} !important;
  color: ${greyScaleColour.grey100} !important;
  line-height: 20px !important;
`;

export const StyledFileInput = styled.input`
  display: none;
`;

export const StyledPhotoContent = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.regular} !important;
  color: ${brandColour.primaryMain} !important;
  cursor: pointer;
`;

export const StyledFirmDetailImageAndTextContainer = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  display: flex;
`;

export const StyledAccordian = styled(Accordion)`
  box-shadow: none !important;
  border: 1px solid ${greyScaleColour.grey80} !important;
  border-radius: 10px !important;
  overflow: hidden !important;
  margin-bottom: 12px !important;
`;

export const StyledAccordionSummary = styled(AccordionSummary)`
  background-color: ${greyScaleColour.grey60} !important;
  & .MuiAccordionSummary-content {
    justify-content: space-between !important;
  }
  & .MuiAccordionSummary-content.Mui-expanded {
    margin: 0 !important;
  }
`;

export const StyledAccordionDetails = styled(AccordionDetails)`
  border-top: 1px solid ${greyScaleColour.grey80} !important;
  padding: 28px 16px 16px !important;
`;

export const StyledAccordianHeading = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.regular} !important;
  color: ${greyScaleColour.grey100} !important;
  line-height: normal !important;
  ${respondTo.mdDown} {
    font-size: ${fontSize.b2} !important;
    font-weight: ${fontWeight.medium} !important;
    line-height: 18px !important;
  }
`;

export const StyledAccordianSubHeading = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${greyScaleColour.secondaryMain} !important;
  line-height: normal !important;
  ${respondTo.mdDown} {
    font-size: ${fontSize.b1} !important;
    font-weight: ${fontWeight.medium} !important;
    line-height: 18px !important;
  }
`;

export const StyledAccordianLeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const StyledAccordianRightContainer = styled.div`
  display: flex;
  margin-right: 16px;
  align-items: center;
  gap: 29px;
`;

export const StyledMissionVisionValueFooterContainer = styled(Grid)`
  display: flex;
  align-items: center;
`;

export const StyledCautionTextContainer = styled.div`
  width: 100%;
  background-color: ${otherColour.warningBg};
  display: flex;
  padding: 6px 16px;
  gap: 14px;
  border-radius: 4px;
  align-items: center;
`;

export const StyledCautionIcon = styled(WarningAmberIcon)`
  color: ${otherColour.warning} !important;
`;

export const StyledCautionText = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.medium} !important;
  line-height: 24px !important;
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledGridMvvImageContainer = styled(Grid)`
  width: 100%;
  height: 280px;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 0px 15px;
`;

export const StyledGridMvvImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const StyledProfilePictureUploadContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledPeopleNamecolumn = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledPeopleEmailcolumn = styled(Typography)`
  font-size: ${fontSize.b2} !important;
  font-weight: ${fontWeight.medium} !important;
  line-height: 18x !important;
  color: ${greyScaleColour.grey100} !important;
`;

export const StyledPhotoGridContainer = styled(Grid)`
  height: 522px;
  border: 1px solid ${brandColour.primary80};
  border-radius: 10px;
  padding: 24px;
`;

export const StyledCircleImageContainer = styled.div`
  height: 100%;
  width: 100%;
  max-height: 213px;
  max-width: 213px;
  border-radius: 50%;
  border: 2px dashed ${brandColour.primary100};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledCircledImage = styled.img`
  height: 90%;
  width: 90%;
  object-fit: cover;
  border-radius: 50%;
`;

export const StyledSecondaryCardHeading = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
  font-size: ${fontSize.h5} !important;
  color: ${greyScaleColour.grey100} !important;
`;

export const StyledMultiTabContainer = styled.div`
  display: flex;
  margin: 8px 20px 0 20px;
`;

export const StyledSecondaryCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const StyledSecondaryCardHeaderContainer = styled.div`
  display: flex;
  margin: 0px 20px;
`;

export const StyledTeamChartTeamMemberText = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledTeamChartRightContainer = styled(Grid)`
  padding: 10px 12px;
  gap: 10px;
  display: flex;
  flex-direction: column !important;
`;

export const StyledTeamChartLeftContainer = styled(Grid)`
  border-right: 1px solid ${greyScaleColour.grey80};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledTeamMemberAvatar = styled(Avatar)`
  height: 35px !important;
  width: 35px !important;
`;

export const StyledTeamMemberName = styled(Typography)`
  font-size: ${fontSize.b1} !important;
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledOrganizationChartTableColumn = styled(Grid)<{
  isLast?: boolean;
  isRotated?: boolean;
}>`
  padding: 12px 20px;
  background-color: ${greyScaleColour.grey60};
  border-bottom: 1px solid ${greyScaleColour.grey80};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 1s ease;
  transform-style: preserve-3d;
  ${({ isLast, isRotated }) =>
    !isLast &&
    !isRotated &&
    css`
      border-right: 1px solid ${greyScaleColour.grey80};
    `}
`;

export const StyledOrganizationChartDataColumn = styled(Grid)<{
  isLast?: boolean;
  isRotated?: boolean;
}>`
  padding: 28px 24px;
  display: flex;
  flex-direction: column !important;
  gap: 40px;
  transition: transform 1s ease;
  transform-style: preserve-3d;
  ${({ isLast, isRotated }) =>
    !isLast &&
    !isRotated &&
    css`
      border-right: 1px solid ${greyScaleColour.grey80};
    `}
`;

export const StyledOrganizationChartTableColumnHeading = styled(Typography)`
  font-size: ${baseFontSize} !important;
  font-weight: ${fontWeight.medium} !important;
  color: ${brandColour.primaryDark} !important;
  text-align: center !important;
`;

export const StyledOrganizationChartTableColumnInfoIcon = styled(
  InfoOutlinedIcon
)`
  color: ${brandColour.primaryDark} !important;
  cursor: pointer !important;
`;

export const StyledOrganisationChartStructureCard = styled(Grid)`
  padding: 16px;
  border: 1px solid ${brandColour.primary80};
  border-radius: 6px;
  position: relative;
  cursor: pointer;
`;

export const StyledOrganisationTeamAvatar = styled(Avatar)`
  height: 34px !important;
  width: 34px !important;
  position: absolute !important;
  top: -20px !important;
  left: 0 !important;
  right: 0 !important;
  margin-left: auto !important;
  margin-right: auto !important;
`;

export const StyledNameCardText = styled(Typography)`
  font-weight: ${fontWeight.medium} !important;
  font-size: ${fontSize.h5} !important;
  text-align: center !important;
  word-break: break-word !important;
`;

export const StyledNameCardRoleText = styled(Typography)`
  font-weight: ${fontWeight.light} !important;
  font-size: ${fontSize.b2} !important;
  color: ${greyScaleColour.grey90} !important;
  text-align: center !important;
  word-break: break-word !important;
`;

export const StyledProductionAccordion = styled(Accordion)`
  box-shadow: none !important;
  border: none !important;
  &::before {
    display: none;
  }
  &.Mui-expanded {
    margin: 0px !important;
  }
`;

export const StyledProductionAccordianHeading = styled(AccordionSummary)`
  color: ${brandColour.primaryDark} !important;
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
  border: 1px solid ${brandColour.primary90} !important;
  border-radius: 6px !important;
  &.Mui-expanded {
    min-height: 48px !important;
  }
  & .MuiAccordionSummary-content {
    white-space: normal;
    overflow: hidden;
    word-break: break-all;
  }
  & .MuiAccordionSummary-content.Mui-expanded {
    margin: 12px 0;
  }
`;

export const StyledProductionAccordianExpandIcon = styled(ExpandMoreIcon)`
  color: ${brandColour.primaryDark} !important;
`;

export const StyledProductionAccordionDetails = styled(AccordionDetails)`
  margin-top: 20px !important;
  display: flex;
  flex-direction: row;
  gap: 40px;
`;

export const StyledBottomDivContainer = styled.div`
  margin-bottom: 20px;
`;

export const StyledMissionVisionValueInnerDiv = styled.div`
  word-break: break-all;
`;

export const StyledNoMVVInfo = styled(Typography)`
  font-size: ${fontSize.h3} !important;
  font-weight: ${fontWeight.semiBold} !important;
`;

export const StyledNoMVVInfoContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 50px 0;
  gap: 10px;
  width: 100%;
`;

export const StyledOrganisationGridContainer = styled.div`
  position: relative;
  perspective: 1000px;
`;

export const StyledOrganisationInnerGridContainer = styled(Grid)`
  perspective: 1000px;
  position: relative;
`;

export const StyledOrganisationHeaderGridContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const StyledOrganisationFlippedCard = styled.div`
  transform: rotateY(180deg);
  transition: transform 1s ease;
`;

export const StyledFilppedCardText = styled(Typography)`
  text-align: center !important;
  font-size: ${baseFontSize} !important;
  font-weight: ${fontWeight.medium} !important;
`;
