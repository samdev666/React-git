import { IconButton, InputAdornment } from '@mui/material';
import React, { useState } from 'react';
import { DateRangePicker } from 'mui-daterange-picker';
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close';
import {
  StyledCalendarIcon,
  StyledDateRangeWrapper,
  StyledDateRangeTextField,
  StyledDateRangeTextFieldContainer,
} from './styles';

interface Props {
  label?: string;
  value?: any;
  onChange?: any;
  format?: string;
}

const MaterialDateRangePicker: React.FC<Props> = ({
  label,
  value,
  onChange,
  format,
}) => {
  const [open, setOpen] = useState(false);
  const [pickerKey, setPickerKey] = useState<number>(0);
  const toggle = () => setOpen(!open);

  const formatValue = value?.startDate && value?.endDate
    ? `${moment(value.startDate)?.format(format || 'MM/DD/YYYY')} - ${moment(
        value.endDate,
      )?.format(format || 'MM/DD/YYYY')}`
    : '';

  const handleClear = () => {
    if (onChange) {
      onChange({ startDate: null, endDate: null });
      setPickerKey((prev) => prev + 1);
    }
  };

  return (
    <StyledDateRangeWrapper>
      <StyledDateRangeTextFieldContainer>
        <StyledDateRangeTextField
          id="outlined-basic"
          label={label}
          variant="outlined"
          value={formatValue || ''}
          InputLabelProps={{
            shrink: !!formatValue,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {formatValue && (
                  <IconButton onClick={handleClear} edge="end">
                    <CloseIcon />
                  </IconButton>
                )}
                <IconButton onClick={toggle} edge="end">
                  <StyledCalendarIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </StyledDateRangeTextFieldContainer>
      <DateRangePicker
        open={open}
        key={pickerKey}
        toggle={toggle}
        onChange={(newValue) => {
          if (onChange) {
            onChange(newValue.startDate && newValue.endDate ? newValue : { startDate: null, endDate: null });
            toggle();
          }
        }}
      />
    </StyledDateRangeWrapper>
  );
};

export default MaterialDateRangePicker;
