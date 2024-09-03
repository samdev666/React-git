/* eslint-disable no-underscore-dangle */
import React, {
  forwardRef, useEffect, useImperativeHandle, useState,
} from 'react';
import {
  StyledCrossButtonContainer,
  StyledDynamicFieldContainer,
  StyledFieldItem,
  StyledFieldList,
  StyledRemoveText,
} from './styles';
import Button from '../button';
import { FormRow, FormRowItem } from '../form';
import messages from '../messages';

interface Props {
  addItemToGroup?: any;
  connectNestedField: any;
  arrayList: any;
  group: string;
  formLayout: any;
  deleteItemFromGroup?: any;
  ref?: any;
  showAddButton?: boolean;
  fieldListMarginBottom?: string;
}

export function compareKeys(key1: any, key2: any) {
  const processedKey1 = key1.replace(/\s+/g, '').toLowerCase();
  const processedKey2 = key2.replace(/\s+/g, '').toLowerCase();
  return processedKey1 === processedKey2;
}

const checkForDisplay = (
  grp: any,
  comparedValue: string,
  compareWith: string,
) => {
  if (grp?.[comparedValue]?.value?.id) {
    return grp?.[comparedValue]?.value?.id !== compareWith;
  }
  if (grp?.[comparedValue]?.id) {
    return grp?.[comparedValue]?.id !== compareWith;
  }
  if (grp?.[comparedValue]?.value) {
    return grp?.[comparedValue]?.value !== compareWith;
  }
  return grp?.[comparedValue] !== compareWith;
};

const mapFormLayout = (
  formLayout: any,
  connectNestedField: any,
  group: string,
  grp: any
) => (
  <StyledFieldItem>
    {formLayout.map((row: any) => (
      <FormRow key={row?.id}>
        {row?.map((field: any) => {
          const comparedValue = field?.props?.comparedValue;
          const compareWith = field?.props?.compareWith;
          return (
            <FormRowItem
              key={field.value}
              display={field?.props?.display === 'none'
                && checkForDisplay(grp, comparedValue, compareWith)
                ? field?.props?.display
                : 'block'}
            >
              {
                connectNestedField(
                  `${field.value.replace(/\s/g, '').toLowerCase()
                  }_${grp?._uid
                  }_${group}`,
                  {
                    label: `${field.value}`,
                    multiline: field?.props.multiline,
                    rows: field?.props.rows,
                    maxWidth: field?.props.maxWidth,
                    options: field?.props.options,
                    type: field?.props.type,
                    multiple: field?.props.multiple,
                    required: field?.props?.required,
                    disabled: field?.props?.disabled,
                    disablePast: field?.props?.disablePast,
                    minDate: field?.props?.minDate,
                    maxDate: field?.props?.maxDate,
                    views: field?.props?.views,
                    dateFormat: field?.props?.dateFormat,
                    ...field?.props,
                  },
                )(field.component)
              }
            </FormRowItem>
          );
        })}
      </FormRow>
    ))}
  </StyledFieldItem>
);

const RecursiveFieldInput: React.FC<Props> = forwardRef(({
  connectNestedField,
  arrayList,
  addItemToGroup,
  deleteItemFromGroup,
  group,
  formLayout,
  showAddButton = true,
  fieldListMarginBottom
}, ref) => {
  const [list, setList] = useState(arrayList);

  useImperativeHandle(ref, () => ({
    addItemToGroup,
  }));

  useEffect(() => {
    setList(arrayList);
  }, [arrayList]);

  const renderAllActiveForms = (
    list: any,
    formLayout: any,
    connectNestedField: any,
    deleteItemFromGroup: any,
    group: string,
  ) => list?.map((grp: any, index: number) => (
    <StyledFieldList key={grp._uid} lengthOfList={list?.length} idx={index} marginBottom={fieldListMarginBottom}>
      {mapFormLayout(formLayout, connectNestedField, group, grp)}
      {list?.length > 1
        && (
          <StyledCrossButtonContainer>
            <StyledRemoveText onClick={() => {
              deleteItemFromGroup(group, grp._uid);
            }}
            >
              {messages?.general?.remove}
            </StyledRemoveText>
          </StyledCrossButtonContainer>
        )}
    </StyledFieldList>
  ));

  return (
    <StyledDynamicFieldContainer>
      {renderAllActiveForms(
        list,
        formLayout,
        connectNestedField,
        deleteItemFromGroup,
        group,
      )}
      {showAddButton
        && (
          <Button
            variant="contained"
            label={messages?.general?.add}
            onClick={() => {
              addItemToGroup(group);
            }}
          />
        )}
    </StyledDynamicFieldContainer>
  );
});

export default RecursiveFieldInput;
