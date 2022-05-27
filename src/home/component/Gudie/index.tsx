import React, { PropsWithChildren, useState } from 'react';
import GuideItem, { GuideItemProps } from './Item';
type GuideProps = PropsWithChildren<{}>;
const Guide = ({ children }: GuideProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      const childElement = child as React.FunctionComponentElement<GuideItemProps>;
      const { displayName } = childElement.type;
      if (displayName === 'GuideItem') {
        return React.cloneElement(childElement, {
          active: activeIndex === index,
          onClick: () => setActiveIndex(index)
        });
      } else {
        console.error('Warning: Menu has a child which is not a MenuItem component');
      }
    });
  };
  return <div className="guide-container">{renderChildren()}</div>;
};
Guide.Item = GuideItem;
export default Guide;
