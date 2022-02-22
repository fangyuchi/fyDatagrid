import React from 'react';
import { PaginationProps } from 'antd/lib/pagination';

export type SorterDirection = 'ASC' | 'DESC' | undefined;

export type FilterConfigType = {
  filterKey?: string;
  onClick?: any;
  options?: Array<{ label: string; value: string | number; }>;  
  placeholder?: string;
};

export type ColumnItem = {
  align?: 'left' | 'right' | 'center',
  className?: string;
  style?: React.CSSProperties;
  // colSpan?: number;
  dataIndex?: string;
  // defaultFilteredValue?: string[];
  // defaultSortOrder?: 'ascend' | 'descend';
  // editable?: boolean;
  key?: string;
  fixed?: 'left' | 'right' | boolean;
  render?: (data: any, record: any, index: number) => React.ReactNode;
  title?: React.ReactNode | (() => React.ReactNode);
  width?: number;

  defaultSortOrder?: SorterDirection;
  sorter?: boolean | ((recordA: any, recordB: any) => number);
  sortDirections?: SorterDirection[];

  // 筛选组件类型
  filterType?: 'input' | 'checkboxList' | 'dateRange' | 'dateTimeRange' | 'customize';
  // 筛选组件交互模式
  filterAct?: 'modal' | 'dropdown' | 'customize';
  // 筛选匹配模式
  filterMode?: 'eq' | 'like' | 'contain' | 'between' | 'callback';
  // filterMode===callback时调用的筛选函数
  filterCallback?: (value: any, filter: any) => any[];
  // filterType===customize时的筛选组件
  filterRender?: Function;
  filterConfig?: FilterConfigType;
}; 

export type RowSelection = {
  /** 把选择框列固定在左边 */
  // fixed?: boolean;
  /** 当数据被删除时仍然保留选项的 key */
  // preserveSelectedRowKeys?: boolean;
  /** 指定选中项的 key 数组，需要和 onChange 进行配合 */
  selectedRowKeys?: string[];
  defaultSelectedRowKeys?: RowSelection['selectedRowKeys'];
  type?: 'checkbox' | 'radio';
  onChange?: (selectedRowKeys: RowSelection['selectedRowKeys'], selectedRows: any[]) => void;
  onSelect?: (record: any, selected: boolean, selectedRows: any[], nativeEvent) => void;
  onSelectAll?: (selected: boolean, selectedRows: any[]) => void;
};

export type DataGridProps = {
  /** 前端模式表示分页、筛选都在前端实现 */
  frontend?: boolean;
    
  dataSource: any[];
  columns: ColumnItem[];
  rowKey: string | number | ((record: any, index: number) => number | string);
  rowSelection?: RowSelection;
  pagination?: {
    // position?: ('topLeft' | 'topCenter' | 'topRight' |'bottomLeft' | 'bottomCenter' | 'bottomRight')[];
  } & PaginationProps;
  loading?: boolean;

  /** ==================== 排序 =================== */
  sort?: { [ key in string ]: SorterDirection };
  defaultSort?: ColumnItem['sort'];
  onSortChange?: (sort: ColumnItem['sort']) => void;
  /** ^^^^^^^^^^^^^^^^^^^^ 排序 ^^^^^^^^^^^^^^^^^^^ */

  /** ==================== 过滤 =================== */
  filter?: { [ key in string ]: any };
  defaultFilter?: ColumnItem['filter'];
  onFilterChange?: (filter: ColumnItem['filter']) => void;
  /** ^^^^^^^^^^^^^^^^^^^^ 过滤 ^^^^^^^^^^^^^^^^^^^ */

  footer?: React.ReactNode;
};
