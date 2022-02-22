import React from 'react';
import classnames from '../../../../utils/classnames';
import { getClassName } from '../../../utils';
import DatePicker from '../../../../DatePicker';

type DateTimeRangeFilterProps = {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
  style?: React.CSSProperties;
};

const DateTimeRange: React.FC<DateTimeRangeFilterProps> = ({
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
        getClassName('data-grid-filter-dropdown-DateTimeRange'),
        className
      )}
      {...restProps}
    >
      <DatePicker.RangePicker 
        valueType="string"
        showTime
        format="YYYY-MM-DD HH:mm:ss"
        value={stValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default DateTimeRange;
