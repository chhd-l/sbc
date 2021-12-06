import React from 'react';
import './index.less';
import bg from './../../assets/images/login/bg.png';
import c1 from './../../assets/images/login/c1.png';
import c2 from './../../assets/images/login/c2.png';
import person from './../../assets/images/login/person.png';
import dog1 from './../../assets/images/login/dog1.png';
import dog2 from './../../assets/images/login/dog2.png';
import i2 from './../../assets/images/i2.png';
import checkdog1 from './../../assets/images/check_dog1.png';
import checkdog2 from './../../assets/images/check_dog2.png';
import mailbox from './../../assets/images/check_mailbox.png';
import Parallax from 'parallax-js';


export function RunBoyForMobile() {
  return (
    <div className={`run-boy`}>
      <div className="i1" id="scene" >
        <div className="bg" data-depth="0.05"> <img src={bg} alt="" /></div>
        <div className="c1 img-size75" data-depth="0.3"> <img src={c1} alt="" /></div>
        <div className="c2 img-size75" data-depth="0.2"> <img src={c2} alt="" /></div>
        <div className="person img-size75" data-depth="0.17"> <img src={person} alt="" /></div>
        <div className="dog1 img-size75" data-depth="0.2"> <img src={dog1} alt="" /></div>
        <div className="dog2 img-size75" data-depth="0.3"> <img src={dog2} alt="" /></div>
      </div>
    </div>
  );
}

export function RunBoyCheckForMobile() {
  return (
    <div className={`run-boy`}>
      <div className="i1" id="scene" >
        <div className="bg" data-depth="0.05"> <img src={bg} alt="" /></div>
        <div className="person img-size75" data-depth="0.17"> <img src={mailbox} alt="" /></div>
        <div className="dog1 img-size75" data-depth="0.2"> <img src={checkdog1} alt="" /></div>
        <div className="dog2 img-size75" data-depth="0.3"> <img src={checkdog2} alt="" /></div>
      </div>
    </div>
  );
}

export function RunBoyForDesktop() {
  return (
    <>
      <div className="i1"
        /*data-calibrate-x="true"
        data-calibrate-y="true"
        data-invert-x="true"
        data-invert-y="true"
        data-limit-x="true"
        data-limit-y="10"
        data-scalar-x="2"
        data-scalar-y="8"
        data-friction-x="0.2"
        data-friction-y="0.8"*/
        id="scene"
      >
        <div className="bg" data-depth="0.05"> <img src={bg} alt="" /></div>
        <div className="c1 img-size75" data-depth="0.3"> <img src={c1} alt="" /></div>
        <div className="c2 img-size75" data-depth="0.2"> <img src={c2} alt="" /></div>
        <div className="person img-size75" data-depth="0.17"> <img src={person} alt="" /></div>
        <div className="dog1 img-size75" data-depth="0.2"> <img src={dog1} alt="" /></div>
        <div className="dog2 img-size75" data-depth="0.3"> <img src={dog2} alt="" /></div>
      </div>

      <div className="bg">
        <RunBoyBg />
      </div>
    </>
  );
}

export function RunBoyCheckForDesktop() {
  return (
    <>
      <div className="i1"
        /*data-calibrate-x="true"
        data-calibrate-y="true"
        data-invert-x="true"
        data-invert-y="true"
        data-limit-x="true"
        data-limit-y="10"
        data-scalar-x="2"
        data-scalar-y="8"
        data-friction-x="0.2"
        data-friction-y="0.8"*/
        id="scene"
      >
        <div className="bg" data-depth="0.05"> <img src={bg} alt="" /></div>
        <div className="person img-size75" data-depth="0.17"> <img src={mailbox} alt="" /></div>
        <div className="dog1 img-size75" data-depth="0.2"> <img src={checkdog1} alt="" /></div>
        <div className="dog2 img-size75" data-depth="0.3"> <img src={checkdog2} alt="" /></div>
      </div>

      <div className="bg">
        <RunBoyBg />
      </div>
    </>
  );
}

class RunBoyBg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientHeight: document.documentElement.clientHeight, // 屏幕高度
    };
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize); //增加
    let hi = document.getElementById('scene');
    try {
      new Parallax(hi);
    }catch (e){
      throw e;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize); //取消
  }

  resize() {
    this.setState({ clientHeight: document.documentElement.clientHeight }); //监听
  }

  render() {
    return (
      <div></div>
      /*<img src={bg} alt="" width="100%" height={this.state.clientHeight}/>*/
    )
  }
}