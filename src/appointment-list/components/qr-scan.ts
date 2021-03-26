import Html5Qrcode from '../tool/html5-qr-code';

export default class QRScan {
  html5QrcodeScanner: any;
  config: any;

  constructor() {
    this.html5QrcodeScanner = null;
    this.config = {
      fps: 2,
      qrbox: 250
    };
  }

  startScan(div_id, callback) {
    this.html5QrcodeScanner = new Html5Qrcode(div_id);
    this.html5QrcodeScanner.start({ facingMode: 'environment' }, this.config, (message) => {
      callback(message);
    });
  }

  stopScan() {
    if (this.html5QrcodeScanner) {
      this.html5QrcodeScanner.stop();
    }
  }
}
