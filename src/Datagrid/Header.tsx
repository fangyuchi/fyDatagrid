import React from 'react';
import { Space } from 'antd';
import styled from 'styled-components';
import classnames from '../utils/classnames';
import { getClassName } from './utils';
import Styles from './Styles';
import {
  useColumnContext,
} from './contexts/columnContext';
import {
  useConditionContext,
  useConditionSetter
} from './contexts/conditionContext';
import { splitColumnsByFixed, getCellKey } from './utils';
import type { ColumnItem, DataGridProps, SorterDirection } from './dataGrid';
import DefaultValues from './DefaultValues';
import { CellProps } from './Cell';
import HeaderSeparator from './HeaderSeparator';
import Filter from './icons/Filter';
import Sorter from './icons/Sorter';


const HeadersWrap = styled.div`
  display: flex;
  width: max-content;
  background-color: ${Styles.getStyle('header', 'backgroundColor')};
  border-bottom: 1px solid #3296fa;

  position: sticky;
  top: 0;
  height: ${Styles.getStyle('header', 'height')}px;
  line-height: ${Styles.getStyle('header', 'height')}px;
  z-index: 11;
`;

const HeaderWrap = styled.div<{ 
  border: false | 'right' | 'left';
} & Pick<CellProps, 'align' | 'fixed' | 'width'>>`
  width: ${Styles.getStyle('cell', 'width')}px;
  padding: ${Styles.getStyle('header', 'padding')};
  display: flex;
  align-items: center;
  background-color: ${Styles.getStyle('header', 'backgroundColor')};
  flex-shrink: 0;
  position: relative;
  
  ${({ border }) => {
    return border ? `
      border-${border}: 1px solid #eee;
    ` : '';
  }}

  ${({ fixed = false }) => {

    return fixed ? `
      position: sticky;
      z-index: 10;
    ` : '';
  }}
`;

type HeaderItemProps = {
  col?: ColumnItem;
  scrollThreshold?: number;
  index?: number;
  width: number;
  border?: false | 'left' | 'right';
  boxShadow?: false | 'left' | 'right';
  className?: string;
  onDragColumnWidthStart?: () => void;
  onDragColumnWidthFinish?: () => void;

  sort?: SorterDirection;
  onSortChange?: (key: string, sort?: SorterDirection) => void;
  filter?: any;
  onFilterChange?: (key: string, filter?: any) => void;
};

const HeaderItem: React.FC<HeaderItemProps> = ({
  col,
  scrollThreshold,
  index,
  width = DefaultValues.CELL_WIDTH,
  border,
  boxShadow,
  className: propClassName,
  onDragColumnWidthStart,
  onDragColumnWidthFinish,
  sort,
  onSortChange,
  filter,
  onFilterChange
}) => {
  const { 
    key, 
    dataIndex, 
    render, 
    title, 
    className: colClassName, 
    style, 
    width: colWidth, 

    defaultSortOrder,
    sorter,
    sortDirections,

    filterAct,
    filterType,
    filterConfig,
    filterRender,

    // 这里不把所有无用的属性排除的话会传到div上面去，造成本地报错，不会影响生产环境，问题也不大
    ...rest 
  } = col || {};
  const { fixed } = rest || {};
  const cellKey = getCellKey(col);

  const fixDirection = (fixed === 'right') ? 'right' : 'left';
  const thresholdStyle = fixed ? { [fixDirection]: scrollThreshold } : null;

  const handleSort = (nextSort) => {
    onSortChange(cellKey as string, nextSort);
  };

  const handleFilter = (nextFilter) => {
    onFilterChange(cellKey as string, nextFilter);
  };

  return (
    <HeaderWrap 
      key={cellKey} 
      data-field={getClassName(cellKey)}
      data-fixed={fixed ? fixDirection : false}
      data-index={index}
      className={classnames(getClassName('data-grid-header-wrap'), propClassName, colClassName, {
        [getClassName(`data-grid-cell-boxshadow-${boxShadow}`)]: boxShadow
      })}
      style={{
        ...thresholdStyle,
        // ...style,
        width: typeof(width) === 'number' ? width : (width || 'unset')
      }}
      border={border}
      {...rest}
    >
      <div className={getClassName('data-grid-header')}>
        <span className={getClassName('data-grid-header-text')}>
          {typeof(title) === 'function' ? title() : title}
        </span>

        <Space size={4}>
          {
            sorter ? (
              <Sorter
                onChange={handleSort}
                sortOrder={sort || null}
                defaultSortOrder={defaultSortOrder}
                sortDirections={sortDirections}
              />
            ) : null
          }

          {
            (filterAct || filterType) ? (
              <Filter 
                onChange={handleFilter}
                value={filter || null}
                filterAct={filterAct}
                filterType={filterType}
                filterConfig={filterConfig}
                filterRender={filterRender}
              />
            ) : null
          }
        </Space>
        
        <HeaderSeparator 
          direction={fixDirection === 'left' ? 'right' : 'left'} 
          fieldName={cellKey as string}
          onDragStart={onDragColumnWidthStart}
          onDragFinish={onDragColumnWidthFinish}
        />
      </div>

    </HeaderWrap>
  );
};

type HeaderProps = {
  style?: React.CSSProperties;
  className?: string;
  placeholder?: number;
  onDragColumnWidthStart?: () => void;
  onDragColumnWidthFinish?: () => void;
} & Pick<DataGridProps, 'sort' | 'defaultSort' | 'onSortChange' | 'onFilterChange'>;

const Header: React.ForwardRefRenderFunction<any, HeaderProps> = ({
  className = '',
  style,
  placeholder,
  onDragColumnWidthStart,
  onDragColumnWidthFinish,

  onSortChange,
  onFilterChange
}, ref) => {
  const { columns, colDefCache } = useColumnContext();
  const { sort, filter, sortControled, filterControled } = useConditionContext();
  const conditionSetter = useConditionSetter();

  const headers: React.ReactNode[] = React.useMemo(() => {

    const {
      leftFixed,
      rightFixed,
      unFixed
    } = splitColumnsByFixed(columns);

    const leftFixedLength = leftFixed.length;
    const unFixedLength = unFixed.length;
 
    let curScrollThresholdLeft = 0;

    const totalScrollThresholdRight = rightFixed.reduce((acc, item) => {
      const { width = DefaultValues.CELL_WIDTH } = item;
      const cellKey = getCellKey(item);
      const cacheWidth = colDefCache.get(cellKey)?.width;
      const resWidth = cacheWidth || width;

      return acc + (Number(resWidth) || 0);
    }, 0);

    let curScrollThresholdRight = totalScrollThresholdRight;

    return leftFixed.concat(unFixed).concat(rightFixed).map((col, index) => {
      const { width = DefaultValues.CELL_WIDTH, fixed } = col;
      const cellKey = getCellKey(col);
      const cacheWidth = colDefCache.get(cellKey)?.width;
      const resWidth = cacheWidth || width;

      let border: any = 'right';
      let boxShadow: any = false;
      let scrollThreshold = 0;
      let showPlaceholder = false;

      if (fixed) {
        if (fixed === 'right') {
          border = 'left';
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
        // border = false;
        showPlaceholder = true;
      }

      const handleSortChange = (key, nextSort) => {
        const nextSortConfig = {
          // TODO: 先不支持多列排序
          // ...sortState,
          [key]: nextSort
        };

        // TODO: 去除undefined数据？
        onSortChange && onSortChange(nextSortConfig);

        if (!sortControled) {
          conditionSetter.updateState({
            sort: nextSortConfig
          });
        }
      };

      const handleFilterChange = (key, filterValue) => {
        const nextFilter = {
          ...filter,
          [key]: filterValue
        };

        // TODO: 去除undefined数据？
        onFilterChange && onFilterChange(nextFilter);

        if (!filterControled) {
          conditionSetter.updateState({
            filter: nextFilter
          });
        }
      };

      return [
        <HeaderItem
          key={cellKey}
          col={col}
          index={index}
          scrollThreshold={scrollThreshold}
          width={resWidth}
          border={border}
          boxShadow={boxShadow}
          onDragColumnWidthStart={onDragColumnWidthStart}
          onDragColumnWidthFinish={onDragColumnWidthFinish}
          sort={sort?.[cellKey]}
          onSortChange={handleSortChange}
          filter={filter?.[cellKey]}
          onFilterChange={handleFilterChange}
        />,
        showPlaceholder && placeholder ? (
          <HeaderItem
            key={getClassName('data-grid-header-placeholder')}
            width={placeholder}
            border={false}
            boxShadow={false}
            className={getClassName('data-grid-header-placeholder')}
            onDragColumnWidthStart={onDragColumnWidthStart}
            onDragColumnWidthFinish={onDragColumnWidthFinish}
          />
        ) : null
      ];
    })
  }, [
    columns,
    colDefCache,
    placeholder,
    onDragColumnWidthFinish,
    onDragColumnWidthStart,
    conditionSetter,
    sort,
    onSortChange,
    filter,
    onFilterChange,
    sortControled,
    filterControled
  ]);

  return (
    <HeadersWrap
      style={style}
      className={classnames(getClassName('data-grid-headers'), className)}
      ref={ref}
    >
      {
        headers
      }
     
    </HeadersWrap>
  );
};

export default React.memo(React.forwardRef(Header));
