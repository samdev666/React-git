import { css, styled } from "styled-components";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { Select, Typography } from "@mui/material";
import { fontSize, fontWeight } from "@wizehub/common/theme/style.typography";
import {
  brandColour,
  greyScaleColour,
  otherColour,
} from "@wizehub/common/theme/style.palette";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import { respondTo } from "@wizehub/common/theme/style.layout";
import { SvgIconProps } from "@mui/material/SvgIcon";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export const StyledTableContainer = styled(TableContainer)``;

export const StyledTable = styled(Table)``;

export const StyledTableHead = styled(TableHead)``;
export const StyledTableBody = styled(TableBody)``;
export const StyledTableRow = styled(TableRow)<{ borderTop?: string }>`
  border-top: ${(props) => props?.borderTop};
  th:first-child {
    padding-left: 20px !important;
  }
  th:last-child {
    padding-right: 0 !important;
  }
  th {
    font-weight: ${fontWeight.medium};
    padding-left: 0;
    padding-right: 40px;
  }
  td {
    padding-left: 0;
  }
  td:first-child {
    padding-left: 20px !important;
  }

  ${respondTo.mdDown} {
    th {
      font-weight: ${fontWeight.medium};
    }
  }
`;
export const StyledTableCell = styled(TableCell)`
  font-size: ${fontSize.b1} !important;
`;

export const StyledCellContainer = styled.div`
  display: flex;
  column-gap: 8px;
  line-height: 20px;
  align-items: center;
`;

export const StyledLoadmoreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 64px;
`;
export const StyledLoadmoreCta = styled(Typography)`
  font-size: ${fontSize.b3};
  color: ${brandColour.primaryMain};
  cursor: pointer;
`;

export const StyledResponsiveIcon = <P extends SvgIconProps>(
  IconComponent: React.ComponentType<P>
) => {
  const StyledIcon = styled(IconComponent)`
    font-size: 22px !important;
    ${respondTo.mdDown} {
      font-size: ${fontSize.h5} !important;
    }
  `;
  return StyledIcon;
};

export const StyledActionListContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export const StyledActionItem = styled.div`
  color: ${greyScaleColour.secondaryMain} !important;
  cursor: pointer;
`;

export const StyledNoDataInfoContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 50px 0;
`;

export const StyledNoDataInfo = styled(Typography)`
  font-size: ${fontSize.h5} !important;
  font-weight: ${fontWeight.medium} !important;
`;

export const StyledPaginationContainer = styled.div`
  margin: 14px 0;
  display: flex;
  justify-content: space-between;
  ${respondTo.mdDown} {
    margin: 12px 0;
  }
`;

export const StyledPaginationMainContainer = styled.div`
  display: flex;
  margin-left: auto;
  padding: 0 24px;
  gap: 32px;
`;

export const StyledPaginationLimitContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;
export const StyledInfo = styled(Typography)`
  color: ${greyScaleColour.grey100};
`;

export const StyledSelectPage = styled(Select)`
  & .MuiSelect-select {
    padding: 8px 16px;
    padding-right: 40px !important;
    color: ${greyScaleColour.secondaryMain} !important;
  }

  & .MuiOutlinedInput-notchedOutline {
    border: none !important;
  }

  & .MuiSvgIcon-root {
    color: ${greyScaleColour.secondaryMain} !important;
  }
`;

export const StyledPagesContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const StyledPaginationShowContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledPageContainer = styled.div<{ active?: boolean }>`
  display: flex;
  padding: 4px 8px;
  height: 29px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  width: 24px;
  cursor: pointer;
  background: ${greyScaleColour.grey60};
  color: ${greyScaleColour.grey100};
  ${({ active }) =>
    active &&
    css`
      background: ${brandColour.primaryMain};
      color: ${greyScaleColour.grey60};
    `}
`;

export const SpaceIndicator = styled.div`
  height: 10px; /* Adjust the height of the space as needed */
  background-color: transparent; /* Set the color of the space */
`;

export const StyledVisibilityIcon = styled(VisibilityOutlinedIcon)`
  color: ${greyScaleColour.secondaryMain} !important;
`;

export const StyledEditIcon = styled(EditOutlinedIcon)<{
  active?: boolean;
}>`
  color: ${({ active }) =>
    !active ? greyScaleColour.grey80 : greyScaleColour.secondaryMain};
  /* color: ${greyScaleColour.secondaryMain} !important; */
`;

export const StyledRemoveCircleIcon = styled(RemoveCircleOutlineIcon)`
  color: ${otherColour.errorDefault} !important;
`;

export const StyledDeleteIcon = styled(DeleteOutlineOutlinedIcon)<{
  active?: boolean;
}>`
  color: ${({ active }) =>
    !active ? greyScaleColour.grey80 : otherColour.errorDefault};
`;

export const StyledArrowDropIcon = styled(ArrowDropDownIcon)`
  color: ${greyScaleColour.grey100} !important;
`;

export const StyledRemoveIcon = styled(RemoveCircleOutlineOutlinedIcon)<{
  active?: boolean;
}>`
  color: ${({ active }) =>
    !active ? greyScaleColour.grey80 : otherColour.errorDefault};
`;

export const StyledExpandableIcon = styled.div`
  height: 30px;
  width: 30px;
  background-color: ${greyScaleColour.grey70};
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
