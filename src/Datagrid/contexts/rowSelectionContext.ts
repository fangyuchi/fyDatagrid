import React from 'react';
import type { RowSelection, DataGridProps } from '../dataGrid';

const initialState: {
  selectable: boolean;
  dataSource: any[];
  curpageDataSource: any[];
  selectedRows: any[];
} & Pick<RowSelection, 'selectedRowKeys' | 'type' | 'onChange' | 'onSelect' | 'onSelectAll'> & Pick<DataGridProps, 'rowKey'> = {
  selectable: false,
  rowKey: 'id',
  dataSource: [],
  curpageDataSource: [],
  selectedRows: [],
  selectedRowKeys: [],
  type: 'checkbox',
  onChange: null,
  onSelect: null,
  onSelectAll: null
};

const rowSelectionReducer = (state: typeof initialState, { type, value }) => {

  switch (type) {
    case 'select': {
      const { selected, key, record } = value;
      const newSelectedRowKeys = [ ...state.selectedRowKeys ];
      const newSelectedRows = [ ...state.selectedRows ];
      // selectedRowKeys 和 selectedRows 保持顺序一致
      const tarIndex = state.selectedRowKeys.findIndex(k => k === key);

      if (tarIndex > -1) {
        // 已经选择 && 取消选择
        if (!selected) {
          newSelectedRowKeys.splice(tarIndex, 1);
          newSelectedRows.splice(tarIndex, 1);
        }

        // 未选择 && 选择
      } else if (selected) {
        newSelectedRowKeys.push(key);
        newSelectedRows.push(record);
      }
      
      return {
        ...state,
        selectedRowKeys: newSelectedRowKeys,
        selectedRows: newSelectedRows,
      };
    }
    case 'updateState':
      return {
        ...state,
        ...value
      };
      
    default:
      return state;
  }
};

export const useRowSelectionReducer = () => {
  const [ state, dispatch ] = React.useReducer(rowSelectionReducer, initialState);

  const setters = React.useMemo(() => ({
    select: (value: { selected: boolean; key: string | number; record: any; }) => {
      dispatch({ type: 'select', value });
    },
    updateState: (diff: Partial<typeof initialState>) => {
      dispatch({ type: 'updateState', value: diff });
    },
  }), [ ]);

  return {
    state: state as typeof initialState,
    setters
  };
};

export const RowSelectionContext = React.createContext(initialState);
export const useRowSelectionContext = () => React.useContext(RowSelectionContext);

export const RowSelectionContextSetter = React.createContext<ReturnType<typeof useRowSelectionReducer>['setters']>(null);
export const useRowSelectionSetter = () => React.useContext(RowSelectionContextSetter);
