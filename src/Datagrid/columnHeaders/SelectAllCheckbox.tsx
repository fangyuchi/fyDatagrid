import React from 'react';
import {
  Checkbox
} from 'antd';
import { getRowKey } from '../utils';
import {
  useRowSelectionContext,
  useRowSelectionSetter
} from '../contexts/rowSelectionContext';

/**
 * TODO:
 * 不考虑跨页选择
 * @returns 
 */
const SelectAllCheckbox = () => {
  const {
    selectedRows,
    curpageDataSource,
    rowKey,
    onChange,
    onSelectAll
  } = useRowSelectionContext();  
  const rowSelectionSetter = useRowSelectionSetter();
  
  let indeterminate = false;
  let checkedAll = false;
  const dataLength = curpageDataSource.length;
  const checkedDatas = selectedRows.length ? curpageDataSource.filter(data => {
    return selectedRows.indexOf(data) > -1;
  }) : [];
  const checkedDataLength = checkedDatas.length;
  
  if (checkedDataLength) {
    if (checkedDataLength === dataLength) {
      checkedAll = true;
    } else {
      indeterminate = true;
    }
  }

  const handleCheck = (e) => {
    const { checked } = e.target;
    let newSelectedRows = null;
    let newSelectedRowKeys = null;

    if (checked) {
      newSelectedRows = [ ...curpageDataSource ];
      newSelectedRowKeys = curpageDataSource.map((item, index) => getRowKey(rowKey, item, index));
    } else {
      newSelectedRows = [];
      newSelectedRowKeys = [];
    }

    rowSelectionSetter.updateState({
      selectedRows: newSelectedRows,
      selectedRowKeys: newSelectedRowKeys
    });

    onChange && onChange(newSelectedRowKeys, newSelectedRows);
    onSelectAll && onSelectAll(checked, newSelectedRows);
  };

  return (
    <Checkbox
      onChange={handleCheck}
      checked={checkedAll}
      indeterminate={indeterminate}
    />
  );
};

export default React.memo(SelectAllCheckbox);
