/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { Card, Space, Avatar, Button, Input } from 'antd';
import { shallowEqual, useSelector } from 'react-redux';
import PopoverSetting from '@components/PopoverSetting';
import { SendOutlined } from '@ant-design/icons';
import { IAuthor, IComment } from '@/utils/interface';
import { Text } from '@/utils/utils';
import { fToNow } from '@/utils/formatTime';
import { RootState, useAppDispatch } from '@/app/store';
import { commentAction } from './comment.slice';
import { EStatusRedux } from '@/utils/enum';
import Reply from './Reply';

export interface ICarComment extends IComment<string, IAuthor> {
  indexComment: number;
  postId: string;
}

interface IOpenInput {
  isOpen: boolean;
  type: 'create' | 'update';
}

function CardComment(comment: ICarComment) {
  const dispatch = useAppDispatch();
  const {
    postId,
    indexComment,
    _id,
    reply_count,
    replies,
    slug,
    updatedAt,
    content,
    authorId,
  } = comment;
  const [isOpenPopOver, setIsOpenPopOver] = React.useState(false);
  const [isOpenInputEdit, setIsOpenInputEdit] = React.useState<IOpenInput>({
    isOpen: false,
    type: 'update',
  });
  const [valueEdit, setValueEdit] = React.useState<string>('');

  const pageRef = React.useRef<number>(Math.ceil(reply_count / 3));
  const user = useSelector((state: RootState) => state.user.currentUser, shallowEqual);

  if (pageRef.current !== Math.ceil(reply_count / 3)) {
    pageRef.current = Math.ceil(reply_count / 3);
  }

  const handelUpdateOrCreateComment = (valueInput: string, isCreate: boolean) => {
    if (!isCreate)
      dispatch(
        commentAction.updateCommentPending({
          postId,
          indexComment,
          _id,
          content: valueInput,
        }),
      );

    if (user && isCreate)
      dispatch(
        commentAction.createCommentPending({
          parentSlug: slug,
          content: valueEdit,
          postId,
          author: { name: user.name, _id: user._id, avatar: user.avatar },
        }),
      );
  };

  React.useEffect(() => {
    if (content === valueEdit) {
      setIsOpenInputEdit((e) => ({ ...e, isOpen: false }));
    }
    setValueEdit('');
  }, [content, reply_count]);

  const handelDeleteComment = () => {
    dispatch(commentAction.deleteCommentPending({ postId, indexComment, _id }));
  };

  const handelUpdateReply = (valueInput: string, indexReply: number) => {
    if (replies) {
      const replyId = replies[indexReply]._id;
      dispatch(
        commentAction.updateReplyPending({
          postId,
          indexComment,
          _id: replyId,
          indexReply,
          content: valueInput,
        }),
      );
    }
  };
  const handelDeleteReplies = (indexReply: number) => {
    if (replies) {
      const replyId = replies[indexReply]._id;
      dispatch(
        commentAction.deleteReplyPending({
          postId,
          indexComment,
          _id: replyId,
          indexReply,
        }),
      );
    }
  };
  const handelShowReply = () => {
    dispatch(commentAction.getRepliesPending({ parentSlug: slug, postId, replies: [] }));
  };

  const statePost = useSelector(
    (state: RootState) => state.comment.statusCommentByPost[postId],
    shallowEqual,
  );
  const isAuthor = authorId._id === user?._id;

  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isOpenInputEdit.type === 'update') {
      handelUpdateOrCreateComment(valueEdit, false);
    } else {
      handelUpdateOrCreateComment(valueEdit, true);
    }
  };

  return (
    <>
      <Card
        style={{
          width: '100%',
          position: 'relative',
          rowGap: 10,
          minHeight: (reply_count as number) > 0 ? 150 : 140,
        }}
      >
        {isAuthor && (
          <div style={{ position: 'absolute', top: 3, right: 5 }}>
            <PopoverSetting open={isOpenPopOver} setOpen={setIsOpenPopOver}>
              <Button
                size='small'
                style={{ width: 60 }}
                onClick={() => {
                  setIsOpenPopOver(false);
                  setIsOpenInputEdit((_e) => ({ isOpen: true, type: 'update' }));
                }}
              >
                Edit
              </Button>
              <Button
                size='small'
                style={{ width: 60 }}
                onClick={() => {
                  setIsOpenPopOver(false);
                  handelDeleteComment();
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
        {isOpenInputEdit.isOpen && (
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
                  loading={statePost && statePost === EStatusRedux.pending}
                />
              </Space.Compact>
            </form>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 3, left: 5 }}>
          <Button
            size='small'
            onClick={() => setIsOpenInputEdit((_e) => ({ type: 'create', isOpen: true }))}
          >
            reply
          </Button>
        </div>
        <div style={{ position: 'absolute', bottom: 3, left: 60 }}>
          {reply_count !== 0 && !replies && (
            <Button size='small' onClick={() => handelShowReply()}>
              See {reply_count} replies{' '}
            </Button>
          )}
        </div>
        <div style={{ marginBottom: 8 }}>
          {replies &&
            replies?.length !== 0 &&
            replies.map((reply, index) => (
              <div key={index}>
                <Reply
                  reply={reply}
                  handelDelete={handelDeleteReplies}
                  handelUpdate={handelUpdateReply}
                  index={index}
                  userId={user?._id}
                  loading={statePost === EStatusRedux.pending}
                />
              </div>
            ))}
        </div>
      </Card>
    </>
  );
}

export default CardComment;
