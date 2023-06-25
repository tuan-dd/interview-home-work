/* eslint-disable react/no-unstable-nested-components */
import { Input } from 'antd';
import type { PasswordProps } from 'antd/es/input';
import { useFormContext, Controller } from 'react-hook-form';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { PropsForm } from '@/utils/interface';

function FInputPassword({ name, ...other }: PropsForm & PasswordProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Input.Password
          {...field}
          value={field.value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            field.onChange(event.target.value)
          }
          iconRender={(visible) => {
            if (visible) {
              return <EyeTwoTone />;
            }
            return <EyeInvisibleOutlined />;
          }}
          status={error ? 'error' : undefined}
          {...other}
        />
      )}
    />
  );
}
export default FInputPassword;
