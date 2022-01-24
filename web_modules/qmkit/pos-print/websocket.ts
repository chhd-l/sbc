import { Const } from 'qmkit';

let host = 'wss://' + window.location.host + '/api';

if (Const.HOST.includes('https:')) {
  host = Const.HOST.replace('https:', 'wss:');
}

const WS_DOMAIN = `${host}/WebSocket`;


// 支持的事件
const Events = {
  open: 'open',
  close: 'close',
  error: 'error',
  message: 'message'
};

class WS {
  $ws = null;
  $wsDomain = null;
  $events = {};

  constructor(url = WS_DOMAIN) {
    this.$wsDomain = url;
  }

  connect = (userId) => {
    if (this.isConnect()) {
      this.$ws.close();
    }
    this.doConnect(userId);
  };

  reConnect = (userId) => {
    if (this.isConnect()) {
      return;
    }
    this.doConnect(userId);
  };

  doConnect = (userId) => {
    this.$ws = new WebSocket(`${this.$wsDomain}/${userId}`);
    this.$ws.addEventListener('open', this.onOpen);
    this.$ws.addEventListener('close', this.onClose);
    this.$ws.addEventListener('error', this.onError);
    this.$ws.addEventListener('message', this.onMessage);
  };

  isConnect = () => {
    return this.$ws && this.$ws.readyState === WebSocket.OPEN;
  };

  onOpen = () => {
    this.dispatchEvent(Events.open);
  };

  onClose = () => {
    this.dispatchEvent(Events.close);
  };

  onError = (e) => {
    console.error('ws', e);
    this.dispatchEvent(Events.error);
  };

  onMessage = (e) => {
    try {
      const { type, data } = JSON.parse(e.data);
      this.dispatchEvent(Events.message, { type, data });
    } catch (e) {
      // ignore json parse error
    }
  };

  send = ({ type, data }, repeat = 0) => {
    if (!this.$ws && !this.isConnect()) {
      repeat++;
      if (repeat > 10) {
        console.error(`websocket error.`);
        return;
      }
      setTimeout(() => {
        this.send({ type, data }, repeat);
      }, 2000);
      return;
    }
    if (!type) {
      throw new Error('推送类型非空');
    }
    this.$ws.send(JSON.stringify({ type, data }));
  };

  dispatchEvent = (event, ...args) => {
    const listeners = this.$events[event] || [];
    listeners.forEach(listener => listener(...args));
  };

  addEventListener = (event, callback) => {
    if (!Events[event]) {
      console.warn('不支持此事件');
      return;
    }
    this.$events[event] = this.$events[event] || [];
    this.$events[event].push(callback);
  };

  removeEventListener = (event, callback) => {
    if (!Events[event]) {
      return;
    }
    const listeners = this.$events[event];
    if (!listeners) {
      return;
    }
    const index = listeners.indexOf(callback);
    if (index === -1) {
      return;
    }
    listeners.splice(index, 1);
  };
}

export default WS;