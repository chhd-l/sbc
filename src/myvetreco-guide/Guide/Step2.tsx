import { Button } from 'antd';
import React from 'react';
import { history } from 'qmkit';
type Step2Props = {
  onNext: () => void;
  onFold: () => void;
};
const Step2 = ({ onNext, onFold }: Step2Props) => {
  const handleContinueMyVerification = () => {
    history.push('/basic-setting');
    onFold();
  };
  return (
    <>
      <Button className="content-btn" block size="large" onClick={handleContinueMyVerification}>
        Continue my verification
      </Button>
      <Button type="link" className="content-text-decoration-link-btn" onClick={onNext} block>
        Later
      </Button>
    </>
  );
};
Step2.desc =
  'It is important to continue your verification process for the full services of payments';
export default Step2;
