import React from 'react';
import styled from 'styled-components';
import { getClassName } from './utils';
import classnames from '../utils/classnames';
import Styles from './Styles';
import type { ColumnItem } from './dataGrid';
import DefaultValues from './DefaultValues';

export type CellProps = {
  children?: React.ReactNode;
  fixed?: boolean | 'left' | 'right';
  style?: React.CSSProperties;
  className?: string;
  // 
  scrollThreshold?: number;

  record?: any;

  recordIndex?: number;
} & Pick<ColumnItem, 
'align' 
| 'className' 
| 'fixed' 
| 'width'
| 'render'
| 'dataIndex'
>;

// ${({ width = DefaultValues.CELL_WIDTH }) => {
//   return typeof(width) === 'number' ? `width: ${width}px;` : (width || 'unset');
// }};
const CellWrap = styled.div<{ 
} & Pick<CellProps, 'align' | 'fixed' | 'width'>>`
  width: ${Styles.getStyle('cell', 'width')}px;
  // height: ${Styles.getStyle('cell', 'height')}px;
  // line-height: ${Styles.getStyle('cell', 'height')}px;
  display: flex;
  align-items: center;

  flex-shrink: 0;
  padding: ${Styles.getStyle('cell', 'padding')};
  // border: 1px solid #aaa;

  // border-bottom: 1px solid #f0f0f0;

  transform: 0.3;

  ${({ fixed = false }) => {

    return fixed ? `
      position: sticky;
      z-index: 10;
    ` : '';
  }}
`;

const Cell: React.FC<CellProps> = ({
  children,
  className = '',
  fixed,
  style,
  scrollThreshold = 0,
  width = DefaultValues.CELL_WIDTH,
  render,
  dataIndex,
  record,
  recordIndex,
  ...restProps
}) => {
  const thresholdStyle = fixed ? { [(fixed === 'right') ? 'right' : 'left']: scrollThreshold } : null;

  return (
    <CellWrap 
      className={classnames(getClassName('data-grid-cell-wrap'), className)}
      fixed={fixed}
      style={{
        ...thresholdStyle,
        ...style,
        width: typeof(width) === 'number' ? width : (width || 'unset')
      }}
      {...restProps}
    >
      <div className={getClassName('data-grid-cell')}>
        {
          typeof(render) === 'function' ? (
            <>
              {render(dataIndex ? record[dataIndex] : record, record, recordIndex)}
            </>
          ) : (record ? record[dataIndex] : null)
        }
      </div>
      
    </CellWrap>
  );
};

export default React.memo(Cell);
