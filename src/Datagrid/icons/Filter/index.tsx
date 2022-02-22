import React from 'react';
import styled from 'styled-components';
import classnames from '../../../utils/classnames';
import { getClassName } from '../../utils';
import Styles from '../../Styles';
import {
  ColumnItem
} from '../../dataGrid';
import Dropdown from './Dropdown';
import Customize from './Customize';

const Wrap = styled.div({
  width: Styles.getStyle('header', 'iconWidth'),
  height: Styles.getStyle('header', 'iconHeight'),

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  color: '#bfbfbf',

  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, .04)'
  },

  [`&.${getClassName('data-grid-column-filter-active')}`]: {
    color: '#0670ff'
  },

  transition: 'all 0.3s'
});

// const Wrap = styled.div`
//   width: ${Styles.getStyle('header', 'iconWidth')}px;
//   height: ${Styles.getStyle('header', 'iconHeight')}px;

//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   cursor: pointer;
//   color: #bfbfbf;

//   &:hover {
//     background-color: rgba(0, 0, 0, .04);
//   }

//   &.${getClassName('data-grid-column-filter-active')} {
//     color: #0670ff;
//   }

//   transition: all 0.3s;
// `;

type FilterProps = {
  value?: any;
  onChange?: (value: any) => void;
  className?: string;
  style?: React.CSSProperties;
  // active?: boolean;
} & Pick<ColumnItem, 'filterAct' | 'filterType' | 'filterRender' | 'filterConfig'>;

const formatValue = value => {
  const valueType = typeof(value);

  if (valueType === 'string') {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value.length ? value : null;
  }

  return value;
};

const Filter: React.FC<FilterProps> = ({
  value,
  onChange,
  className,
  filterAct,
  filterType,
  filterRender,
  filterConfig,
  ...restProps
}) => {
  const [ createKey, setCreateKey ] = React.useState(0);

  const handleReGenerate = () => {
    setCreateKey(createKey + 1);
  };

  const {
    onClick,
    options,
    placeholder
  } = filterConfig || {};

  const handleClick = (...args) => {
    onClick && (onClick as Function)(...args);
  };

  const hasValue = !!formatValue(value);

  const el = (
    <Wrap 
      className={classnames(
        getClassName('data-grid-column-filter'),
        {
          [getClassName('data-grid-column-filter-active')]: hasValue
        },
        className
      )}
      {...restProps}
      onClick={handleClick}
    >
      <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
        <path d="M349 838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V642H349v196zm531.1-684H143.9c-24.5 0-39.8 26.7-27.5 48l221.3 376h348.8l221.3-376c12.1-21.3-3.2-48-27.7-48z"></path>
      </svg>
    </Wrap>
  );

  if (filterAct === 'dropdown') {
    return (
      <Dropdown 
        key={createKey}
        onReGenerate={handleReGenerate}
        filterType={filterType}
        options={options}
        value={value}
        onChange={onChange}
        // hasValue={hasValue}
        placeholder={placeholder}
      >
        {el}
      </Dropdown>
    );
  } else if (filterAct === 'customize') {
    return (
      <Customize 
        // key={createKey}
        // onReGenerate={handleReGenerate}
        filterIcon={el}
        value={value}
        onChange={onChange}
      >
        {filterRender()}
      </Customize>
    );
  }

  return el;
};

Filter.defaultProps = {
  filterAct: 'dropdown',
  filterType: 'input',
  filterConfig: {}
};

export default Filter;
