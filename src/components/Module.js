import classnames from 'classnames';

import {CornerScrewIcon} from '../icons';

export function Module({title, children, vertical, dark}) {
  const moduleClasses = classnames('module', {
    'module--dark': dark,
  });
  const moduleGroupClasses = classnames('module__group', {
    'module__group--vertical': vertical,
  });
  const titleMarkup = title ? <h2>{title}</h2> : null;
  return (
    <section className={moduleClasses}>
      <div className="corner-screw corner-screw--top-left">
        <CornerScrewIcon />
      </div>
      <div className="corner-screw corner-screw--top-right">
        <CornerScrewIcon />
      </div>
      {titleMarkup}
      <div className={moduleGroupClasses}>{children}</div>
      <div className="corner-screw corner-screw--bottom-left">
        <CornerScrewIcon />
      </div>
      <div className="corner-screw corner-screw--bottom-right">
        <CornerScrewIcon />
      </div>
    </section>
  );
}
