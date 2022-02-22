import React from 'react';
import DataGrid from '../../../src/Datagrid';
import { Input, InputNumber, Select, Checkbox, Button, Modal } from 'antd';
import { 
  Section, 
} from '../../components';

const InputFilterComp = ({
  filterIcon,
  value,
  defaultValue,
  onChange,
  onCancel,
  ...restProps
}) => {
  const [ stValue, setStValue ] = React.useState(defaultValue);
  const [ open, setOpen ] = React.useState(false);

  React.useEffect(() => {
    if (value !== undefined) {
      setStValue(value);
    }
  }, [ value ]);

  const handleChange = e => {
    setStValue(e.target.value);
  };

  const handleConfirm = () => {
    onChange(stValue);
    setOpen(false);
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>{filterIcon}</div>
      <Modal
        title="自定义筛选组件"
        visible={open}
        onOk={handleConfirm}
        onCancel={() => setOpen(false)}
      >
        <Input value={stValue} onChange={handleChange} allowClear {...restProps} />
      </Modal>
    </>
  );
};

const Doc = () => {
  const [ loading, setLoading ] = React.useState(false);
  const [ pagination, setPagination ] = React.useState({
    total: 40,
    current: 2,
    pageSize: 15,
  });

  return (
    <>
      <Section title="features">
        <div>
          <Checkbox checked>数据渲染</Checkbox><br />
          <Checkbox checked>横向/纵向滚动</Checkbox><br />
          <Checkbox checked>固定列、固定表头</Checkbox><br />
          <Checkbox checked>分页</Checkbox><br />
          <Checkbox checked>拖拽列宽</Checkbox><br />
          <Checkbox checked>表头排序</Checkbox><br />
          <Checkbox checked>表头筛选</Checkbox><br />
          <Checkbox checked>行选择</Checkbox><br />
          <Checkbox checked={false}>......敬请期待
          </Checkbox><br />
        </div>
      </Section>
      <Section title="数据网格">
      </Section>

      <span onClick={() => setLoading(!loading)}>loading</span>
      <DataGrid 
        loading={loading}
        style={{ width: 800, height: 300 }}
        // pagination={false}
        // pagination={{
        //   ...pagination,
        //   onChange: (page, pageSize) => setPagination({ ...pagination, current: page, pageSize })
        // }}
        // footer={
        //   <>
        //     <div>footer</div>
        //     <div>方宇驰好帅方宇驰好帅方宇驰好帅方宇驰好帅方宇驰好帅方宇驰好帅方宇驰好帅方宇驰好帅方宇驰好帅方宇驰好帅方宇驰好帅方宇驰好帅</div>
        //   </>
        // }
        dataSource={Array.from({ length: 40 }).map((_, index) => ({
          name: `data${index}`,
          age: [ 18, 19, 20 ][index % 3],
          text: `${index}我太长了后面被省略了`,
          id: `${index}`,
          inputNumber: {
            value: index % 3,
            label: `(${index % 3})`
          },
          dataPicker: '2022-01-02'
        }))}
        onSortChange={(...args) => console.log('onSortChange', args)}
        onFilterChange={(...args) => console.log('onFilterChange', args)}
        frontend
        defaultFilter={{
          // index: [ 1 ]
        }}
        defaultSort={{
          index: 'DESC'
        }}
        rowSelection={{
          selectedRowKeys: [ '0', '1', '2' ],
          onChange: (...args) => console.log('rowselect onChange', args),
          onSelect: (...args) => console.log('rowselect onSelect', args),
          onSelectAll: (...args) => console.log('rowselect onSelectAll', args)
        }}
        columns={[
          {
            title: '可排序',
            key: 'index',
            render: (record) => record.id,
            fixed: true,
            sorter: (a, b) => a.id - b.id,
          },
          {
            title: 'input筛选',
            key: 'name1',
            dataIndex: 'name',
            fixed: true,
            filterType: 'input',
            filterMode: 'like',
            filterConfig: {
              placeholder: 'placeholder'
            },
            sorter: true
          },
          {
            title: 'checkbox筛选',
            key: 'age1',
            dataIndex: 'age',
            width: 80,
            filterType: 'checkboxList',
            filterMode: 'contain',
            filterConfig: {
              options: [
                { label: '18', value: 18 },
                { label: '19', value: 19 },
                { label: '20', value: 20 },
              ]
            }
          },
          {
            title: '自定义筛选组件',
            key: 'text',
            dataIndex: 'text',
            width: 100,
            filterAct: 'customize',
            filterMode: 'like',
            filterRender: (props) => {
              return <InputFilterComp {...props} />;
            }
          },
          {
            title: '多级结构的筛选',
            key: 'inputNumber',
            dataIndex: 'inputNumber',
            render: (inputNumber) => <InputNumber value={inputNumber.value} size="small" style={{ width: 100 }} />,
            width: 150,
            filterType: 'checkboxList',
            filterMode: 'contain',
            filterConfig: {
              options: [
                { label: '(0)', value: 0 },
                { label: '(1)', value: 1 },
                { label: '(2)', value: 2 },
              ],
              filterKey: 'inputNumber.value'
            }
          },
          {
            title: 'input',
            key: 'input',
            render: () => <Input value="data" size="small" style={{ width: 100 }} />,
            width: 150,
          },
          
          {
            title: 'select',
            key: 'select',
            render: () => <Select value="我被截断了" size="small" style={{ width: 150 }} />,
            width: 100,
            fixed: 'right',
          },
        ]}
        rowKey="id"
      />

      <br />
    </>
  );
};

export default Doc;
