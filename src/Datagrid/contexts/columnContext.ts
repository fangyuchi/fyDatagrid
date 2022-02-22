import React from 'react';
import type { ColumnItem } from '../dataGrid';

type ColDefCacheItem = {
  width: number;
};

const initialState: {
  columns: ColumnItem[];
  colDefCache: Map<string | number, ColDefCacheItem>;
} = {
  columns: [],
  // 保持一个引用不用变
  colDefCache: new Map()
};

const columnReducer = (state: typeof initialState, { type, value }) => {

  switch (type) {
    case 'setState':
      return value;
    case 'updateState':
      return {
        ...state,
        ...value
      };
    case 'setColDefCache': {
      const { colDefCache } = state;
      value.key && colDefCache.set(value.key, value.cache);
      return state;
    }
      
    default:
      return state;
  }
};

export const useColumnReducer = () => {
  const [ state, dispatch ] = React.useReducer(columnReducer, initialState);

  const setters = React.useMemo(() => ({
    setState: (newState: typeof initialState) => {
      dispatch({ type: 'setState', value: newState });
    },
    updateState: (diff: Partial<typeof initialState>) => {
      dispatch({ type: 'updateState', value: diff });
    },
    setColDefCache: (key: string, value: ColDefCacheItem) => {
      dispatch({ type: 'setColDefCache', value: { key, cache: value } });
    }
  }), [ ]);

  return {
    state: state as typeof initialState,
    setters
  };
};

export const ColumnContext = React.createContext(initialState);
export const useColumnContext = () => React.useContext(ColumnContext);

export const ColumnContextSetter = React.createContext<ReturnType<typeof useColumnReducer>['setters']>(null);
export const useColumnSetter = () => React.useContext(ColumnContextSetter);
