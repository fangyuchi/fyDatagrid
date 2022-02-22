import React from 'react';

type CustomizeProps = {
  value?: any;
  onChange?: (value: any) => void;
  children: React.ReactNode;
  filterIcon: React.ReactNode;
};

const Customize: React.FC<CustomizeProps> = ({
  value,
  onChange,
  children,
  filterIcon,
  ...restProps
}) => {

  const handleConfirm = (newValue) => {
    onChange(newValue);
  };

  return (
    <>
      {
        React.isValidElement(children) ? (
          React.cloneElement(
            children,
            {
              ...restProps,
              filterIcon,
              onChange: handleConfirm,
              value,
            }
          )
        ) : children
      }
    </>
  );
};

export default Customize;
