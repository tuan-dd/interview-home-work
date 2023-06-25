import { useFormContext, Controller } from 'react-hook-form';
import { Button, ColorPicker } from 'antd';
import type { ColorPickerProps } from 'antd/es/color-picker';
import { PropsForm } from '@/utils/interface';

interface IFColorPicker extends PropsForm {
  btnStyle: React.CSSProperties;
  label: string;
}

function FColorPicker({
  name,
  btnStyle,
  label,
  ...other
}: IFColorPicker & ColorPickerProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ColorPicker
          value={field.value}
          onChange={(value) => field.onChange(value.toHexString())}
          {...other}
        >
          <Button type='primary' style={btnStyle}>
            {label}
          </Button>
        </ColorPicker>
      )}
    />
  );
}

export default FColorPicker;
