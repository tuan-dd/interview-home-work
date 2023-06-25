import { Radio, Space } from 'antd';
import { useFormContext, Controller } from 'react-hook-form';
import type { RadioChangeEvent, RadioGroupProps } from 'antd';
import { PropsForm } from '@/utils/interface';

interface PropsFormRadio extends PropsForm {
  direction?: 'horizontal' | 'vertical' | undefined;
}

function FRadio({
  name,
  options,
  direction,
  ...other
}: PropsFormRadio & RadioGroupProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Radio.Group
          {...field}
          onChange={(e: RadioChangeEvent) => field.onChange(e.target.value)}
          {...other}
        >
          <Space direction={direction}>
            {(options as (string | number)[]).map((option, i) => (
              <Radio key={i} value={option} style={{ textTransform: 'capitalize' }}>
                {option}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      )}
    />
  );
}

export default FRadio;
