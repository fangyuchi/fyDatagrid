import React from 'react';
import classnames from '../../../utils/classnames';
import { getClassName } from '../../utils';
import { Wrap, IconUpProps } from './IconUp';

const IconDown: React.FC<IconUpProps> = ({
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
        <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>
      </svg>
    </Wrap>
  );
};

export default IconDown;
