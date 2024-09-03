import React, { useRef, useState } from "react";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { colors, greyScaleColour } from "@wizehub/common/theme/style.palette";
import {
  StyledDatePicker,
  StyledMonthContainer,
  StyledMonthText,
} from "./styles";
import {
  StyledError,
  StyledErrorContainer,
  StyledInputContainer,
  StyledLabel,
} from "../materialTextInput/styles";
import { Grid, Typography } from "@mui/material";

interface Props {
  label?: string;
  value?: string;
  onChange?: any;
  error?: string;
  disableErrorMode?: boolean;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  dateFormat?: string;
  onReadOnlyCtaClick?: () => void;
  placeholder?: string;
  containerStyle?: React.CSSProperties;
  calendarHeight?: string;
  externalLabel?: boolean;
  isCustomMonthHeader?: boolean;
  maxWidth?: string;
  minWidth?: string;
}

const calendarIconComponent = () => (
  <CalendarMonthOutlinedIcon
    style={{
      color: colors.grey100,
    }}
  />
);

const MonthHeader = (props: any) => {
  const { currentMonth, view } = props;
  if (view === "year") {
    return null;
  }
  const month = new Date(currentMonth).toLocaleDateString("en-US", {
    month: "long",
  });
  return (
    <StyledMonthContainer>
      <StyledMonthText>{month}</StyledMonthText>
    </StyledMonthContainer>
  );
};

const DateInput: React.FC<Props> = ({
  label,
  error,
  value,
  onChange,
  disableErrorMode,
  required,
  readOnly,
  disabled,
  fullWidth,
  dateFormat,
  onReadOnlyCtaClick,
  externalLabel = false,
  isCustomMonthHeader = false,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenCalendar = () => {
    setOpen(!open);
  };

  const renderDatepicker = () => (
    <StyledDatePicker
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      label={externalLabel ? "" : label}
      format={dateFormat || "DD/MM/YYYY"}
      fullWidth={fullWidth}
      disabled={disabled}
      value={value || null}
      onChange={(newValue) => {
        if (onChange) {
          onChange(newValue);
          setOpen(!open);
        }
      }}
      slotProps={{
        textField: {
          placeholder: props?.placeholder,
          required,
          error: disableErrorMode ? undefined : !!error,
          onClick: handleOpenCalendar,
        },
        desktopPaper: {
          sx: {
            ".MuiDateCalendar-root": {
              height: props?.calendarHeight,
            },
            ".MuiPickersYear-yearButton.Mui-disabled": {
              color: greyScaleColour.grey80,
            },
          },
        },
      }}
      slots={
        (isCustomMonthHeader)
          ? {
            calendarHeader: MonthHeader,
            openPickerIcon: calendarIconComponent,
          }
          : {
            openPickerIcon: calendarIconComponent,
          }
      }
    />
  );
  return (
    <StyledInputContainer maxWidth={props?.maxWidth} minWidth={props?.minWidth}>
      {externalLabel ? (
        <>
          <Grid container gap="6px">
            {label && (
              <Grid item xs={12}>
                <StyledLabel required={required}>{label}</StyledLabel>
              </Grid>
            )}
            <Grid item xs={12}>
              {renderDatepicker()}
            </Grid>
          </Grid>
          <StyledErrorContainer>
            {!disableErrorMode && (
              <StyledError variant="body2">{error}</StyledError>
            )}
          </StyledErrorContainer>
        </>
      ) : (
        <>
          {renderDatepicker()}
          {!disableErrorMode && error && (
            <StyledError variant="body2">{error}</StyledError>
          )}
        </>
      )}
    </StyledInputContainer>
  );
};

export default DateInput;
