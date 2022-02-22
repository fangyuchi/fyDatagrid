import React from 'react';
import classnames from '../../../../../utils/classnames';
import { getClassName } from '../../../../utils';
import './styles.scss';

export type DropdownContentProps = {
  variant?: 'basic' | 'select';
  options?: Array<{ value: string, label: string }>;
  optionRender?: (item: { value: string, label: string }) => React.ReactNode;
  onSelectOption?: (value: { value: string, label: string }) => void;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
};

const DropdownContent: React.ForwardRefRenderFunction<any, DropdownContentProps> = ({
  variant = 'basic',
  options,
  optionRender,
  onSelectOption,
  style,
  className = '',
  children
}, ref) => {

  let content = null;

  if (variant === 'select') {
    content = Array.isArray(options) && options.length ? (
      <>
        {
          options.map(option => {
            const { value, label } = option;

            return (
              <div 
                key={value} 
                className={getClassName('dropdown-content-option')}
                onClick={() => onSelectOption?.(option)}
              >
                {optionRender ? optionRender(option) : label}
              </div>
            );
          })
        }
      </>
    ) : null;
  } else {
    content = children;
  }

  return (
    <div 
      ref={ref}
      style={style}
      className={(
        classnames(getClassName('dropdown-content'), className)
      )}
    >
      {content}
    </div>
  );
};

export default React.forwardRef(DropdownContent);
