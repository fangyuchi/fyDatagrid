import React from 'react';
import styled from 'styled-components';
import classnames from '../utils/classnames';
import { getClassName, getCellKey } from './utils';
import type { DataGridProps } from './dataGrid';
import {
  useConditionSetter,
  useConditionContext
} from './contexts/conditionContext';
import {
  useColumnSetter,
  useColumnContext
} from './contexts/columnContext';
import {
  useRowSelectionSetter,
  useRowSelectionContext
} from './contexts/rowSelectionContext';
import SelectAllCheckbox from './columnHeaders/SelectAllCheckbox';
import SelectRowCheckbox from './columnHeaders/SelectRowCheckbox';
import DefaultValues from './DefaultValues';
import Header from './Header';
import Rows from './Rows';
import Footer from './Footer';
// import Blank from './Blank';
import { getRowKey, getPageData, sortPageData, filterPageData } from './utils';
import './styles.scss';

const Scroller = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const DataGridMain: React.FC<Omit<DataGridProps, 'pagination'> & {
  pagination?: DataGridProps['pagination'] | false,
  className?: string;
  style?: React.CSSProperties;
}> = (props) => {
  const {
    frontend,
    dataSource: originDataSource = [],
    columns = [],
    rowKey = 'id',
    rowSelection,
    pagination: propPagination,
    // loading = false,
    // ----------------------------
    sort,
    defaultSort,
    onSortChange,
    // ----------------------------
    filter,
    defaultFilter,
    onFilterChange,
    // ----------------------------
    footer
  } = props;
  const scrollerRef = React.useRef<any>(null);
  const headerRef = React.useRef<any>(null);
  // 占位列的宽度，为0时表示不显示（用于列未占满容器宽度时增加一列占位列）
  const [ placeholder, setPlaceholder ] = React.useState<number>(0);
  // 用于记录是否能进行左右滚动（用于设置固定列边界的阴影）
  const [ scrolled, setScrolled ] = React.useState({ left: false, right: false });
  const conditionState = useConditionContext();
  const conditionSetters = useConditionSetter();
  const columnState = useColumnContext();
  const columnSetters = useColumnSetter();
  const rowSelectionState = useRowSelectionContext();
  const rowSelectionSetters = useRowSelectionSetter();
  const { colDefCache } = columnState;

  // 滚动回调
  const handleScroll = React.useCallback(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const { offsetWidth, scrollLeft, scrollWidth } = scroller;

    let left = false;
    let right = false;

    if (scrollLeft > 1) {
      left = true;
    }

    if (scrollWidth - offsetWidth - scrollLeft > 1) {
      right = true;
    }

    const { left: prevLeft, right: prevRight } = scrolled;
    
    if (left !== prevLeft || right !== prevRight) {
      setScrolled({
        left,
        right
      });
    }
  }, [ scrolled ]);

  // ============================================== 分页处理 ==========================================================

  // 分页
  const pagination = React.useMemo(() => {
    if (propPagination !== false) {
      return {
        total: originDataSource.length,
        ...propPagination
      };
    }

    return propPagination;
  }, [ originDataSource, propPagination ]);

  // 分页回调
  const handlePaginationChange = React.useCallback((current: number, size: number) => {
    rowSelectionSetters.updateState({
      curpageDataSource: getPageData(originDataSource, current, size)
    });

    scrollerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    if (pagination !== false && pagination?.onChange) {
      pagination.onChange(current, size);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ originDataSource, pagination ]);

  // 原始数据、分页参数、筛选/排序参数变化监听，变化时重新计算当前页数据
  React.useEffect(() => {
    rowSelectionSetters.updateState({
      curpageDataSource: (() => {
        if (!frontend) {
          return originDataSource;
        }

        let cloneDataSource = sortPageData([ ...originDataSource ], conditionState.sort, columns);
        cloneDataSource = filterPageData(cloneDataSource, conditionState.filter, columns);

        if (pagination === false) {
          return cloneDataSource;
        }

        const { current, pageSize } = pagination || {};
    
        return getPageData(cloneDataSource, current, pageSize);
      })()
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ 
    frontend,
    
    originDataSource, 
    columns,
    pagination,
    conditionState,
  ]);

  // 原始数据变化监听
  React.useEffect(() => {
    rowSelectionSetters.updateState({
      dataSource: originDataSource,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ originDataSource ]);

  // rowSelection变化监听
  React.useEffect(() => {
    if (rowSelection) {
      const { defaultSelectedRowKeys, selectedRowKeys } = rowSelection;
      const selectedKeys: any[] = (selectedRowKeys === undefined ? defaultSelectedRowKeys : selectedRowKeys) || [];
      const selectedRows = rowSelectionState.dataSource.filter((record, index) => selectedKeys.includes(getRowKey(rowKey, record, index)));

      rowSelectionSetters.updateState({
        selectable: true,
        rowKey,
        selectedRows, 
        selectedRowKeys: selectedKeys,
        type: rowSelection.type,
        onChange: rowSelection.onChange,
        onSelect: rowSelection.onSelect,
        onSelectAll: rowSelection.onSelectAll
      });
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ rowSelectionState.dataSource, rowSelection, rowKey ]);

  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 分页处理 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // ============================================== 拖拽处理 ==========================================================

  // 拖拽列宽结束事件
  const handleDragColumnWidthFinish = React.useCallback(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const { offsetWidth } = scroller;
    const columnsSize = columns.reduce((acc, cur) => {

      return acc + (colDefCache.get(getCellKey(cur))?.width || cur.width || DefaultValues.CELL_WIDTH);
    }, 0);

    setPlaceholder(Math.max(0, offsetWidth - columnsSize));
  }, [ columns, colDefCache ]);

  const handleDragColumnWidthStart = React.useCallback(() => {
    // 开始拖拽列宽时增加占位列的列宽以优化体验
    if (placeholder) {
      const rightFixedWidth = columns.reduce((acc, cur) => {
        return acc + (colDefCache.get(cur.dataIndex || cur.key)?.width || cur.width || DefaultValues.CELL_WIDTH);
      }, 0);
      
      setPlaceholder(rightFixedWidth + placeholder);
    }
  }, [ placeholder, columns, colDefCache ]);

  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 拖拽处理 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  // ============================================= 维护context =============================================
    
  React.useEffect(() => {

    columnSetters.updateState({
      columns: rowSelection ? [
        {
          fixed: true,
          key: getClassName('data-grid-select-header'),
          title: <SelectAllCheckbox />,
          render: (record) => <SelectRowCheckbox record={record} />,
          width: 35
        },
        ...columns
      ] : columns
    });

    setTimeout(() => {
      handleScroll();
      handleDragColumnWidthFinish();
    }, 0);
    // updateState是不变值
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ columns, rowSelection, handleScroll, handleDragColumnWidthFinish ]);

  // context初始化
  React.useEffect(() => {
    const sortControled = Reflect.has(props, 'sort');
    const filterControled = Reflect.has(props, 'filter');

    conditionSetters.setState({
      sort: sortControled ? sort : defaultSort,
      filter: filterControled ? filter : defaultFilter,
      sortControled,
      filterControled
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    
  React.useEffect(() => {
    if (Reflect.has(props, 'sort')) {
      conditionSetters.updateState({
        sort
      });
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ sort ]);

  React.useEffect(() => {
    if (Reflect.has(props, 'filter')) {
      conditionSetters.updateState({
        filter
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ filter ]);

  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 维护context ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  return (
    <div className={classnames(getClassName('data-grid'), {
      [getClassName('data-grid-left-scrolled')]: scrolled.left,
      [getClassName('data-grid-right-scrolled')]: scrolled.right
    })}>
      {/* <Spin spinning={loading}> */}
      <Scroller 
        ref={scrollerRef}
        onScroll={handleScroll}
        className={classnames(getClassName('data-grid-main'))}
      >
        <Header 
          ref={headerRef} 
          placeholder={placeholder} 
          onDragColumnWidthStart={handleDragColumnWidthStart}
          onDragColumnWidthFinish={handleDragColumnWidthFinish} 
          onSortChange={onSortChange}
          onFilterChange={onFilterChange}
        />
        <Rows 
          rowKey={rowKey} 
          placeholder={placeholder}
        />
      </Scroller>
      {/* </Spin> */}
      <Footer 
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        footer={footer}
      />
    </div>
  );
};

export default DataGridMain;
