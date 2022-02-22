import {
  getClassName,
  getField
} from '../utils';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE
} from '../Pagination';
import type { ColumnItem, SorterDirection } from './dataGrid';
import DefaultValues from './DefaultValues';

export {
  getClassName,
  getField
};

export const getRowKey = (rowKey: string | number | ((record: any, index: number) => string | number), record, index: number) => {
  if (!rowKey || !record) {
    return '';
  }

  if (typeof(rowKey) === 'string') {
    return record[rowKey];
  }

  if (typeof(rowKey) === 'function') {
    return rowKey(record, index);
  }

  return '';
};

export const getCellKey = (column: ColumnItem) => {
  if (!column) {
    return '';
  }

  const { dataIndex, key } = column;
  
  return (key || dataIndex) as string;
};

export const getPageData = (
  list: any[],
  current: number = DEFAULT_PAGE,
  size: number = DEFAULT_PAGE_SIZE,
  // total: number
) => {
  if (!Array.isArray(list)) {
    return [];
  }

  return [ ...list ].splice(
    (current - 1) * size,
    size
  );
};

// 执行排序，改变原数组，返回引用   
export const sortPageData = (
  list: any[],
  sort: {
    [ key in string ]: SorterDirection
  },
  columns: ColumnItem[]
) => {
  // TODO: 先只支持单列排序
  if (sort) {
    const key = Object.keys(sort)[0];
    const order = sort[key];
  
    if (key && Array.isArray(columns)) {
      const targetSorter = columns.find(column => getCellKey(column) === key)?.sorter;
  
      if (typeof(targetSorter) === 'function') {
        if (order === 'ASC') {
          list.sort(targetSorter);
        } else if (order === 'DESC') {
          list.sort((...args) => -(targetSorter as Function)(...args));
        }
      }
    }
  }

  return list;
};

// 执行过滤
export const filterPageData = (
  list: any[],
  filter: {
    [ key in string ]: any
  },
  columns: ColumnItem[]
) => {
  if (!filter || !(Array.isArray(list) && list.length)) {
    return list;
  }

  const filterKeys = Object.keys(filter).filter(k => {
    if (filter[k] === undefined || filter[k] === null) {
      return false;
    }

    return true;
  });

  if (!filterKeys.length) {
    return list;
  }

  const res = [];
  const filterConfigs = columns.filter(column => {
    return filterKeys.includes(getCellKey(column));
  });

  list.forEach(item => {
    let matched = true;
    let curIndex = 0;
    const { length } = filterConfigs;

    while (matched && (curIndex < length)) {
      const {
        filterCallback,
        filterMode = 'eq',
        filterConfig = {}
      } = filterConfigs[curIndex];
      const { filterKey } = filterConfig;
      const curFieldKey = filterConfigs[curIndex].dataIndex;
      const itemValue = getField(item, filterKey || curFieldKey);
      const filterValue = filter[getCellKey(filterConfigs[curIndex])];

      switch(filterMode) {
        case 'eq':
          if (!((itemValue || '') === (filterValue || ''))) {
            matched = false;
          }
          break;
        case 'like':
          if (!((itemValue || '').includes(filterValue || ''))) {
            matched = false;
          }
          break;
        case 'contain':
          if (Array.isArray(filterValue) && filterValue.length && !((filterValue).includes(itemValue))) {
            matched = false;
          }
          break;
        case 'between':
          if (Array.isArray(filterValue)) {
            if (!(((filterValue[0] || '') <= itemValue) && ((filterValue[1] || '') >= itemValue))) {
              matched = false;
            }
          } 
          break;
        case 'callback':
          if (!(filterCallback(itemValue, filterValue))) {
            matched = false;
          }
          break;
        default:
          break;
      }

      curIndex += 1;
    }

    if (matched) {
      res.push(item);
    }
  });

  return res;
};

export const getCellWidth = (width: string) => {
  const nw = parseInt(width);

  return isNaN(nw) ? DefaultValues.CELL_WIDTH : nw;
};

export const splitColumnsByFixed = (columns: ColumnItem[]) => {
  const leftFixed: ColumnItem[] = [];
  const rightFixed: ColumnItem[] = []
  const unFixed: ColumnItem[] = [];

  columns.forEach(column => {
    const { fixed } = column;

    if (fixed) {
      if (fixed === 'right') {
        rightFixed.push(column);
      } else {
        leftFixed.push(column);
      }
    } else {
      unFixed.push(column);
    }
  });

  return {
    leftFixed,
    rightFixed,
    unFixed
  };
};

/** 获取跟节点 */
export const findDataGridRoot = (ele: Element) => {
  return ele.closest(`.${getClassName('data-grid-root')}`) as HTMLElement;
};

/** 获取Header节点 */
export const findDataGridHeader = (ele: Element) => {
  return ele.closest(`.${getClassName('data-grid-header-wrap')}`) as HTMLElement;
};
