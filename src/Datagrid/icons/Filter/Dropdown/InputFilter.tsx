import React from 'react';
import styled from 'styled-components';
import { Input } from 'antd';
import classnames from '../../../../utils/classnames';
import { getClassName } from '../../../utils';

const Wrap = styled.div`

`;

type InputFilterProps = {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  onConfirm?: () => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
};

const InputFilter: React.FC<InputFilterProps> = (props) => {
  const {
    value,
    defaultValue,
    onChange,
    onConfirm,
    className,
    placeholder,
    ...restProps
  } = props;
  const [ stValue, setStValue ] = React.useState(defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setStValue(value);
    }
  }, [ value ]);

  const handleChange = (e) => {
    const { value: newValue } = e.target;

    setStValue(newValue);
    onChange && onChange(newValue);
  };

  return (
    <Wrap
      className={classnames(
        getClassName('data-grid-filter-dropdown-input'),
        className
      )}
      {...restProps}
    >
      <Input
        value={stValue}
        onChange={handleChange}
        onPressEnter={onConfirm}
        allowClear
        placeholder={placeholder}
      />
    </Wrap>
  );
};

export default InputFilter;
