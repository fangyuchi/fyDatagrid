import React from 'react';
import { Divider, Menu, BackTop } from 'antd';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import defs from './defs';

const menuGroups = Array.from(defs.keys()).reduce((acc, curKey) => {
  const cur = defs.get(curKey);
  const { type } = cur;

  if (type === 'group') {
    acc.push({
      key: curKey,
      ...cur,
      children: []
    });
  } else {
    acc[acc.length - 1].children.push({
      key: curKey,
      ...cur
    });
  }

  return acc;
}, []);

const Content = () => {
  const backtotop = React.useRef(null);
  const { pathname, hash } = useLocation();
  const curCompKey = pathname.replace('/', '');
  const def = defs.get(curCompKey);
  const curCompName = def?.title || '';

  React.useEffect(() => {
    if (hash) {
      const anchorId = hash.substring(1);
      document.getElementById(decodeURIComponent(anchorId))?.scrollIntoView();
    }
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Menu style={{ width: 256, overflowY: 'auto' }} selectedKeys={curCompKey ? [ curCompKey ] : undefined}>
        {
          menuGroups.map(group => {
            const { key: groupKey, children, title: groupTitle } = group;

            return (
              <Menu.ItemGroup title={groupTitle} key={groupKey}>
                {
                  children.map(def => {
                    const { key } = def;
        
                    return (
                      <Menu.Item key={key}><Link to={`/${key}`}>{def.title}</Link></Menu.Item>
                    );
                  })
                }
              </Menu.ItemGroup>
            );
          })
        }
      </Menu>
      <div style={{ padding: 48, flex: 1, overflowY: 'auto' }} ref={backtotop}>
        <h1>{curCompName}</h1> 
        <Divider />
        {/* <DndProvider backend={HTML5Backend}> */}
        <Switch>
          {
            Array.from(defs.keys()).map(key => {
              const def = defs.get(key);

              return (
                <Route key={key} path={`/${key}`}>
                  {def.comp}
                </Route>
              );
            })
          }
        </Switch>
        {/* </DndProvider> */}
      </div>
      <BackTop target={() => backtotop.current} />
    </div>
  );
};

const Demo = () => {

  // React.useEffect(() => {
  //   Modal.confirm({
  //     title: '大家注意',
  //     content: <>
  //       <p>目前大部分组件未规范且更新非常快，使用前请先和开发者确认</p>
  //       <p style={{ color: '#ccc' }}>如果出现bug请自行背锅</p>
  //     </>,
  //     okText: '我知道了！',
  //     cancelText: '我不知道',
  //     cancelButtonProps: {
  //       disabled: true
  //     }
  //   });
  // }, []);

  return (
    <Router>
      <Content />
    </Router>
  );
};

export default Demo;
