import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Space, Tag } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { IAuthor, IPost } from '@/utils/interface';
import { FColorPicker, FInput, FormProvider } from '@/components/formProvider';
import BasicModal from '@/components/Modal/BasicModal';
import { colors } from '@/utils/enum';

const validate = z.object({
  title: z.string().min(1).max(40),
  content: z.string().min(1).max(500),
  background: z.string().optional(),
  tags: z.array(z.string()).min(0).optional(),
});

export interface ICreateOrUpdatePost {
  title: string;
  content: string;
  background: string;
  tags: string[];
}

function PostModal({
  isOpenModal,
  setIsOpenModal,
  post,
  handelSubmit,
  loading,
}: {
  post?: IPost<IAuthor>;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  handelSubmit: (data: ICreateOrUpdatePost) => void;
  loading: boolean;
}) {
  const defaultValues: ICreateOrUpdatePost = {
    title: post?.title || '',
    content: post?.content || '',
    background: post?.background || '',
    tags: post?.tags || [],
  };
  const methods = useForm<ICreateOrUpdatePost>({
    defaultValues,
    resolver: zodResolver(validate),
  });

  const [valueTag, setValueTag] = React.useState<string>('');

  const { reset, setValue, watch } = methods;
  const { tags, background } = watch();
  React.useEffect(() => {
    reset(defaultValues);
  }, [isOpenModal]);

  const onSubmit: SubmitHandler<ICreateOrUpdatePost> = (data) => {
    handelSubmit(data);
  };

  const handelSubmitTag = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setValue('tags', [...tags, valueTag]);
    setValueTag('');
  };

  const bgColor = React.useMemo<string>(() => background || '', [background]);

  return (
    <BasicModal
      isOpenModal={isOpenModal}
      setIsOpenModal={setIsOpenModal}
      title={post ? 'Update Post' : 'Create Post'}
      style={{ textAlign: 'center' }}
    >
      <Space direction='vertical' style={{ rowGap: 15 }}>
        <FormProvider onSubmit={onSubmit} {...methods}>
          <Space direction='vertical' style={{ rowGap: 15 }}>
            <FInput name='title' placeholder='Input title' />
            <FInput
              name='content'
              rows={8}
              style={{ background: bgColor }}
              placeholder='Write your feeling'
            />
            <FColorPicker
              name='background'
              btnStyle={{ width: 400, marginTop: 5 }}
              label='Choose color background'
            />
          </Space>
        </FormProvider>

        {tags?.length !== 0 && (
          <Space size={[0, 8]}>
            {tags.map((tag, i) => (
              <Tag
                style={{ cursor: 'pointer' }}
                key={i}
                color={colors[i % 10]}
                onClick={() => setValue('tags', tags.toSpliced(i, 1))}
              >
                {tag}
              </Tag>
            ))}
          </Space>
        )}
        <form onSubmit={handelSubmitTag}>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder='Submit create new tag or click tag to remove'
              value={valueTag}
              onChange={(e) => setValueTag(e.target.value)}
            />
            <Button icon={<SendOutlined />} htmlType='submit' />
          </Space.Compact>
        </form>
        <FormProvider onSubmit={onSubmit} {...methods}>
          <Button htmlType='submit' loading={loading}>
            {post ? 'Update Post' : 'Create Post'}
          </Button>
        </FormProvider>
      </Space>
    </BasicModal>
  );
}

export default PostModal;
