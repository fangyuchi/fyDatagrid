import React from 'react';
import type { SorterDirection } from '../dataGrid';

const initialState: {
  sort?: {
    [ key in string ]: SorterDirection
  };
  filter?: {
    [ key in string ]: any
  };
  /** sort 属性是否受控 */
  sortControled?: boolean;
  /** filter 属性是否受控 */
  filterControled?: boolean;
} = {
  sort: {},
  filter: {},
  sortControled: false,
  filterControled: false
};

const conditionReducer = (state: typeof initialState, { type, value }) => {

  switch (type) {
    case 'setState':
      return value;
    case 'updateState':
      return {
        ...state,
        ...value
      };
      
    default:
      return state;
  }
};

export const useConditionReducer = () => {
  const [ state, dispatch ] = React.useReducer(conditionReducer, initialState);

  const setters = React.useMemo(() => ({
    setState: (newState: typeof initialState) => {
      dispatch({ type: 'setState', value: newState });
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

export const ConditionContext = React.createContext(initialState);
export const useConditionContext = () => React.useContext(ConditionContext);

export const ConditionContextSetter = React.createContext<ReturnType<typeof useConditionReducer>['setters']>(null);
export const useConditionSetter = () => React.useContext(ConditionContextSetter);
