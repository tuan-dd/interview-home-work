import { Avatar, Card, Button, Space, Input } from 'antd';
import React from 'react';
import PopoverSetting from '@components/PopoverSetting';
import { SendOutlined } from '@ant-design/icons';
import { IAuthor, IComment } from '@/utils/interface';
import { Text } from '@/utils/utils';
import { fToNow } from '@/utils/formatTime';

function Reply({
  reply,
  handelUpdate,
  handelDelete,
  index,
  loading,
  userId,
}: {
  reply: IComment<string, IAuthor>;
  handelUpdate: (valueInput: string, indexReply: number) => void;
  handelDelete: (indexReply: number) => void;
  index: number;
  loading: boolean;
  userId?: string;
}) {
  const { content, authorId, updatedAt } = reply;
  const [isOpenPopOver, setIsOpenPopOver] = React.useState(false);
  const [isOpenInputEdit, setIsOpenInputEdit] = React.useState<boolean>(false);
  const [valueEdit, setValueEdit] = React.useState<string>('');
  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handelUpdate(valueEdit, index);
  };
  React.useEffect(() => {
    if (content === valueEdit) {
      setIsOpenInputEdit(false);
      setValueEdit('');
    }
  }, [content]);
  const isAuthor = authorId._id === userId;
  return (
    <Card style={{ marginTop: 6 }}>
      <div>
        {isAuthor && (
          <div style={{ position: 'absolute', top: 3, right: 5 }}>
            <PopoverSetting open={isOpenPopOver} setOpen={setIsOpenPopOver}>
              <Button
                size='small'
                style={{ width: 60 }}
                onClick={() => {
                  setIsOpenPopOver(false);
                  setIsOpenInputEdit(true);
                }}
              >
                Edit
              </Button>
              <Button
                size='small'
                style={{ width: 60 }}
                onClick={() => {
                  setIsOpenPopOver(false);
                  handelDelete(index);
                }}
              >
                Delete
              </Button>
            </PopoverSetting>
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p> {content}</p>
          <div style={{ position: 'absolute', top: 3, left: 5 }}>
            <Avatar
              size={25}
              src={authorId?.avatar && <img src={authorId.avatar} alt='avatar' />}
            />
            <Text> {authorId.name}</Text>
          </div>
          <div>
            <Text style={{ fontSize: 10, position: 'absolute', bottom: 3, right: 5 }}>
              {fToNow(updatedAt)}
            </Text>
          </div>
        </div>
        {isOpenInputEdit && (
          <div style={{ marginTop: 1 }}>
            <form onSubmit={handelSubmit}>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  placeholder='Type comment'
                  value={valueEdit}
                  onChange={(e) => setValueEdit(e.target.value)}
                />
                <Button
                  icon={<SendOutlined size={15} />}
                  htmlType='submit'
                  loading={loading}
                />
              </Space.Compact>
            </form>
          </div>
        )}
      </div>
    </Card>
  );
}

export default Reply;
