import React from 'react';
import styled from 'styled-components';
import classnames from '../utils/classnames';
import { getClassName } from './utils';
import {
  useRowSelectionContext
} from './contexts/rowSelectionContext';
import type { DataGridProps } from './dataGrid';
import Row from './Row';
import Blank from './Blank';

const Content = styled.div`
  // TODO: 去掉height会有问题哦
  // height: 0;
`;

type RowsProps = {
  rowKey: DataGridProps['rowKey'];
  placeholder?: number;
};

const Rows: React.FC<RowsProps> = ({
  rowKey,
  placeholder
}) => {
  const { curpageDataSource: dataSource } = useRowSelectionContext();

  const records = React.useMemo(() => {
    return dataSource.map((record, index) => {
      const key = typeof(rowKey) === 'function' ? rowKey(record, index) : record[rowKey];

      // TODO: 这个index传进去的话，筛选之后也会导致重新渲染，或许可以考虑在Row组件内部去获取下标
      return <Row key={key} recordIndex={index} data={record} placeholder={placeholder} />;
    })
  }, [ dataSource, placeholder, rowKey ]);

  const empty = !records?.length;

  return (
    <Content 
      className={classnames(getClassName('data-grid-content'))}
      style={empty ? {
        position: 'sticky',
        left: 0
      } : undefined}
    >
      {
        empty ? <Blank /> : records
      }
    </Content>
  );
};

export default React.memo(Rows);
