import { Button } from 'antd';
import React from 'react';
import { util, cache } from 'qmkit';
type Step1Props = {
  onNext: () => void;
};

const Step1 = ({ onNext }: Step1Props) => {
  const handleOpenInNewTab = () => {
    const shopDomain = sessionStorage.getItem(cache.DOMAINNAME);
    let myvetreco_shop_domain_url = '';
    if (shopDomain) {
      myvetreco_shop_domain_url = shopDomain.endsWith('/')
        ? shopDomain + 'admin'
        : shopDomain + '/admin';
      myvetreco_shop_domain_url =
        myvetreco_shop_domain_url + '?authorize=' + util.encryptAES((window as any).token);
    }
    window.open(myvetreco_shop_domain_url);
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
