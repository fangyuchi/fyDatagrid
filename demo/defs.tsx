import DataGridDoc from './docs/DataGrid';

const defs = new Map([
  [
    'components',
    {
      type: 'group',
      title: '组件'
    }
  ],
  [
    'data-grid',
    {
      comp: <DataGridDoc />,
      title: 'DataGrid'
    }
  ],
]);

export default defs;
