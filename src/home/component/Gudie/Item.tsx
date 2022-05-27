import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
export type GuideItemProps = PropsWithChildren<{
  active?: boolean;
  onClick?: () => void;
}>;

const GuideItem: React.FC<GuideItemProps> = ({ children, onClick, active }) => {
  const className = classNames('border-solid border-2 text-blue-300 cursor-pointer', {
    'bg-violet-600': active
  });
  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
};
GuideItem.displayName = 'GuideItem';
export default GuideItem;
