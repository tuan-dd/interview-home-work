import { Modal } from 'antd';
import type { ModalProps } from 'antd';
import React from 'react';

function BasicModal({
  isOpenModal,
  setIsOpenModal,
  children,
  ...other
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode | React.ReactNode[];
} & ModalProps) {
  return (
    <Modal
      open={isOpenModal}
      {...other}
      onCancel={() => setIsOpenModal(false)}
      okButtonProps={{ style: { display: 'none' } }}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      {children}
    </Modal>
  );
}

export default BasicModal;
