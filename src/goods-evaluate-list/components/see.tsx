import * as React from 'react';
import { Modal, Input } from 'antd';
import { Relax, IMap } from 'plume2';
import { noop } from 'qmkit';
import moment from 'moment';
import { message, Rate } from 'antd';
import GoodsImage from '../../goods-detail/components/image';
import { FormattedMessage } from 'react-intl';
const defaultImg = require('../img/none.png');

const { TextArea } = Input;

@Relax
export default class See extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
  }

  props: {
    relaxProps?: {
      modalVisible: boolean;
      modal: Function;
      arrowVisible: boolean;
      arrow: Function;
      goodsEvaluate: IMap;
      onFormFieldChange: Function;
      goodsEditEvaluate: IMap;
      saveAnswer: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    arrowVisible: 'arrowVisible',
    // 关闭弹窗
    modal: noop,
    arrow: noop,
    goodsEvaluate: 'goodsEvaluate',
    onFormFieldChange: noop,
    goodsEditEvaluate: 'goodsEditEvaluate',
    saveAnswer: noop
  };

  render() {
    const {
      modalVisible,
      arrowVisible,
      goodsEvaluate,
      onFormFieldChange
    } = this.props.relaxProps as any;
    if (!modalVisible) {
      return null;
    }
    const goodsImg = goodsEvaluate.goodsImg;
    const styles = {
      redStar: {
        color: 'red',
        fontSize: 16,
        marginLeft: 10,
        top: -5,
        position: 'relative'
      }
    };
    return (
      <Modal
        maskClosable={false}
        title={<FormattedMessage id="reviewDetail" />}
        visible={modalVisible}
        width={920}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <div className="comment-Detail-box">
          <div className="left-container">
            <div className="product">
              {goodsImg ? (
                <img className="img" src={goodsImg} />
              ) : (
                <img src={defaultImg} className="img" />
              )}
            </div>
          </div>
          <div className="right-container">
            <label className="title">{goodsEvaluate.goodsInfoName}</label>
            {goodsEvaluate.isEdit == 1 ? (
              <div className="compuctor-detail">
                <img
                  className={arrowVisible ? 'up-arrow' : 'down-arrow'}
                  src={require('../img/down-arrow.png')}
                  onClick={this._clickArrow}
                />
                <label className="title mar-top-12">修改前</label>
                {arrowVisible && (
                  <div>
                    <div className="detail">
                      {/*<span className="evaluate">评价</span>*/}
                      <span className="text">
                        <FormattedMessage id="consumerName" />：
                        {goodsEvaluate.customerName}
                      </span>
                    </div>
                    <div>
                      <span className="text">
                        <FormattedMessage id="reviewTime" />：
                        {moment(goodsEvaluate.evaluateTime).format(
                          'YYYY-MM-DD HH:mm:ss'
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text">
                        <FormattedMessage id="productRatings" />：
                      </span>
                      <Rate
                        value={goodsEvaluate.evaluateScore}
                        disabled={true}
                        style={styles.redStar}
                      />
                    </div>
                    {/*<div className="compuctor-content">*/}
                    {/*  <FormattedMessage id="content"/>：{goodsEvaluate.historyEvaluateContent}*/}
                    {/*</div>*/}
                    <div className="compuctor-content">
                      <FormattedMessage id="comments" />：
                      {goodsEvaluate.historyEvaluateAnswer}
                    </div>
                    <div className="detail">
                      <span className="text">
                        <FormattedMessage id="replyComments" />
                      </span>
                    </div>
                    <div className="compuctor-content2">
                      <TextArea
                        rows={2}
                        placeholder="Enter up to 500 characters"
                        maxLength={500}
                        defaultValue=""
                        onChange={(e) =>
                          onFormFieldChange('replyComments', e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : null}
            <div className="compuctor-detail border-b">
              <div className="detail">
                {/*<span className="evaluate">评价</span>*/}
                <span className="text">
                  <FormattedMessage id="consumerName" />：
                  {goodsEvaluate.customerName}
                </span>
              </div>
              <div className="detail">
                <span className="text">
                  <FormattedMessage id="reviewTime" />：
                  {moment(goodsEvaluate.evaluateTime).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )}
                </span>
              </div>
              <div className="detail">
                <span className="text">
                  <FormattedMessage id="productRatings" />：
                </span>
                <Rate
                  value={goodsEvaluate.evaluateScore}
                  disabled={true}
                  style={styles.redStar}
                />
              </div>
              {/*<div className="compuctor-content">*/}
              {/*  <FormattedMessage id="content"/>：{goodsEvaluate.evaluateContent}*/}
              {/*</div>*/}
              <div className="detail">
                <span className="text">
                  <FormattedMessage id="comments" />
                </span>
              </div>
              <div className="compuctor-content2">
                <TextArea
                  rows={2}
                  placeholder="Enter up to 500 characters"
                  maxLength={500}
                  defaultValue=""
                  value={goodsEvaluate.evaluateContent}
                  disabled={true}
                  onChange={(e) =>
                    onFormFieldChange('evaluateContent', e.target.value)
                  }
                />
              </div>
              <div className="detail">
                <span className="text">
                  <FormattedMessage id="replyComments" />
                </span>
              </div>
              <div className="compuctor-content2">
                <TextArea
                  rows={2}
                  placeholder="Enter up to 500 characters"
                  maxLength={500}
                  defaultValue={goodsEvaluate.evaluateAnswer}
                  onChange={(e) =>
                    onFormFieldChange('evaluateAnswer', e.target.value)
                  }
                />
              </div>
            </div>
            {goodsEvaluate.evaluateImageList &&
            goodsEvaluate.evaluateImageList.length ? (
              <div className="compuctor-detail mar-top-22">
                {
                  <ul className="drying-list">
                    <li className="dry-name">Picture</li>
                    <li className="dry-imgs">
                      {goodsEvaluate.evaluateImageList.map((v, k) =>
                        k < 5 ? (
                          <div key={k}>
                            <GoodsImage url={v.artworkUrl} />
                          </div>
                        ) : null
                      )}
                    </li>
                    <li className="dry-imgs">
                      {goodsEvaluate.evaluateImageList.map((v, k) =>
                        k >= 5 ? (
                          <div key={k}>
                            <GoodsImage url={v.artworkUrl} />
                          </div>
                        ) : null
                      )}
                    </li>
                  </ul>
                }
              </div>
            ) : null}
          </div>
        </div>
      </Modal>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = () => {
    const { saveAnswer, goodsEditEvaluate } = this.props.relaxProps;
    if (
      !goodsEditEvaluate.get('evaluateAnswer') ||
      !goodsEditEvaluate.get('evaluateAnswer').trim()
    ) {
      this._handleModelCancel();
    } else {
      saveAnswer(
        goodsEditEvaluate.get('evaluateId'),
        goodsEditEvaluate.get('evaluateContent'),
        goodsEditEvaluate.get('evaluateAnswer'),
        goodsEditEvaluate.get('isShow')
      );
    }
  };

  _clickArrow = () => {
    const { arrowVisible, arrow } = this.props.relaxProps;
    arrow(!arrowVisible);
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { modal } = this.props.relaxProps;
    modal(false);
  };
}
