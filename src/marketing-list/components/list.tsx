import * as React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { withRouter } from 'react-router';
import { DataGrid, noop, history, AuthWrapper, Const, RCi18n, cache } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { Table } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

type TList = List<IMap>;

const Column = Table.Column;

//默认每页展示的数量
const SUB_TYPE = {
  0: 'Full amount reduction',
  1: 'Full quantity reduction',
  2: 'Full amount discount',
  3: 'Full quantity discount',
  4: 'Full amount gift',
  5: 'Full quantity gift',
  6: '',
  7: ''
};
const PROMOTION_TYPE = {
  0: RCi18n({ id: 'Marketing.All' }),
  1: RCi18n({ id: 'Marketing.Autoship' }),
  2: RCi18n({ id: 'Marketing.Clubpromotion' }),
  3: RCi18n({ id: 'Marketing.Singlepurchase' }),
  4: RCi18n({ id: 'Marketing.Individualpromotion' })
};

//默认每页展示的数量
const MARKETING_STATUS = {
  0: 'All',
  1: 'In process',
  2: 'Pause',
  3: 'Not start',
  4: 'Completed'
};

@withRouter
@Relax
class MarketingList extends React.Component<any, any> {
  props: {
    history?: any;
    intl: any;
    tabkey?: string;
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      total: number;
      pageSize: number;
      currentPage: number;
      onDelete: Function;
      init: Function;
      form: any;
      onPause: Function;
      customerLevels: TList;
      onStart: Function;
      close: Function;
      download: Function;
      onPageChange: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    onDelete: noop,
    init: noop,
    form: 'form',
    onPause: noop,
    customerLevels: ['customerLevels'],
    onStart: noop,
    close: noop,
    download: noop,
    onPageChange: noop
  };

  render() {
    const {
      loading,
      dataList,
      pageSize,
      total,
      currentPage,
      init,
      onDelete,
      customerLevels,
      onPause,
      close,
      onStart,
      download,
      onPageChange
    } = this.props.relaxProps;
    console.log(1234, dataList.toJS());
    const storeId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}').storeId || '';
    // console.log('storeId', storeId)
    const isShowFirstOrder = (promotionCode) => {
      const { tabkey } = this.props;
      console.log({ tabkey, promotionCode, storeId });
      if (!tabkey) {
        return true;
      } else {
        switch (tabkey) {
          case '0':
            if ([123457910].includes(storeId)) {
              return !['NEWPET20', 'SAVE30', 'SAVE10', 'SAVE10STAFF', 'SAVE15'].includes(
                promotionCode
              );
            } else {
              return true;
            }
          case '1':
            if ([123457910].includes(storeId)) {
              return !['NEWPET20', 'SAVE30', 'SAVE10', 'SAVE10STAFF', 'SAVE15'].includes(
                promotionCode
              );
            } else {
              return true;
            }
          case '2':
            return true;
          case '3':
            return true;
          case '4':
            return true;
          default:
            return true;
        }
      }
    };
    return (
      <>
        <DataGrid
          loading={loading}
          rowKey={(record) => record.marketingId}
          isScroll={false}
          dataSource={dataList.toJS()}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (pageNum, pageSize) => {
              onPageChange(pageNum);
              init({ pageNum: pageNum - 1, pageSize });
            }
          }}
        >
          {/*<Column
          title="Campaign type"
          width="15%"
          key="marketingName"
          dataIndex="marketingName"
          ellipsis
          render={(marketingName) => {
            return marketingName ? (
              <div className="line-two">{marketingName}</div>
            ) : (
              <span>-</span>
            );
          }}
        />*/}
          <Column
            title={<FormattedMessage id="Marketing.CampaignName" />}
            key="marketingName"
            dataIndex="marketingName"
          />
          <Column
            title={<FormattedMessage id="Marketing.PromotionType" />}
            key="promotionType"
            dataIndex="promotionType"
            render={(promotionType) => {
              return PROMOTION_TYPE[promotionType];
            }}
          />
          <Column
            title={<FormattedMessage id="Marketing.CampaignType" />}
            key="subType"
            dataIndex="subType"
            render={(subType) => {
              return SUB_TYPE[subType];
            }}
          />
          <Column
            title={<FormattedMessage id="Marketing.PromotionCode" />}
            key="promotionCode"
            dataIndex="promotionCode"
          />
          <Column
            title={<FormattedMessage id="Marketing.Time" />}
            width="15%"
            render={(rowData) => {
              return (
                <div>
                  {moment(rowData['beginTime']).format(Const.TIME_FORMAT).toString()}
                  <br />
                  {moment(rowData['endTime']).format(Const.TIME_FORMAT).toString()}
                </div>
              );
            }}
          />

          {/*<Column*/}
          {/*  title="Campaign status"*/}
          {/*  width="15%"*/}
          {/*  key="joinLevel"*/}
          {/*  dataIndex="joinLevel"*/}
          {/*  render={(joinLevel) => {*/}
          {/*    if (joinLevel == '-1') {*/}
          {/*      return 'Full platform consumer';*/}
          {/*    } else if (joinLevel == '0') {*/}
          {/*      return 'All Leave';*/}
          {/*    } else if (joinLevel != '') {*/}
          {/*      return (*/}
          {/*        <Tooltip*/}
          {/*          title={joinLevel*/}
          {/*            .split(',')*/}
          {/*            .map((info) =>*/}
          {/*              customerLevels*/}
          {/*                .filter((v) => v.get('customerLevelId') == info)*/}
          {/*                .getIn([0, 'customerLevelName'])*/}
          {/*            )*/}
          {/*            .filter((v) => v)*/}
          {/*            .join('，')}*/}
          {/*        >*/}
          {/*          <div className="line-two">*/}
          {/*            {joinLevel*/}
          {/*              .split(',')*/}
          {/*              .map((info) =>*/}
          {/*                customerLevels*/}
          {/*                  .filter((v) => v.get('customerLevelId') == info)*/}
          {/*                  .getIn([0, 'customerLevelName'])*/}
          {/*              )*/}
          {/*              .filter((v) => v)*/}
          {/*              .join('，')}*/}
          {/*          </div>*/}
          {/*        </Tooltip>*/}
          {/*      );*/}
          {/*    }*/}
          {/*  }}*/}
          {/*/>*/}

          <Column
            title={<FormattedMessage id="Marketing.CampaignStatus2" />}
            width="10%"
            key="marketingStatus"
            dataIndex="marketingStatus"
            render={(marketingStatus) => {
              return <span>{MARKETING_STATUS[marketingStatus]}</span>;
            }}
          />

          <Column
            title={<FormattedMessage id="Marketing.CodeType" />}
            width="10%"
            dataIndex="publicStatus"
            render={(publicStatus) => {
              // console.log('publicStatus', publicStatus)
              switch (publicStatus) {
                case '0':
                  return (
                    <span>
                      <FormattedMessage id="Marketing.private" />
                    </span>
                  );
                case '1':
                  return (
                    <span>
                      <FormattedMessage id="Marketing.public" />
                    </span>
                  );
              }
            }}
          />
          {/*
        <Column
          title="Promotion Code"
          key="promotionCode"
          width="10%"
          dataIndex="promotionCode"
        />*/}
          <Column
            title={<FormattedMessage id="Marketing.createName" />}
            dataIndex="createName"
            key={'createName'}
          />

          <Column
            title={<FormattedMessage id="Marketing.Operation" />}
            width="15%"
            className={'operation-th'}
            render={(rowInfo) => {
              // let url = '';
              // if (rowInfo['subType'] === 0 || rowInfo['subType'] === 1 || rowInfo['subType'] === 6) {
              //   url = `/marketing-full-reduction/${rowInfo['marketingId']}`;
              // } else if (rowInfo['subType'] === 2 || rowInfo['subType'] === 3 || rowInfo['subType'] === 7) {
              //   url = `/marketing-full-discount/${rowInfo['marketingId']}`;
              // } else if (rowInfo['subType'] === 4 || rowInfo['subType'] === 5) {
              //   url = `/marketing-full-gift/${rowInfo['marketingId']}`;
              // } else if (rowInfo['subType'] === 10 || rowInfo['subType'] === 11) {
              //   // url = `/marketing-free-shipping/${rowInfo['marketingId']}`;
              //   url = `/marketing-full-reduction/${rowInfo['marketingId']}/${rowInfo['marketingType']}`;
              // } else if (rowInfo.subType === 12){
              //     url = `/subscription-benefit-setting-add/${rowInfo['marketingId']}`;
              // } else if (rowInfo.subType === 13){
              //     url = `/subscription-welcome-box-add/${rowInfo['marketingId']}`;
              // }
              let url = `/create-promotion/promotion/${rowInfo['marketingId']}`;
              if (rowInfo.subType === 12) {
                url = `/subscription-benefit-setting-add/${rowInfo['marketingId']}`;
              } else if (rowInfo.subType === 13) {
                url = `/subscription-welcome-box-add/${rowInfo['marketingId']}`;
              }
              /**
               *  marketingStatus 0 全部 ，1 进行中，2 暂停中， 3 未开始， 4已结束， 5 进行中&未开始
               *  注意： subType为12 时，marketingStatus为任何值，都可以编辑
               **/

              return (
                <div className="operation-box">
                  <AuthWrapper functionName="f_marketing_view">
                    <Tooltip placement="top" title={<FormattedMessage id="Marketing.View" />}>
                      <a
                        data-testid="iconView"
                        style={{ marginRight: 5 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          history.push({
                            pathname: `/marketing-details/${rowInfo['marketingId']}`
                          });
                        }}
                        className="iconfont iconView"
                      ></a>
                    </Tooltip>
                  </AuthWrapper>
                  <AuthWrapper functionName="f_marketing_operate">
                    <Tooltip placement="top" title={<FormattedMessage id="Marketing.Download" />}>
                      <a
                        data-testid="iconbtn-offshelf"
                        style={{ marginRight: 5 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          download(rowInfo['marketingId']);
                        }}
                        className="iconfont iconbtn-offshelf"
                      ></a>
                    </Tooltip>

                    {/* ==12 || ==13  && 状态 1 3 显示编辑按钮*/}
                    {(rowInfo.subType === 12 || rowInfo.subType === 13) &&
                      [1, 3].includes(Number(rowInfo['marketingStatus'])) && (
                        <Tooltip placement="top" title={<FormattedMessage id="Marketing.Edit" />}>
                          <a
                            data-testid="iconEdit"
                            style={{ marginRight: 5 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              history.push({
                                pathname: url
                              });
                            }}
                            className="iconfont iconEdit"
                          ></a>
                        </Tooltip>
                      )}

                    {/* !==12 && !==13 && !==16 && 状态 2 3 显示编辑按钮*/}
                    {rowInfo.subType !== 12 &&
                      rowInfo.subType !== 13 &&
                      rowInfo.subType !== 16 &&
                      [2, 3].includes(Number(rowInfo['marketingStatus'])) && (
                        <Tooltip placement="top" title={<FormattedMessage id="Marketing.Edit" />}>
                          <a
                            data-testid="iconEdit_two"
                            style={{ marginRight: 5 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              history.push({
                                pathname: url
                              });
                            }}
                            className="iconfont iconEdit"
                          ></a>
                        </Tooltip>
                      )}

                    {/* !==12 && !==13 && !==16 && 状态 1 显示编辑按钮*/}
                    {rowInfo.subType !== 12 &&
                      rowInfo.subType !== 13 &&
                      rowInfo.subType !== 16 &&
                      [1].includes(Number(rowInfo['marketingStatus'])) && (
                        <Popconfirm
                          title={<FormattedMessage id="Marketing.EditConfirm" />}
                          onConfirm={() => {
                            /* 先暂停 再去编辑 */
                            onPause(rowInfo['marketingId'], () => {
                              history.push({
                                pathname: url
                              });
                            });
                          }}
                          okText="Confirm"
                          cancelText="Cancel"
                        >
                          <Tooltip placement="top" title={<FormattedMessage id="Marketing.Edit" />}>
                            <a
                              data-testid="iconEdit_three"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                              style={{ marginRight: 5 }}
                              className="iconfont iconEdit"
                            ></a>
                          </Tooltip>
                        </Popconfirm>
                      )}

                    {rowInfo['marketingStatus'] == 2 &&
                      rowInfo['marketingName'] !== '40% скидка' &&
                      rowInfo['marketingName'] !== '25% скидка' && (
                        <Tooltip placement="top" title={<FormattedMessage id="Marketing.Open" />}>
                          <a
                            data-testid="iconbtn-open"
                            style={{ marginRight: 5 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              onStart(rowInfo['marketingId']);
                            }}
                            className="iconfont iconbtn-open"
                          ></a>
                        </Tooltip>
                      )}
                    {rowInfo['marketingStatus'] == 1 &&
                      rowInfo['marketingName'] !== '40% скидка' &&
                      rowInfo['marketingName'] !== '25% скидка' && (
                        <Tooltip placement="top" title={<FormattedMessage id="Marketing.Stop" />}>
                          <a
                            data-testid="iconbtn-stop"
                            style={{ marginRight: 5 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              onPause(rowInfo['marketingId']);
                            }}
                            className="iconfont iconbtn-stop"
                          ></a>
                        </Tooltip>
                      )}
                    {rowInfo['marketingStatus'] == 1 &&
                      rowInfo['marketingName'] !== '40% скидка' &&
                      rowInfo['marketingName'] !== '25% скидка' &&
                      isShowFirstOrder(rowInfo['promotionCode']) && (
                        <Tooltip placement="top" title={<FormattedMessage id="Marketing.Close" />}>
                          <a
                            data-testid="iconbtn-cancelall"
                            style={{ marginRight: 5 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              close(rowInfo['marketingId']);
                            }}
                            className="iconfont iconbtn-cancelall"
                          ></a>
                        </Tooltip>
                      )}
                    {rowInfo['marketingStatus'] == 3 && (
                      <Popconfirm
                        title={<FormattedMessage id="Marketing.DeleteConfirm" />}
                        onConfirm={() => onDelete(rowInfo['marketingId'])}
                        okText="Confirm"
                        cancelText="Cancel"
                      >
                        <Tooltip placement="top" title={<FormattedMessage id="Marketing.Delete" />}>
                          <a
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                            data-testid="iconDelete"
                            style={{ marginRight: 5 }}
                            className="iconfont iconDelete"
                          ></a>
                        </Tooltip>
                      </Popconfirm>
                    )}
                  </AuthWrapper>
                </div>
              );
            }}
          />
        </DataGrid>
      </>
    );
  }
}
export default injectIntl(MarketingList);
