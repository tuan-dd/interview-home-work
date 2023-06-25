import React from 'react';
import { Space, Spin } from 'antd';

function SpinLoading({ sx }: { sx?: React.CSSProperties }) {
  return (
    <Space>
      <Spin
        tip='Loading'
        size='large'
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 100,
          ...sx,
        }}
      >
        <div className='content' />
      </Spin>
    </Space>
  );
}

export default SpinLoading;
