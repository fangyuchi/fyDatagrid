import React from 'react';
import styled from 'styled-components';
import type { ColumnItem, FilterConfigType } from '../../../dataGrid';
import CheckboxListFilter from './CheckboxListFilter';
import InputFilter from './InputFilter';
import DateRange from './DateRange';
import DateTimeRange from './DateTimeRange';

export type FilterFactoryProps = {
  value?: any;
  defaultValue?: any;
  onChange?: (value: any) => void;
  hasValue?: boolean;
  onConfirm?: () => any;
} & 
Pick<ColumnItem, 'filterType'> & 
Pick<FilterConfigType, 'placeholder'> &
Pick<FilterConfigType, 'options'>;

const Wrap = styled.div`

`;

const FilterFactory: React.FC<FilterFactoryProps> = ({
  filterType,
  options,
  onConfirm,
  ...restProps
}) => {

  let el = null;

  switch(filterType) {
    case 'checkboxList':
      el = (
        <CheckboxListFilter 
          options={options}
        />
      );
      break;
    case 'input':
      el = (
        <InputFilter onConfirm={onConfirm} />
      );
      break;
    case 'dateRange':
      el = (
        <DateRange />
      );
      break;
    case 'dateTimeRange':
      el = (
        <DateTimeRange />
      );
      break;
    default:
      break;
  }

  return (
    <Wrap>
      {
        React.isValidElement(el) ? (
          React.cloneElement(el, restProps)
        ) : el
      }
    </Wrap>
  );
};

export default FilterFactory;
