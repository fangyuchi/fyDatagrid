import React from 'react';
import styled from 'styled-components';
import classnames from '../utils/classnames';
import { getClassName } from './utils';
import Pagination, { PaginationProps } from '../Pagination';
import {
  DataGridProps
} from './dataGrid';

type FooterType = {
  onPaginationChange: PaginationProps['onChange'];
  pagination: false | DataGridProps['pagination'];
  footer: DataGridProps['footer'];
  className?: string;
  style?: React.CSSProperties;
};

const FooterWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;

  .${getClassName('data-grid-footer')} {
    flex: 1;
  }

  .${getClassName('data-grid-pagination')} {
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
  }
`;

const Footer: React.FC<FooterType> = ({
  pagination,
  onPaginationChange,
  footer,
  className,
  ...restProps
}) => {

  return (
    <FooterWrap 
      className={classnames(getClassName('data-grid-footer-wrap'), className)}
      {...restProps}
    >
      <div className={classnames(getClassName('data-grid-footer'))}>
        {
          footer
        }
      </div>

      {
        pagination !== false ? (
          <Pagination 
            className={classnames(getClassName('data-grid-pagination'))}
            pagination={pagination}
            onChange={onPaginationChange}
          />
        ) : null
      }
    </FooterWrap>
  );
};

export default React.memo(Footer);
