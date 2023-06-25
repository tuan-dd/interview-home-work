import { DatePicker, Space, Typography, DatePickerProps } from 'antd';
import { useFormContext, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { PropsForm } from '@/utils/interface';

function FDatePicker({ name, ...other }: PropsForm & DatePickerProps) {
  const { control } = useFormContext();
  const dateFormat = 'DD-MM-YYYY';
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <Space>
          <DatePicker
            {...other}
            value={
              dayjs(field.value, 'DD-MM-YYYY').isValid()
                ? dayjs(field.value, 'DD-MM-YYYY')
                : undefined
            }
            onChange={(_date: dayjs.Dayjs | null, dateString: string) =>
              field.onChange(dateString)
            }
            format={dateFormat}
          />
          {!!error && invalid && <Typography> error.message</Typography>}
        </Space>
      )}
    />
  );
}

export default FDatePicker;
