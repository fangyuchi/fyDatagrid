import React from 'react';
import { BackTop } from 'antd';
import Doc from './docs/DataGrid';

const Content = () => {
  const backtotop = React.useRef(null);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ padding: 48, flex: 1, overflowY: 'auto' }} ref={backtotop}>
        <Doc />
      </div>
      <BackTop target={() => backtotop.current} />
    </div>
  );
};

const Demo = () => {


  return (
    <Content />
  );
};

export default Demo;
