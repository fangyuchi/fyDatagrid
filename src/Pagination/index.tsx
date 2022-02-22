import React from 'react';
import { Pagination as AntPagination, Select } from 'antd';
import {
  getClassName
} from '../utils';
import classnames from '../utils/classnames';
import type { DataGridProps } from '../DataGrid/dataGrid';
import './styles.scss';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 30;
export const pageSizeOptions = [ 15, 30, 50, 100 ];

export type PaginationProps = {
  pagination: DataGridProps['pagination'];
  onChange: (current: number, size: number) => void;
  className?: string;
  style?: React.CSSProperties;
};

const Pagination: React.FC<PaginationProps> = ({ 
  pagination = {}, 
  onChange,
  className = '',
  style
}) => {
  const { pageSize = DEFAULT_PAGE_SIZE, current = DEFAULT_PAGE } = pagination;
  const [ stPageSize, setStPageSize ] = React.useState(pageSize);
  const [ stCurrent, setStCurrent ] = React.useState(current);

  React.useEffect(() => {
    if (pagination.pageSize !== undefined) {
      setStPageSize(pagination.pageSize || DEFAULT_PAGE_SIZE);
    }
    
    if (pagination.current !== undefined) {
      setStCurrent(pagination.current || DEFAULT_PAGE);
    }
  }, [ pagination ]);

  const handlePageSizeChange = (size) => {
    onChange && onChange(current, size);

    setStPageSize(size);
    setStCurrent(current);
  };

  const handleChange = (currentPage, size) => {
    onChange && onChange(currentPage, size);

    setStPageSize(size);
    setStCurrent(currentPage);
  };

  return (
    <div style={style} className={classnames(getClassName('pagination'), className)}>
      <AntPagination
        pageSizeOptions={pageSizeOptions as any}
        showSizeChanger
        size="small"
        simple
        pageSize={stPageSize}
        current={stCurrent}
        onChange={handleChange}
        {...pagination}
      />
      <div style={{ marginLeft: 8 }}>
        <Select value={`${stPageSize}`} size="small" onChange={handlePageSizeChange}>
          {pageSizeOptions.map((size) => (
            <Select.Option key={size} value={`${size}`}>
              {size}条
            </Select.Option>
          ))}
        </Select>
        <span> / 页</span>
      </div>
    </div>
  );
};

export default Pagination;
