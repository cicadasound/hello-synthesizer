import classnames from 'classnames';
import {ArrowIcon} from '../icons';

export const Select = ({wide, children, ...rest}) => {
  const selectClassNames = classnames('lcd-select', {'lcd-select--wide': wide});
  return (
    <div className={selectClassNames}>
      <select className="lcd-select__control" {...rest}>
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
