import React from 'react';
import styled from 'styled-components';
import classnames from '../../../utils/classnames';
import { getClassName } from '../../utils';

export const Wrap = styled.div`
  width: 12px;
  height: 12px;
  color: #bfbfbf;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &.${getClassName('data-grid-column-sorter-active')} {
    color: #0670ff;
  }

  transition: all 0.3s;

`;

export type IconUpProps = {
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
};

const IconUp: React.FC<IconUpProps> = ({
  active,
  className = '',
  ...restProps
}) => {

  return (
    <Wrap
      className={classnames(
        getClassName('data-grid-column-sorter-up'),
        {
          [getClassName('data-grid-column-sorter-active')]: active
        },
        className
      )}
      {...restProps}
    >
      <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
        <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"></path>
      </svg>
    </Wrap>
  );
};

export default IconUp;
