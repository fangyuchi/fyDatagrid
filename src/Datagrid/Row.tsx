import React from 'react';
import styled from 'styled-components';
import classnames from '../utils/classnames';
import { getClassName } from './utils';
import {
  splitColumnsByFixed,
  getCellKey
} from './utils';
import DefaultValues from './DefaultValues';
import Cell from './Cell';
import {
  useColumnContext
} from './contexts/columnContext';
import {

} from './contexts/rowSelectionContext';

const RowWrap = styled.div<{ fixed: boolean; }>`
  display: flex;
  width: max-content;
  // border: 1px solid #6a9;
  border-bottom: 1px solid #f0f0f0;

  transform: 0.3;

  .${getClassName('data-grid-cell-wrap')} {
    background-color: #fff;
  }

  &:hover {
    .${getClassName('data-grid-cell-wrap')} {
      background-color: #f7f7f7;
    }
  }

  ${({ fixed }) => {

    return fixed ? `
      position: sticky;
      top: 0;
      // background-color: #ffe0ff;
      z-index: 11;
    ` : '';
  }}
`;

export type RowProps = {
  fixed?: boolean;
  data: any;
  recordIndex: number;
  style?: React.CSSProperties;
  className?: string;
  placeholder?: number;
};

const Row: React.FC<RowProps> = ({
  fixed = false,
  data,
  recordIndex,
  style,
  className = '',
  placeholder
}) => {
  const { columns, colDefCache } = useColumnContext();

  const cells: React.ReactNode[] = React.useMemo(() => {

    const {
      leftFixed,
      rightFixed,
      unFixed
    } = splitColumnsByFixed(columns);
    const leftFixedLength = leftFixed.length;
    const unFixedLength = unFixed.length;

    let curScrollThresholdLeft = 0;
    const totalScrollThresholdRight = rightFixed.reduce((acc, item) => {
      const { key, dataIndex, width = DefaultValues.CELL_WIDTH } = item;

      const cellKey = getCellKey(item);
      const cacheWidth = colDefCache.get(cellKey)?.width;
      const resWidth = cacheWidth || width;

      return acc + (Number(resWidth) || 0);
    }, 0);

    let curScrollThresholdRight = totalScrollThresholdRight;

    return leftFixed.concat(unFixed).concat(rightFixed).map((col, index) => {
      const { key, dataIndex, render, width = DefaultValues.CELL_WIDTH, className, title, ...rest } = col;
      const { fixed } = rest;
      const cellKey = getCellKey(col);
      const cacheWidth = colDefCache.get(cellKey)?.width;
      const resWidth = cacheWidth || width;

      let boxShadow: any = false;
      let scrollThreshold = 0;
      let showPlaceholder = false;

      if (fixed) {
        if (fixed === 'right') {
          curScrollThresholdRight -= (Number(resWidth) || 0);
          scrollThreshold = curScrollThresholdRight;
        } else {
          scrollThreshold = curScrollThresholdLeft;
          curScrollThresholdLeft += (Number(resWidth) || 0);
        }
      }

      if (index === (leftFixedLength - 1)) {
        boxShadow = 'left';
      } else if (index === (leftFixedLength + unFixedLength)) {
        boxShadow = 'right';
      } 
      
      if (index === (leftFixedLength + unFixedLength - 1)) {
        showPlaceholder = true;
      }

      const fixDirection = (fixed === 'right') ? 'right' : 'left';

      return [
        <Cell 
          data-field={getClassName(cellKey)}
          data-fixed={fixed ? fixDirection : false}
          data-index={index}
          scrollThreshold={scrollThreshold}
          width={resWidth}
          className={classnames(
            className,
            {
              [getClassName(`data-grid-cell-boxshadow-${boxShadow}`)]: boxShadow
            }
          )}
          {...rest}
          key={cellKey} 
          render={render}
          record={data}
          dataIndex={dataIndex}
          recordIndex={recordIndex}
        />,
        showPlaceholder && placeholder ? (
          <Cell 
            width={placeholder}
            key={getClassName('data-grid-cell-placeholder')}
            className={getClassName('data-grid-cell-placeholder')}
          />
        ) : null
      ];
    })
  }, [ columns, colDefCache, data, placeholder, recordIndex ]);

  return (
    <RowWrap 
      fixed={fixed} 
      style={style}
      className={classnames(getClassName('data-grid-row'), className)}
    >
      {
        cells
      }
    </RowWrap>
  );
};

export default React.memo(Row);
