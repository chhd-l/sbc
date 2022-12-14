class Printer {
  $deviceID = 'local_printer';
  $url = '';
  $crypto = false;
  $buffer = false;
  $ePosDev = null;
  $printer = null;
  $events = [];
  $subscribes = [];
  $printData = [];

  $lineCharsLength = 43;
  $lineCharsSecondSizeFontBLength = 29;
  $hLne = '------------------------------------------';


  constructor(crypto = true, buffer = true) {
    this.$crypto = crypto;
    this.$buffer = buffer;
    this.$events = [];
    this.$subscribes = [];
  }

  connect = (url) => {
    if (!(window as any).epson) {
      console.error('epson is undefined.');
      return;
    }
    this.$url = url;
    this.$printer = null;
    const [ip, port] = this.$url.split(':');
    this.$ePosDev = new (window as any).epson.ePOSDevice();
    this.$ePosDev.connect(ip, port, this.connectCallback);

    this.$ePosDev.onreconnecting = () => {
      console.log('onreconnecting');
    };
    this.$ePosDev.onreconnect = () => {
      console.log('onreconnect');
    };
    this.$ePosDev.ondisconnect = () => {
      console.log('ondisconnect');
    };
  };

  connectCallback = (state) => {
    const options = { crypto: this.$crypto, buffer: this.$buffer };

    if (state === 'OK') {
      console.log('connected to ePOS Device Service Interface.');
      this.$ePosDev.createDevice(this.$deviceID, this.$ePosDev.DEVICE_TYPE_PRINTER, options, this.createDevice);
    } else if (state === 'SSL_CONNECT_OK') {
      console.log('connected to ePOS Device Service Interface with SSL.');
      this.$ePosDev.createDevice(this.$deviceID, this.$ePosDev.DEVICE_TYPE_PRINTER, options, this.createDevice);
    } else {
      console.log('connected to ePOS Device Service Interface is failed. [' + state + ']');
      setTimeout(() => {
        this.connect(this.$url);
      }, 5000);
    }
  };

  createDevice = (data, code) => {
    if (data === null) {
      console.log(code);
      return;
    }
    const me = this;
    console.log('you can use printer.');

    this.$printer = data;
    this.dispatchEvent(this.$printer);

    this.$printer.onreceive = (res) => {
      console.log('Print' + (res.success ? 'Success' : 'Failure') + '\nCode:' + res.code + '\nBattery:' + res.battery + '\n' + me.getStatusText(me.$printer, res.status));
      console.log('Print res', res);
      if (res.success && res.status & me.$printer.ASB_PRINT_SUCCESS) {
        const finishData = me.$printData.shift();
        me.$subscribes.forEach(subscribe => subscribe(finishData));
        if (me.$printData.length) {
          me.print(me.$printData[0]);
        }
      }
    };
  };

  getStatusText = (e, status) => {
    let s = 'Status: \n';
    if (status & e.ASB_NO_RESPONSE) {
      s += ' No printer response\n';
    }
    if (status & e.ASB_PRINT_SUCCESS) {
      s += ' Print complete\n';
    }
    if (status & e.ASB_DRAWER_KICK) {
      s += ' Status of the drawer kick number 3 connector pin = "H"\n';
    }
    if (status & e.ASB_OFF_LINE) {
      s += ' Offline status\n';
    }
    if (status & e.ASB_COVER_OPEN) {
      s += ' Cover is open\n';
    }
    if (status & e.ASB_PAPER_FEED) {
      s += ' Paper feed switch is feeding paper\n';
    }
    if (status & e.ASB_WAIT_ON_LINE) {
      s += ' Waiting for online recovery\n';
    }
    if (status & e.ASB_PANEL_SWITCH) {
      s += ' Panel switch is ON\n';
    }
    if (status & e.ASB_MECHANICAL_ERR) {
      s += ' Mechanical error generated\n';
    }
    if (status & e.ASB_AUTOCUTTER_ERR) {
      s += ' Auto cutter error generated\n';
    }
    if (status & e.ASB_UNRECOVER_ERR) {
      s += ' Unrecoverable error generated\n';
    }
    if (status & e.ASB_AUTORECOVER_ERR) {
      s += ' Auto recovery error generated\n';
    }
    if (status & e.ASB_RECEIPT_NEAR_END) {
      s += ' No paper in the roll paper near end detector\n';
    }
    if (status & e.ASB_RECEIPT_END) {
      s += ' No paper in the roll paper end detector\n';
    }
    if (status & e.ASB_BUZZER) {
      s += ' Sounding the buzzer (certain model)\n';
    }
    if (status & e.ASB_SPOOLER_IS_STOPPED) {
      s += ' Stop the spooler\n';
    }
    return s;
  };

  makePrintString = (lineChars, text1 = '', text2 = '') => {
    let spaces = 0;
    let tab = '';
    // ??????2??????????????????????????????????????????????????????????????????????????????????????????,???????????????
    if ((text1.length + text2.length) > lineChars) {
      text1 = text1.substr(0, lineChars - text2.length - 2);
    }
    try {
      spaces = lineChars - (text1.length + text2.length);
      for (let j = 0; j < spaces - 1; j++) {
        tab += ' ';
      }
    } catch (e) {
      console.log(e);
    }
    return text1 + tab + text2;
  };


  dispatchEvent = (...args) => {
    const listeners = this.$events;
    listeners.forEach(listener => listener(...args));
  };

  onReady = (callback) => {
    if (this.$printer) {
      callback(this.$printer);
    }
    this.$events.push(callback);
  };

  onPrintSuccess = (callback) => {
    this.$subscribes.push(callback);
  };

  addPrint = (data) => {
    this.$printData.push(data);
    if (this.$printData.length === 1) {
      this.print(this.$printData[0]);
    }
  };

  print = (data) => {
    const {
      currency,
      titles = [],
      tel,
      time,
      goodsList,
      taxExcluded,
      tax,
      taxValue,
      totalAmount,
      customerPayment,
      change
    } = data;

    for (let i = 0; i < titles.length; i++) {
      this.$printer.addText(titles[i] + '\n');
    }

    //??????????????????
    this.$printer.addTextAlign(this.$printer.ALIGN_RIGHT);
    // ?????? ????????????
    // this.$printer.addText(tel + '\n');
    // ?????? ????????????
    this.$printer.addText(time + '\n');
    // ??????????????????
    this.$printer.addTextAlign(this.$printer.ALIGN_LEFT);

    // ???4???
    this.$printer.addText('\n\n');

    // ????????????
    let printData = '';
    if (goodsList) {
      for (let i = 0; i < goodsList.length; i++) {
        if (!goodsList[i].goodsName) {
          return;  // ????????????????????????
        }
        printData = this.makePrintString(this.$lineCharsLength, goodsList[i].goodsName, currency + goodsList[i].goodsPrice);
        this.$printer.addText(printData + '\n');
      }
    } else {
      return;
    }

    // ??????
    this.$printer.addText('\n');

    // ?????? ??????????????????  ?????????4??? printer.COLOR_NONE | printer.COLOR_2 | printer.COLOR_3 | printer.COLOR_4
    this.$printer.addTextStyle(false, false, true, this.$printer.COLOR_1);
    // this.$printer.addText(this.makePrintString(this.$lineCharsLength, 'Tax excluded.', currency + taxExcluded) + '\n');
    // ????????????
    this.$printer.addTextStyle(false, false, false, this.$printer.COLOR_1);
    // this.$printer.addText(this.makePrintString(this.$lineCharsLength, 'Tax' + tax, currency + taxValue) + '\n');

    // TODO ????????????  ????????????????????????
    // printer.addHLine(0, 575, printer.LINE_THIN);
    this.$printer.addText(this.$hLne);

    // ?????????????????? FONT A +  ??????
    this.$printer.addTextFont(this.$printer.FONT_B);
    this.$printer.addTextStyle(false, false, true, this.$printer.COLOR_1);
    this.$printer.addTextSize(2, 2);
    this.$printer.addText(this.makePrintString(this.$lineCharsSecondSizeFontBLength, 'Total', currency + totalAmount) + '\n');

    // ????????????
    this.$printer.addTextStyle(false, false, false, this.$printer.COLOR_1);
    this.$printer.addTextFont(this.$printer.FONT_A);
    this.$printer.addTextSize(1, 1);
    // this.$printer.addText(this.makePrintString(this.$lineCharsLength, "Customer's payment", currency + customerPayment) + '\n');
    // this.$printer.addText(this.makePrintString(this.$lineCharsLength, 'Change', currency + change) + '\n');

    // ?????? ?????????????????????????????????
    this.$printer.addText('\n');
    this.$printer.addCut(this.$printer.CUT_FEED);


    // ??????
    this.$printer.send();
  };

}

export default Printer;