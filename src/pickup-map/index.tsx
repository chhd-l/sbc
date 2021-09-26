import React, { Component } from 'react';
import { Spin } from 'antd';
import './index.less';

class PickupMap extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      mapLoading: true,
      city: ''
    };
  }
  componentDidMount() {
    // 初始化地图控件。在完全绘制页面后调用。
    document.addEventListener('DOMContentLoaded', () => {
      kaktusMap({
        domain: 'shop3505331',
        host: '//app.kak2c.ru'
      });
    });

    // 地图控件点击事件
    document.addEventListener('kaktusEvent', (e: any) => {
      try {
        // 传递给父页面
        window.parent.postMessage(e.detail, '*');
      } catch (error) {
        console.log('666 >>> error: ', error);
      }
    });

    // 页面加载完后打开地图
    window.addEventListener('load', () => {
      console.log('666 >>> 页面加载完后打开地图');
      this.setState({
        mapLoading: false
      });
      this.sendMsgLoadComplete();

      // 接收父页面发来的数据
      window.addEventListener(
        'message',
        (e) => {
          console.log('666 >>> 接收组件发来的数据: ', e.data?.msg);
          if (e?.data?.msg) {
            let msg = e.data.msg;
            if (msg == 'clearMap') {
              // 关闭地图，避免下次打开地图数据异常
              if (document.getElementsByClassName('close-button')[0]) {
                let closeBtn: HTMLElement = document.getElementsByClassName('close-button')[0] as HTMLElement;
                closeBtn.click();
              }
            } else {
              this.setState({
                city: msg
              });
              this.openKaktusWidget(msg);
            }
          }
        },
        false
      );
    });
  }

  // 打开地图
  openKaktusWidget = (city: string) => {
    console.log('666 >>> 打开地图city: ', city);
    window.kaktusMap.openWidget({
      city_from: 'Москва',
      city_to: city,
      dimensions: {
        height: 10,
        width: 10,
        depth: 10
      },
      weight: 600
    });
  };

  // 页面加载完成后向父级发送数据
  sendMsgLoadComplete = () => {
    try {
      window.parent.postMessage({ loading: 'succ' }, '*');
    } catch (error) {
      console.log('666 >>> error: ', error);
    }
  };
  render() {
    const { mapLoading } = this.state;
    return (
      <>
        {/* <Spin spinning={mapLoading}>
        </Spin> */}
          <div className="pickup_map_box">
            <div id="kaktusMap"></div>
          </div>
      </>
    );
  }
}

export default PickupMap;
