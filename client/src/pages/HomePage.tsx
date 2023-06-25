/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from 'antd';
import { RootState, useAppDispatch } from '@/app/store';
import { postAction } from '@/reducer/post/post.slice';
import CardPost from '@/reducer/post/Post';
import FormSearchPost from '@/reducer/post/FormSearchPost';
import { IQueryPost } from '@/utils/interface';
import { deleteValueNull, getFilter, Pros, throttle, Title } from '@/utils/utils';
import { fDate } from '@/utils/formatTime';
import SpinLoading from '@/components/SpinLoading';
import { EStatusRedux } from '@/utils/enum';
import PostModal, { ICreateOrUpdatePost } from '@/reducer/post/PostModal';

const containStyle: React.CSSProperties = {
  display: 'flex',
  minHeight: '55vh',
  width: '100%',
  alignItems: 'center',
  rowGap: '10px',
  marginTop: 25,
  flexDirection: 'column',
};

export interface IFormSearch {
  search?: string;
  typeSearch?: string;
  createdAt_gte?: string;
  createdAt_lte?: string;
}
function convertDataToUrl(data: IFormSearch) {
  let convertData: Pros<any> = getFilter(
    ['search', 'typeSearch', 'createdAt_gte', 'createdAt_lte'],
    data,
  );
  convertData = deleteValueNull(convertData);
  const params = new URLSearchParams(convertData).toString();
  return params;
}

function convertQueryPosts(data: IFormSearch) {
  const queryPost: IQueryPost = {
    page: 1,
  };
  if (data.search) {
    if (data.typeSearch === 'all') {
      queryPost.search = data.search;
    } else if (data.typeSearch === 'tags') {
      queryPost[data.typeSearch] = [data.search];
    } else if (data.typeSearch) {
      queryPost[data.typeSearch] = data.search;
    }
  }
  if (data.createdAt_gte)
    queryPost.createdAt_gte = fDate(data?.createdAt_gte, 'YYYY-MM-DD', 'DD-MM-YYYY');

  if (data.createdAt_lte)
    queryPost.createdAt_lte = fDate(data?.createdAt_lte, 'YYYY-MM-DD', 'DD-MM-YYYY');

  return queryPost;
}

function HomePage() {
  const [searchParams] = useSearchParams();
  const objectParams = {
    ...Object.fromEntries(searchParams.entries()),
  } as IFormSearch;
  const { posts, page, status, count } = useSelector(
    (state: RootState) => state.post,
    shallowEqual,
  );
  const countRef = React.useRef<number>(count);
  const pageRef = React.useRef<number>(Math.ceil(count / 5));

  if (pageRef.current !== Math.ceil(count / 5)) {
    pageRef.current = Math.ceil(count / 5);
  }

  const [isOpenCreatePost, setIsOpenCreatePost] = React.useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const queryPosts = convertQueryPosts(objectParams);
    if (!posts.length) {
      dispatch(postAction.getPostsPending({ ...queryPosts }));
    }
  }, []);

  async function fetchPage() {
    try {
      const queryPosts = convertQueryPosts(objectParams);
      queryPosts.page += 1;
      dispatch(postAction.getPostsPending({ ...queryPosts }));
    } catch (error) {
      window.removeEventListener('scroll', tHandler);
    }
  }

  const onScroll = () => {
    const heightScroll = window.scrollY + window.innerHeight;

    if (heightScroll > (document.documentElement.scrollHeight * 180) / 200) {
      fetchPage();
    }
  };

  const tHandler = throttle(onScroll, 400);
  React.useEffect(() => {
    if (page < pageRef.current) window.addEventListener('scroll', tHandler);
    return () => window.removeEventListener('scroll', tHandler);
  }, [page]);

  const handelSubmit = (data: IFormSearch) => {
    const convertData = convertDataToUrl(data);
    const queryPost = convertQueryPosts(data);
    dispatch(postAction.getPostsPending({ ...queryPost }));
    navigate(`?${convertData}`);
  };

  const handelCreatePost = (data: ICreateOrUpdatePost) => {
    dispatch(postAction.createPostPending(data));
  };

  React.useEffect(() => {
    if (countRef.current < count) {
      countRef.current = count;
      setIsOpenCreatePost(false);
    }
  }, [count]);

  return (
    <div style={containStyle}>
      <FormSearchPost handelSubmit={handelSubmit} objectParams={objectParams} />
      {status === EStatusRedux.pending && <SpinLoading sx={{ top: 100 }} />}
      {posts.length > 0 &&
        posts.map((post, i) => (
          <div
            key={i}
            style={{ width: '60%', display: 'flex', justifyContent: 'center' }}
          >
            <CardPost post={post} />
          </div>
        ))}
      {status === EStatusRedux.succeeded && posts.length === 0 && (
        <div>
          <Title level={3}>Not Found Post</Title>
        </div>
      )}
      <div style={{ position: 'fixed', bottom: 20, right: 5 }}>
        <Button type='primary' onClick={() => setIsOpenCreatePost(true)}>
          Create Post
        </Button>
      </div>
      <PostModal
        isOpenModal={isOpenCreatePost}
        setIsOpenModal={setIsOpenCreatePost}
        handelSubmit={handelCreatePost}
        loading={status === EStatusRedux.pending}
      />
    </div>
  );
}

export default HomePage;
