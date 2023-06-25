import { Input } from 'antd';

import { useFormContext, Controller } from 'react-hook-form';
import { TextAreaProps } from 'antd/es/input';
import { PropsForm } from '@/utils/interface';

const { TextArea } = Input;

function FInput({ name, ...other }: PropsForm & TextAreaProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextArea
          {...field}
          value={field.value}
          onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            field.onChange(event.target.value)
          }
          status={error ? 'error' : undefined}
          {...other}
        />
      )}
    />
  );
}
export default FInput;
