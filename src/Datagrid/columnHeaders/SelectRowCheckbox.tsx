import React from 'react';
import {
  Checkbox
} from 'antd';
import { getRowKey } from '../utils';
import {
  useRowSelectionContext,
  useRowSelectionSetter
} from '../contexts/rowSelectionContext';

const SelectRowCheckbox = ({
  record
}) => {
  const {
    selectedRows,
    selectedRowKeys,
    curpageDataSource,
    rowKey,
    onChange,
    onSelect
  } = useRowSelectionContext();  
  const rowSelectionSetter = useRowSelectionSetter();

  const handleCheck = (e) => {
    const { checked } = e.target;
    const recordIndex = curpageDataSource.indexOf(record);
    const recordKey = getRowKey(rowKey, record, recordIndex);
    let newSelectedRows = null;
    let newSelectedRowKeys = null;
    
    if (checked) {
      newSelectedRows = [ ...selectedRows, record ];
      newSelectedRowKeys = [ ...selectedRowKeys, recordKey ];
    } else {
      newSelectedRows = [ ...selectedRows ].filter(row => row !== record);
      newSelectedRowKeys = [ ...selectedRowKeys ].filter(key => key !== recordKey);
    }

    rowSelectionSetter.updateState({
      selectedRows: newSelectedRows,
      selectedRowKeys: newSelectedRowKeys
    });

    onChange && onChange(newSelectedRowKeys, newSelectedRows);
    onSelect && onSelect(record, checked, newSelectedRows, e);
  };

  const checked = selectedRows.indexOf(record) > -1;

  return (
    <Checkbox
      checked={checked}
      onClick={handleCheck}

    />
  );
};

export default React.memo(SelectRowCheckbox);
