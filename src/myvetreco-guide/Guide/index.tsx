import React, { useMemo, useState } from 'react';
import { useSpring, animated, useTransition } from 'react-spring';
import { createPortal } from 'react-dom';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import './style.less';
type GuideProps = {
  visible: boolean;
  onClose: () => void;
};

const Guide = ({ visible, onClose }: GuideProps) => {
  const [step, setStep] = useState<keyof typeof contentMap>(1);
  const [open, setOpen] = useState(true);

  const guideBgWidthOrHeight = useMemo(() => {
    if (!visible) {
      return 0;
    }
    if (open) return 500;
    if (!open) return 250;
  }, [open, visible]);
  const opacity = useMemo(() => {
    if (!visible) {
      return 0;
    }
    return 1;
  }, [visible]);

  const guideBgStyle = useSpring({
    width: guideBgWidthOrHeight,
    opacity,
    height: guideBgWidthOrHeight
  });
  const transitionData = useMemo(() => {
    if (!visible) return false;
    return open;
  }, [open, visible]);
  const transitions = useTransition(transitionData, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 100 }
  });
  const onFold = () => setOpen(false);
  const onOpen = () => setOpen(true);

  const contentMap = {
    1: {
      desc: Step1.desc,
      content: <Step1 onNext={() => setStep(2)} />
    },
    2: {
      desc: Step2.desc,
      content: <Step2 onNext={() => setStep(3)} onFold={onFold} />
    },
    3: {
      desc: Step3.desc,
      content: <Step3 onClose={onClose} />
    }
  };
  return createPortal(
    <animated.div className="guide-bg" style={guideBgStyle}>
      {transitions(({ opacity }, item) =>
        item ? (
          <animated.div
            className="guide-container"
            style={{
              position: 'absolute',
              opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] })
            }}
          >
            <div className="guide-container-top">{contentMap[step]['desc']}</div>
            <div className="guide-container-content">{contentMap[step]['content']}</div>
            <div className="guide-container-footer">-Step {step}/3-</div>
          </animated.div>
        ) : (
          <animated.div
            className="guide-container-fold"
            onClick={onOpen}
            style={{
              position: 'absolute',
              opacity: opacity.to({ range: [1.0, 0.0], output: [1, 0] })
            }}
          ></animated.div>
        )
      )}
    </animated.div>,
    document.body
  );
};
export default Guide;
