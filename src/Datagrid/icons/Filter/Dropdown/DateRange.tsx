import React from 'react';
import classnames from '../../../../utils/classnames';
import { getClassName } from '../../../utils';
import DatePicker from '../../../../DatePicker';

type DateRangeFilterProps = {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
  style?: React.CSSProperties;
};

const DateRange: React.FC<DateRangeFilterProps> = ({
  value,
  defaultValue,
  onChange,
  className,
  ...restProps
}) => {
  const [ stValue, setStValue ] = React.useState(defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setStValue(value);
    }
  }, [ value ]);

  const handleChange = (vals) => {
    setStValue(vals);
    onChange && onChange(vals);
  };

  return (
    <div
      className={classnames(
        getClassName('data-grid-filter-dropdown-daterange'),
        className
      )}
      {...restProps}
    >
      <DatePicker.RangePicker 
        valueType="string"
        format="YYYY-MM-DD"
        value={stValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default DateRange;
