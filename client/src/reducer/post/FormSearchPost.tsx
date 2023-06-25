import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import { Button, Space } from 'antd';
import { IFormSearch } from '@/pages/HomePage';
import { FDatePicker, FInput, FRadio, FormProvider } from '@/components/formProvider';
import { Text } from '@/utils/utils';

const typesSearch = ['all', 'author', 'title', 'content', 'tags'];

const validate = z
  .object({
    search: z.string(),
    typeSearch: z.enum(['all', 'title', 'author', 'content', 'tags']),
    createdAt_gte: z.string(),
    createdAt_lte: z.string(),
  })
  .refine(
    (data) => {
      if (data.createdAt_gte && data.createdAt_lte) {
        return dayjs(data.createdAt_lte, 'DD-MM-YYYY').isAfter(
          dayjs(data.createdAt_gte, 'DD-MM-YYYY'),
          'day',
        );
      }
      return true;
    },
    {
      message: 'CreatedAt_lte is greater than createdAt_gte',
      path: ['createdAt_lte'], // path of error
    },
  );

function FormSearchPost({
  objectParams,
  handelSubmit,
}: {
  objectParams: IFormSearch;
  handelSubmit: (data: IFormSearch) => void;
}) {
  const { search, typeSearch, createdAt_gte, createdAt_lte } = objectParams;

  const defaultValues: IFormSearch = {
    search: search || '',
    typeSearch: typeSearch && typesSearch.includes(typeSearch) ? typeSearch : 'all',
    createdAt_gte: dayjs(createdAt_gte, 'DD-MM-YYYY').isValid() ? createdAt_gte : '',
    createdAt_lte: dayjs(createdAt_lte, 'DD-MM-YYYY').isValid() ? createdAt_lte : '',
  };

  const methods = useForm<IFormSearch>({
    defaultValues,
    resolver: zodResolver(validate),
  });
  const { reset, watch } = methods;

  const placeholderInput = React.useMemo(() => watch().typeSearch, [watch().typeSearch]);

  React.useEffect(() => {
    reset(defaultValues);
  }, [objectParams]);

  const onSubmit: SubmitHandler<IFormSearch> = (data) => {
    handelSubmit(data);
  };

  return (
    <>
      <FormProvider onSubmit={onSubmit} {...methods}>
        <Space direction='vertical' align='center'>
          <Space>
            <FInput
              name='search'
              placeholder={`Search by ${placeholderInput}`}
              rows={1}
            />
            <FDatePicker name='createdAt_gte' placeholder='Post greater than day' />
            <FDatePicker name='createdAt_lte' placeholder='Post less than day' />
            <Button htmlType='submit'> Search</Button>
          </Space>
          <Space align='center'>
            <Text type='danger'> Types search :</Text>
            <FRadio name='typeSearch' options={[...typesSearch]} />
          </Space>
        </Space>
      </FormProvider>
    </>
  );
}

export default FormSearchPost;
