import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { greyScaleColour } from '@wizehub/common/theme/style.palette';
import {
  SearchInputContainer,
  StyledActionItem,
  StyledSearchInput,
} from './styles';
import { IconButton, InputAdornment } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface Props {
  label: string;
  connectFilter?: (
    name: string,
    extraProps?: Record<any, any>
  ) => (Filter: any) => any;
}

export const SearchInputButton: React.FC<any> = ({
  onChange,
  value,
  ...props
}) => (
  <StyledSearchInput
    {...props}
    value={value || ''}
    onChange={(e: any) => {
      if (onChange) {
        onChange(e?.target?.value);
      }
    }}
  />
);

const SearchInput: React.FC<Props> = ({ label, connectFilter }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const renderSearchInput = () => (
    <SearchInputButton
      value={searchValue}
      onChange={handleSearchChange}
      placeholder={label}
    />
  );

  return (
    <StyledActionItem>
      <SearchInputContainer data-testid="search-input">
        {connectFilter
          ? connectFilter('search', {
            autoApplyFilters: true,
            placeholder: label,
            useDebounce: true
          })(SearchInputButton)
          : renderSearchInput()}
        <SearchIcon
          fontSize="medium"
          style={{
            padding: '10px',
            paddingRight: '12px',
            color: greyScaleColour.grey100,
          }}
        />
      </SearchInputContainer>
    </StyledActionItem>
  );
};

export default SearchInput;
