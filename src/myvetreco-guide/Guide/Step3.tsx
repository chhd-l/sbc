import { Button } from 'antd';
import React from 'react';
type Step3Props = {
  onClose: () => void;
};
const Step3 = ({ onClose }: Step3Props) => {
  return (
    <>
      <Button
        block
        href="mailto:help@myvetreco.com"
        type="link"
        className="content-text-decoration-link-btn"
      >
        help@myvetreco.com
      </Button>
      <Button className="content-btn" block size="large" onClick={onClose}>
        Start MyVet Reco Journey
      </Button>
    </>
  );
};
Step3.desc = 'For all questions, feel free to contact our support team:';
export default Step3;
