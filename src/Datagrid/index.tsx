import React from 'react';
import { Spin } from 'antd';
import classnames from '../utils/classnames';
import { getClassName } from './utils';
import MultiProviders, { provide } from './MultiProviders';
import type { DataGridProps } from './dataGrid';
import {
  ConditionContext,
  ConditionContextSetter,
  useConditionReducer
} from './contexts/conditionContext';
import {
  ColumnContext,
  ColumnContextSetter,
  useColumnReducer
} from './contexts/columnContext';
import {
  RowSelectionContext,
  RowSelectionContextSetter,
  useRowSelectionReducer
} from './contexts/rowSelectionContext';
import Main from './Main';
import './styles.scss';

const DataGrid: React.FC<Omit<DataGridProps, 'pagination'> & {
  pagination?: DataGridProps['pagination'] | false,
  className?: string;
  style?: React.CSSProperties;
}> = ({
  className = '',
  style,
  loading = false,
  ...restProps
}) => {
  const {
    state: conditionState,
    setters: conditionSetters
  } = useConditionReducer();
  const {
    state: columnState,
    setters: columnSetters
  } = useColumnReducer();
  const {
    state: rowSelectionState,
    setters: rowSelectionSetters
  } = useRowSelectionReducer();

  const providers = React.useMemo(() => {
    return [
      provide(ColumnContext.Provider, columnState),
      provide(ColumnContextSetter.Provider, columnSetters),
      provide(RowSelectionContext.Provider, rowSelectionState),
      provide(RowSelectionContextSetter.Provider, rowSelectionSetters),
      provide(ConditionContextSetter.Provider, conditionSetters),
      provide(ConditionContext.Provider, conditionState),
    ];
  }, [
    columnState,
    columnSetters,
    rowSelectionState,
    rowSelectionSetters,
    conditionSetters,
    conditionState
  ]);

  return (
    <div style={style} className={classnames(getClassName('data-grid-root'), className)}>
      <MultiProviders
        providers={providers}
      >
        <Spin spinning={loading}>

          <Main 
            {...restProps}
          />
        </Spin>
          
      </MultiProviders>
    </div>
  );
};

export default DataGrid;
