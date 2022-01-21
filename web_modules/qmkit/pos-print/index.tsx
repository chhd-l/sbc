import React, { useEffect } from 'react';
import Printer from './printer';
import WS from './websocket';

import { Const, cache } from 'qmkit';
import * as webapi from './webapi';

const WsPrint = () => {
  useEffect(() => {
    const getPosUrl = async () => {
      const { res } = await webapi.getPrintDictionary();
      if (res.code === Const.SUCCESS_CODE) {
        const item = res.context.sysDictionaryVOS[0];
        if (!item) {
          return;
        }

        const posPrint = new Printer();
        const socket = new WS();

        posPrint.connect(item.value);
        posPrint.onReady(() => {
          const { storeId } = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
          const socketUrl = storeId;
          socket.connect(socketUrl);
          socket.addEventListener('message', (msg) => {
            console.log('ws message', msg);
            if (msg.type === 'print') {
              posPrint.addPrint(msg.data);
            }
          });
          socket.addEventListener('close', () => {
            console.log('ws closed')
            setTimeout(() => {
              console.log('ws reConnect...');
              socket.reConnect(socketUrl);
            }, 1000);
          });
          socket.addEventListener('error', () => {
            console.log('ws error');
          });
        });
        posPrint.onPrintSuccess((data) => {
          console.log('send ws...', data)
          socket.send({type: 'printed', data});
        });
      }
    };

    (window as any).token && getPosUrl();
  }, []);

  return null;
};

export default WsPrint;
