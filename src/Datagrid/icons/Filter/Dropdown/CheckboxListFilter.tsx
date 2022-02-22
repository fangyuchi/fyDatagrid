import React from 'react';
import styled from 'styled-components';
import { Checkbox } from 'antd';
import classnames from '../../../../utils/classnames';
import { getClassName } from '../../../utils';
import { FilterConfigType } from '../../../dataGrid';

type CheckboxListFilterProps = {
  options: FilterConfigType['options'];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
  style?: React.CSSProperties;
};

const Wrap = styled.div`

  .ant-checkbox-group {
    display: flex;
    flex-direction: column;
    max-height: 300px;
    overflow-y: auto;

    .ant-checkbox-wrapper {
      margin: 0;
      padding: 0 4px;

      &:hover {
        background-color: rgba(6, 112, 255, 0.05);
      }
    }
  }
`;

/**
 * 
 * @param param0 
 * @returns 
 */
const CheckboxListFilter: React.FC<CheckboxListFilterProps> = (props) => {
  const {
    options,
    className,
    value,
    defaultValue,
    onChange,
    ...restProps
  } = props;
  const [ stValue, setStValue ] = React.useState(defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setStValue(value);
    }
  }, [ value ]);

  const handleCheck = (vals) => {
    setStValue(vals);
    onChange && onChange(vals);
  };

  return (
    <Wrap
      className={classnames(
        getClassName('data-grid-filter-dropdown-checkbox-list'),
        className
      )}
      {...restProps}
    >
      <Checkbox.Group value={stValue} onChange={handleCheck}>
        {
          options.map(item => {
            return (
              <Checkbox key={item.value} value={item.value}>{item.label}</Checkbox>
            );
          })
        }
      </Checkbox.Group>
    </Wrap>
  );
};

export default CheckboxListFilter;
