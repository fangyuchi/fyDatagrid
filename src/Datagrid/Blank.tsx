// import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  padding: 32px 0;
  text-align: center;
  color: rgba(0, 0, 0, .25);
`;

const Blank = () => {

  return (
    <Wrap>

      暂无数据
    </Wrap>
  );
};

export default Blank;
