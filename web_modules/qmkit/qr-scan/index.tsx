import React, { ReactElement } from 'react';
import { Button } from 'antd';
import Html5Qrcode from './tools/html5-qr-code';
import { FormattedMessage } from 'react-intl';

type Iprop = {
  id: string;
  onScanEnd: (code: string) => void;
  children: ReactElement
};

const config = {
  fps: 2,
  qrbox: 250
};

const styles = {
  scaner: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: '0px',
    left: '0px',
    zIndex: 99999,
    backgroundColor: 'rgba(0,0,0,.7)',
    textAlign: 'center'
  },
  scanbtn: {
    position: 'absolute',
    width: '100%',
    left: 0,
    bottom: 20,
    zIndex: 101010
  },
  camera: {
    display: 'inline-block',
    width: '100%'
  }
} as any;

export default class QRScaner extends React.Component<Iprop, any> {
  state: any;
  html5QrcodeScanner: any;
  
  constructor(props: Iprop) {
    super(props);
    this.state = {
      show: false
    };
  }

  beginScan = () => {
    const { id, onScanEnd } = this.props;
    this.setState({
      show: true
    }, () => {
      this.html5QrcodeScanner = new Html5Qrcode(`${id}_div`);
      this.html5QrcodeScanner.start({ facingMode: 'environment' }, config, (message) => {
        onScanEnd(message);
        this.closeScan();
      });
    });
  }

  closeScan = () => {
    if (this.html5QrcodeScanner) {
      this.html5QrcodeScanner.stop();
    }
    this.setState({
      show: false
    });
  }

  render() {
    const { id, children } = this.props;
    const renderChild = React.cloneElement(children, {
      onClick: () => this.beginScan()
    });
    return (
      <>
        {renderChild}
        <div id={`${id}_container`} style={{ ...styles.scaner, display: this.state.show ? 'block' : 'none' }}>
          <div id={`${id}_div`} style={styles.camera}></div>
          <div style={styles.scanbtn}>
            <Button size="large" onClick={this.closeScan}>
              <FormattedMessage id="Order.Close" />
            </Button>
          </div>
        </div>
      </>
    );
  }
}
