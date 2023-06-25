import React from 'react';
import type { CollapseProps } from 'antd';
import {
  Avatar,
  Button,
  Card,
  Divider,
  Typography,
  Collapse,
  Input,
  Space,
  Tag,
} from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { shallowEqual, useSelector } from 'react-redux';
import PopoverSetting from '@components/PopoverSetting';
import { IAuthor, IPost } from '@/utils/interface';
import { Title } from '@/utils/utils';
import { fToNow } from '@/utils/formatTime';
import PostComment from '../comment/PostComment';
import { RootState, useAppDispatch } from '@/app/store';
import { EStatusRedux, colors } from '@/utils/enum';
import { commentAction } from '../comment/comment.slice';
import { postAction } from './post.slice';
import PostModal, { ICreateOrUpdatePost } from './PostModal';

function CartPost({ post }: { post: IPost<IAuthor> }) {
  const { title, tags, content, cmt_count, createdAt, authorId, _id } = post;
  const [isOpenModalPost, setIsOpenModalPost] = React.useState<boolean>(false);
  const [isOpenPopOver, setIsOpenPopOver] = React.useState(false);

  const stateCommentByPost = useSelector(
    (state: RootState) => state.comment.statusCommentByPost[post._id],
    shallowEqual,
  );
  const statePost = useSelector((state: RootState) => state.post.status, shallowEqual);

  const currentUser = useSelector(
    (state: RootState) => state.user.currentUser,
    shallowEqual,
  );
  const isAuthor = post.authorId?._id === currentUser?._id;
  const [valueInPutComment, setValueInPutComment] = React.useState<string>('');
  const dispatch = useAppDispatch();

  const items: CollapseProps['items'] = React.useMemo(
    () => [
      {
        key: '1',
        label: `Show ${cmt_count} comment`,
        children: <PostComment postId={_id} cmt_count={cmt_count || 0} />,
      },
    ],
    [cmt_count],
  );

  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentUser && valueInPutComment) {
      const author: IAuthor = {
        _id: currentUser._id,
        avatar: currentUser.avatar,
        name: currentUser.name,
      };
      dispatch(
        commentAction.createCommentPending({
          postId: post._id,
          author,
          content: valueInPutComment,
        }),
      );
    }
    setValueInPutComment('');
  };
  const handelDeletePost = () => {
    dispatch(postAction.deletePostPending(post._id));
  };

  const handelUpdatePost = (data: ICreateOrUpdatePost) => {
    dispatch(postAction.updatePostPending({ ...data, postId: post._id }));
  };

  return (
    <>
      <Card
        title='Post'
        bordered={false}
        style={{
          width: 500,
          border: '0.5px solid',
          background: post.background ? post.background : '',
        }}
      >
        {isAuthor && (
          <div style={{ position: 'absolute', top: 3, right: 5 }}>
            <PopoverSetting setOpen={setIsOpenPopOver} open={isOpenPopOver}>
              <Button
                size='small'
                style={{ width: 60 }}
                onClick={() => {
                  setIsOpenModalPost(true);
                }}
              >
                Edit
              </Button>
              <Button size='small' style={{ width: 60 }} onClick={handelDeletePost}>
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
            padding: '0 20px',
          }}
        >
          <div>
            <Title level={5} style={{ color: '#e76993' }}>
              {title}
            </Title>
            <Typography>{fToNow(createdAt)}</Typography>
          </div>
          <div>
            <Avatar
              src={authorId?.avatar && <img src={authorId.avatar} alt='avatar' />}
            />
            <Typography>{authorId?.name} </Typography>
          </div>
        </div>
        {tags.length !== 0 && (
          <Space size={[0, 8]}>
            {' '}
            {tags.map((tag, i) => (
              <Tag key={i} color={colors[i % 10]}>
                {tag}
              </Tag>
            ))}
          </Space>
        )}
        <Divider />
        <Typography>{content}</Typography>

        {(cmt_count as number) > 0 ? (
          <Collapse items={items} />
        ) : (
          <Card>
            <Typography>No comment</Typography>
          </Card>
        )}
        <div style={{ marginTop: 10 }}>
          <form onSubmit={handelSubmit}>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder='Type comment'
                value={valueInPutComment}
                onChange={(e) => setValueInPutComment(e.target.value)}
              />
              <Button
                icon={<SendOutlined size={15} />}
                htmlType='submit'
                loading={
                  stateCommentByPost && stateCommentByPost === EStatusRedux.pending
                }
              />
            </Space.Compact>
          </form>
        </div>
        <PostModal
          isOpenModal={isOpenModalPost}
          setIsOpenModal={setIsOpenModalPost}
          loading={statePost === EStatusRedux.pending}
          post={post}
          handelSubmit={handelUpdatePost}
        />
      </Card>
    </>
  );
}

export default CartPost;
