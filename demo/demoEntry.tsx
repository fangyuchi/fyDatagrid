import ReactDOM from 'react-dom';
import Demo from './';

import 'antd/dist/antd.min.css';
// import '../src/styles/antd-overwrite.scss';

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
);

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// TODO: 咋没用呢
dayjs.locale('zh-cn');
