import React from 'react';
import styled from 'styled-components';
import classnames from '../../../utils/classnames';
import { getClassName } from '../../utils';
import Styles from '../../Styles';
import IconUp from './IconUp';
import IconDown from './IconDown';

const Wrap = styled.div`
  width: ${Styles.getStyle('header', 'iconWidth')}px;
  height: ${Styles.getStyle('header', 'iconHeight')}px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, .04);
  }
`;

type SorterDirection = 'ASC' | 'DESC';

type SorterProps = {
  onChange?: (sortOrder: SorterDirection) => void;
  sortOrder?: SorterDirection;
  defaultSortOrder?: SorterDirection;
  sortDirections?: SorterDirection[];
  className?: string;
  style?: React.CSSProperties;
};

const Sorter: React.FC<SorterProps> = (props) => {
  const {
    className = '',
    onChange,
    sortOrder,
    defaultSortOrder,
    sortDirections,
    ...restProps
  } = props;
  const getOrderIndex = React.useCallback(
    (order: SorterDirection) => sortDirections.indexOf(order) ?? -1, 
    [ sortDirections ]
  );

  // -1 -> 0 -> 1 -> ... -> sortDirections.length - 1
  const getNextOrderIndex = React.useCallback(
    (prevOrder: number = -1) => {
      const { length } = sortDirections;

      if (length === prevOrder + 1) {
        return -1;
      }

      return prevOrder + 1;
    }, 
    [ sortDirections ]
  );

  const [ order, setOrder ] = React.useState<number>(getOrderIndex(defaultSortOrder));

  React.useEffect(() => {
    if (sortOrder !== undefined) {
      setOrder(getOrderIndex(sortOrder));
    }
  }, [ sortOrder, getOrderIndex ]);

  const handleSorterClick = () => {
    const nextOrder = getNextOrderIndex(order);

    setOrder(nextOrder);

    onChange && onChange(sortDirections[nextOrder]);    
  };

  const curOrder = sortDirections[order];

  return (
    <Wrap 
      className={classnames(
        getClassName('data-grid-column-sorter'),
        className
      )}
      {...restProps}
      onClick={handleSorterClick}
    >
      {
        sortDirections.includes('ASC') ? (
          <IconUp 
            style={{ width: '100%', height: '50%' }} 
            active={curOrder === 'ASC'} 
          />
        ) : null
      }
      {
        sortDirections.includes('DESC') ? (
          <IconDown 
            style={{ width: '100%', height: '50%' }} 
            active={curOrder === 'DESC'} 
          />
        ) : null
      }
    </Wrap>
  );
};

Sorter.defaultProps = {
  sortDirections: [ 'ASC', 'DESC' ],
};

export default Sorter;
