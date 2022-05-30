import { Button } from 'antd';
import React from 'react';
type Step1Props = {
  onNext: () => void;
};

const Step1 = ({ onNext }: Step1Props) => {
  const handleOpenInNewTab = () => {
    window.open('https://shopsit.royalcanin.com/');
    onNext();
  };
  return (
    <>
      <Button className="content-btn" block size="large" onClick={handleOpenInNewTab}>
        Open in new tab
      </Button>
      <Button type="link" className="content-text-decoration-link-btn" onClick={onNext} block>
        Skip
      </Button>
    </>
  );
};
Step1.desc = 'Wish to take a quick look of your new shop:)';
export default Step1;
