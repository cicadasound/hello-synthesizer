import classnames from 'classnames';
import {ArrowIcon} from '../icons';

export const Select = ({wide, children, onChange, ...rest}) => {
  const selectClassNames = classnames('lcd-select', {'lcd-select--wide': wide});
  const handleChange = (event) => {
    onChange(event);
  };

  return (
    <div className={selectClassNames}>
      <select className="lcd-select__control" onChange={handleChange} {...rest}>
        {children}
      </select>
      <div className="lcd-select__icon">
        <ArrowIcon className="icon icon--rotate-90" />
      </div>
    </div>
  );
};

const Option = ({children, ...rest}) => {
  return <option {...rest}>{children}</option>;
};

Select.Option = Option;
