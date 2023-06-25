import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Button, Space } from 'antd';
import { RootState, useAppDispatch } from '@/app/store';
import { commentAction } from './comment.slice';
import CardComment, { ICarComment } from './CardComment';
import { EStatusRedux } from '@/utils/enum';

function PostComment({ postId, cmt_count }: { postId: string; cmt_count: number }) {
  const { comments, status } = useSelector(
    (state: RootState) => ({
      comments: state.comment.commentsByPost[postId] || [],
      status: state.comment.statusCommentByPost[postId],
    }),
    shallowEqual,
  );
  const totalPageRef = React.useRef(Math.ceil(cmt_count / 3));
  if (totalPageRef.current !== cmt_count) {
    totalPageRef.current = Math.ceil(cmt_count / 3);
  }

  const [page, setPage] = React.useState<number>(1);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (comments.length === 0 && status !== EStatusRedux.pending) {
      dispatch(commentAction.getCommentsPending({ postId, page, comments: [] }));
    }
  }, []);

  const handelNextPage = () => {
    if (page < totalPageRef.current) {
      setPage(page + 1);
      if (comments.length < totalPageRef.current * 3) {
        dispatch(
          commentAction.getCommentsPending({ postId, page: page + 1, comments: [] }),
        );
      }
    }
  };

  React.useEffect(() => {
    if (page > totalPageRef.current) {
      setPage(totalPageRef.current);
    }
  }, [totalPageRef.current]);
  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      {comments &&
        comments.length > 0 &&
        comments.slice(0, 3 * page).map((comment, i) => {
          const convertComment: ICarComment = {
            ...comment,
            indexComment: i,
            postId,
          };
          return (
            <div key={i} style={{ minWidth: '100%' }}>
              <CardComment {...convertComment} />
            </div>
          );
        })}
      {totalPageRef.current > 1 && page < totalPageRef.current && (
        <Button onClick={handelNextPage} loading={status === EStatusRedux.pending}>
          More
        </Button>
      )}
    </Space>
  );
}

export default PostComment;
