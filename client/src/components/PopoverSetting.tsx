import React from 'react';
import { Button, Popover, Space } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

function PopoverSetting({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode | React.ReactNode[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <Popover
      content={
        <Space direction='vertical' align='center'>
          {children}
        </Space>
      }
      trigger='click'
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Button icon={<MoreOutlined size={15} />} />
    </Popover>
  );
}

export default PopoverSetting;
