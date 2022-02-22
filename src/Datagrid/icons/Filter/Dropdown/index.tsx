import React from 'react';
import styled from 'styled-components';
import {
  Button,
  Divider
} from 'antd';
import { Dropdown as AntDropdown, DropDownProps as AntDropDownProps } from 'antd';
import { getClassName } from '../../../utils';
import DropdownFilterFactory, { FilterFactoryProps } from './DropdownFilterFactory';
import DropdownContent from './DropdownContent';

type DropdownProps = {
  onReGenerate?: () => void;
} & FilterFactoryProps;

const Wrap = styled.div`
  padding: 4px 8px;

  .${getClassName('data-grid-filter-dropdown-ops')} {
    display: flex;
    justify-content: space-between;
  }
`;

const Dropdown: React.FC<DropdownProps> = ({
  onReGenerate,
  children,
  ...restProps
}) => {
  const {
    defaultValue,
    value,
    onChange,
  } = restProps;
  const [ stValue, setStValue ] = React.useState(defaultValue);
  const [ dropProps, setDropProps ] = React.useState<Partial<AntDropDownProps>>();

  React.useEffect(() => {
    if (value !== undefined) {
      setStValue(value);
    }
  }, [ value ]);

  const handleChange = (newValue) => {
    setStValue(newValue);
  };

  const handleReset = () => {
    setStValue(null);
  };

  const destoryDropdown = () => {
    setTimeout(() => {
      onReGenerate();
    }, 300);
  };

  const handleConfirm = () => {
    onChange && onChange(stValue);

    setDropProps({
      visible: false
    });

    destoryDropdown();
  };

  const handleVisibleChange = (visible) => {
    if (!visible) {
      destoryDropdown();
    }
  };

  return (
    <AntDropdown
      trigger={[ 'click' ]}
      {...dropProps}
      onVisibleChange={handleVisibleChange}
      overlay={
        <DropdownContent>
          <Wrap>
            <DropdownFilterFactory 
              {...restProps}
              onChange={handleChange}
              value={stValue}
              onConfirm={handleConfirm}
            />
            <Divider />
            <div className={getClassName('data-grid-filter-dropdown-ops')}>
              <Button
                size="small"
                type="text"
                style={{ marginRight: 4 }}
                disabled={!stValue}
                onClick={handleReset}
              >
                重置
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={handleConfirm}
              >
                确定
              </Button>
            </div>
          </Wrap>
        </DropdownContent>
      }
    >
      {children}
    </AntDropdown>
  );
};

export default Dropdown;
