import React from 'react';
import { DatePicker as AntDatePicker, DatePicker } from 'antd';
import { PickerProps, PickerDateProps, RangePickerProps as BaseRangePickerProps, PickerTimeProps } from 'antd/lib/date-picker/generatePicker';
import dayjs, { Dayjs } from 'dayjs';
import classnames from '../utils/classnames';
import { getClassName } from '../utils';

const {
  WeekPicker,
  MonthPicker,
  YearPicker,
  RangePicker,
  TimePicker,
  QuarterPicker
} = AntDatePicker;

export const formatValue = (valueType: string, value: any) => {
 
  if (!value) {
    return undefined;
  }

  switch(valueType) {
    case 'timesteamp':
      return dayjs(value as number);
    case 'dayjs':
      return value;
    case 'string':
    default:
      return dayjs(value);
  }
};

export const formatDayjsToValue = (valueType: string, value: Dayjs, format: string) => {
  if (!value) {
    return null;
  }

  switch(valueType) {
    case 'timesteamp':
      return value.valueOf();
    case 'dayjs':
      return value;
    case 'string':
    default:
      return value.format(format);
  }
};

type ExtendProps = {
  value?: any;
  onChange?: (value: DatePickerProps['value']) => void;
  valueType?: 'timesteamp' |'dayjs' | 'string';
  format?: string;
  interaction?: boolean;
};

type ExtendRangeProps = {
  value?: [ any, any ];
  onChange?: (value: ExtendRangeProps['value']) => void;
} & Omit<ExtendProps, 'value' | 'onChange'>;

export type DatePickerProps = ExtendProps & PickerProps<Dayjs>;

export type DateRangePickerProps = ExtendRangeProps & PickerProps<Dayjs>;

const pickers = new Map([
  [ 'week', [ 'WeekPicker', WeekPicker ] ],
  [ 'month', [ 'MonthPicker', MonthPicker, 'YYYY-MM' ] ],
  [ 'year', [ 'YearPicker', YearPicker, 'YYYY' ] ],
  // [ 'range', [ 'RangePicker', RangePicker ] ],
  [ 'time', [ 'TimePicker', TimePicker, 'YYYY-MM-DD HH:mm:ss' ] ],
  [ 'quarter', [ 'QuarterPicker', QuarterPicker ] ]
]);

const pickerHoc: (PK: any, defaultFormat: string) => React.FC<DatePickerProps> = (PK, defaultFormat) => ({
  value,
  onChange,
  valueType = 'string',
  picker,
  interaction = true,
  className: propClassName = '',
  disabled,
  ...restProps
}) => {
  let Picker = PK;
  // TODO: 直接给PK重新赋值的话，原先PK的值也会改变，真的离谱
  
  // * 如果指定了picker的话，以picker为准
  const tarPicker = picker ? pickers.get(picker) : null;
  
  if (tarPicker) {
    Picker = tarPicker[1];
    defaultFormat = tarPicker[2] as string;
  }
   
  const { format = defaultFormat } = restProps;
  
  const handleChange = (val, str) => {
    if (onChange) {
      if (format || (valueType !== 'string')) {
        onChange(formatDayjsToValue(valueType, val, format as string));
      } else {
        onChange(str);
      }
    }
  };

  const className = classnames(
    getClassName('datepicker'),
    {
      [getClassName('datepicker-nointeraction')]: interaction === false
    }
  );
  
  return (
    <Picker
      value={formatValue(valueType, value)}
      onChange={handleChange}
      {...restProps}
      className={className}
      disabled={interaction === false ? true : disabled}
    />
  );
};

const rangePickerHoc: (PK: any, defaultFormat?: string) => React.FC<DateRangePickerProps> = (PK, defaultFormat) => ({
  value,
  onChange,
  valueType = 'string',
  picker,
  interaction = true,
  className: propClassName = '',
  disabled,
  ...restProps
}) => {
  
  // * 如果指定了picker的话，以picker为准
  const tarPicker = picker ? pickers.get(picker) : null;
  
  if (tarPicker) {
    defaultFormat = tarPicker[2] as string;
  }
   
  const { format = defaultFormat } = restProps;

  // const [ stValue, setStValue ] = React.useState(value);

  let start = undefined;
  let end = undefined;
  if (Array.isArray(value)) {
    start = value[0];
    end = value[1];
  }
  
  const handleChange = (val, str) => {
    if (onChange) {
      if (format || (valueType !== 'string')) {
        if (val) {
          onChange([ formatDayjsToValue(valueType, val[0], format), formatDayjsToValue(valueType, val[1], format) ]);
        } else {
          onChange(null);
        }
        
      } else {
        onChange(str);
      }
    }
  };

  const className = classnames(
    getClassName('daterangepicker'),
    {
      [getClassName('daterangepicker-nointeraction')]: interaction === false
    }
  );
  
  return (
    <PK
      value={ (start && end) ? [ formatValue(valueType, start), formatValue(valueType, end) ] : undefined}
      onChange={handleChange}
      picker={picker}
      {...restProps}
      className={className}
      disabled={interaction === false ? true : disabled}
    />
  );
};

const generateSinglePicker: () => {
  WeekPicker?: React.ComponentClass<Omit<PickerDateProps<Dayjs> & DatePickerProps, "picker">, any>;
  MonthPicker?: React.ComponentClass<Omit<PickerDateProps<Dayjs> & DatePickerProps, "picker">, any>;
  YearPicker?: React.ComponentClass<Omit<PickerDateProps<Dayjs> & DatePickerProps, "picker">, any>;
  RangePicker?: React.ComponentClass<BaseRangePickerProps<Dayjs> & ExtendProps, any>;
  TimePicker?: React.ComponentClass<Omit<PickerTimeProps<Dayjs> & DatePickerProps, "picker">, any>;
  QuarterPicker?: React.ComponentClass<Omit<PickerTimeProps<Dayjs> & DatePickerProps, "picker">, any>;
} & React.FC<DatePickerProps> = () => {

  const pickerComps: any = pickerHoc(DatePicker, 'YYYY-MM-DD');

  Array.from(pickers.values()).forEach((PK) => {
    pickerComps[PK[0] as string] = pickerHoc(PK[1], PK[2] as any);
  });

  pickerComps.RangePicker = rangePickerHoc(RangePicker);

  return pickerComps;
};

export default generateSinglePicker;
