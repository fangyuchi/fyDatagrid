
# BOSS、PRINT、PROCESS、FORM 代码仓库

## features


* 分页
* 拖拽调整列宽
* 表头排序
* 表头筛选
* 行选择
* ......

## 使用

```js
// 安装
npm i fydatagrid -S

// 查看demo
npm start
```

```jsx
<DataGrid
  dataSource={dataSource}
  rowKey="id"
  columns={columns}
  pagination={false}
  // 必须指定宽高，也可以指定maxWidth或maxHeight
  style={{
    width: "100%",
    height: 300
  }}
/>
```

## API

* 参数参考了[ant design Table](https://ant.design/components/table-cn/#Table)的设计
* 具体示例请查看demo
  
| 参数 | 类型 | 说明 | 默认值 |
|--|--|--|--|
| columns | Column | 列配置 | |
| dataSource | Array<any> | 数组数据 ||
| defaultFilter | { [ key in string ]: any } | 默认过滤参数 ｜
| defaultSort | { [ key in string ]: 'ASC' ｜ 'DESC' } | 默认排序参数 |
| filter | { [ key in string ]: any } | 过滤参数 ｜
| loading | boolean | 加载中状态 | false |
| onFilterChange | (filter: ColumnItem['filter']) => void | 过滤条件发生变化时的回调函数 |
| onSortChange | (sort: ColumnItem['sort']) => void | 排序条件变化时的回调函数 |
| pagination | [Pagination](https://ant.design/components/pagination-cn/#API) | 使用了ant design的分页组件 || 
| rowKey | string ｜ (record, index) => string | 表格行 key 的取值 || 
| rowSelection | 
| sort | { [ key in string ]: 'ASC' ｜ 'DESC' } | 排序参数 |
| frontend | boolean | 前端模式（开启后组件会自动实现分页、筛选、排序）| false |

### Column

| 参数 | 类型 | 说明 | 默认值 |
|--|--|--|--|
| dataIndex | string | 列显示数据的字段名 | |
| defaultSortOrder | 'ASC' ｜ 'DESC' | 默认的排序 | |
| filterAct | 'modal' ｜ 'dropdown' ｜ 'customize' | 点击筛选后筛选组件交互方式 | |
| filterCallback | (value: any, filter: any) => any[] | filterMode为callback时调用的筛选函数 |
| filterConfig | FilterConfig |
| filterMode | 'eq' ｜ 'like' ｜ 'contain' ｜ 'between' ｜ 'callback' | 筛选时匹配的方式 | | 
| filterRender | () => ReactNode | filterType为customize时渲染的筛选组件 |
| filterType | 'input' ｜ 'checkboxList' ｜ 'dateRange' ｜ 'dateTimeRange' ｜ 'customize' | 筛选组件类型 | |
| fixed | 'left' ｜ 'right' ｜ boolean | 固定列 | false |
| render | function(field, record, index)  | 渲染函数| |
| title | ReactNode | 标题 | |
| width | number | 初始宽度 | |
| sorter | boolean ｜ Function | 排序函数，后端排序时可以设置为true ||
| sortDirections | Array<'ASC' ｜ 'DESC'> | 点击排序时排序切换的顺序 | ['ASC', 'DESC'] |

### FilterConfig

| 参数 | 类型 | 说明 | 默认值 |
|--|--|--|--|
| filterKey | string | 指定筛选时的字段名称（如‘name.firstName’） | Column['key'] ｜ Column['dataIndex'] |
| onClick | (e) => void | 点击筛选图标时的回调函数 | |
| options | Array<{label: string; value: any;}> | filterType为checkboxList时筛选组件展示的列表 |
| placeholder | string | filterType为input时的placeholder |

### RowSelection

| 参数 | 类型 | 说明 | 默认值 |
|--|--|--|--|
| selectedRowKeys | Array<string> | 指定哪些列被选中 |
| defaultSelectedRowKeys | Array<string> | 指定哪些列默认被选中 |
| type | 'checkbox' ｜ 'radio' | 单选/多选 |
| onChange | (selectedRowKeys: RowSelection['selectedRowKeys'], selectedRows: any[]) => void | 行选择变化时的回调函数 |
| onSelect | (record: any, selected: boolean, selectedRows: any[], nativeEvent) => void | 手动选择/取消选择某行的回调 | 
| onSelectAll | (selected: boolean, selectedRows: any[]) => void | 手动选择/取消选择所有行的回调 |
