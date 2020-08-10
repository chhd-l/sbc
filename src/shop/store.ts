import { Store } from 'plume2';

import { message } from 'antd';
import { fromJS, Map } from 'immutable';

import { Const, history } from 'qmkit';
import moment from 'moment';

import ModalActor from './actor/modal-actor';
import CommonActor from './actor/common-actor';
import CompanyActor from './actor/company-actor';
import * as webApi from './webapi';

export default class AppStore extends Store {
  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  bindActor() {
    return [new ModalActor(), new CommonActor(), new CompanyActor()];
  }

  /**
   * 品牌弹窗
   */
  brandModal = async () => {
    //加载所有品牌
    const { res } = await webApi.getAllBrands({
      likeBrandName: ''
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('company:allBrands', fromJS(res.context));
    } else {
      message.error(res.message);
    }
    this.transaction(() => {
      this.dispatch('modalActor: brandModal');
      this.dispatch('detail:deleteBrand', fromJS(new Array()));
    });
  };

  /**
   * 显示类目弹窗
   */
  sortModal = async () => {
    const sortsVisible = this.state().get('sortsVisible');
    const { res: cateList } = await webApi.getCateList();
    if (!sortsVisible) {
      const list = fromJS(cateList.context).map((info) => {
        const qualificationPics =
          info.get('qualificationPics') &&
          info
            .get('qualificationPics')
            .split(',')
            .map((url, index) => {
              return Map({ uid: index + 1, status: 'done', url });
            });
        info = info.set('qualificationPics', JSON.stringify(qualificationPics));
        return info;
      });
      const { res: cates } = await webApi.fetchAllCates();
      this.transaction(() => {
        this.dispatch('modal: cates', list);
        this.dispatch('modal: cate: loading: over');
        this.dispatch('modal: AllCates', fromJS(cates.context));
      });
    }
    this.transaction(() => {
      this.dispatch('modal: cate: delete', fromJS([]));
      this.dispatch('modalActor: sortModal');
      this.dispatch('detail:cate', fromJS(cateList.context));
    });
  };

  /**
   * 当前步骤
   */
  setCurrentStep = (step) => {
    this.dispatch('common: current', step);
    switch (step) {
      case 0:
        this.init();
        break;
      case 1:
        this.fetchCompanyInfo();
        break;
      case 2:
        this.fetchSignInfo(); //编辑签约信息
        break;
      case 3:
        this.initAccount();
        break;
    }
  };

  /**
   * 查询工商信息
   */
  fetchCompanyInfo = async () => {
    const { res } = (await webApi.findOne()) as any;
    this.dispatch('company: info', res.context);
  };

  /**
   * 修改工商信息字段
   */
  mergeInfo = ({ field, value }) => {
    this.dispatch('company: merge: info', { field, value });
  };

  /**
   * 保存工商信息
   */
  saveCompanyInfo = async (info) => {
    const businessLicence =
      info.get('businessLicence') && JSON.parse(info.get('businessLicence'));
    const frontIDCard =
      info.get('frontIDCard') && JSON.parse(info.get('frontIDCard'));
    const backIDCard =
      info.get('backIDCard') && JSON.parse(info.get('backIDCard'));
    info = info
      .set(
        'businessLicence',
        (businessLicence
          ? businessLicence.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      )
      .set(
        'frontIDCard',
        (frontIDCard
          ? frontIDCard.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      )
      .set(
        'backIDCard',
        (backIDCard
          ? backIDCard.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      );
    const { res } = await webApi.saveCompanyInfo(info);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('save successful!');
      this.setCurrentStep(2);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 删除分类
   */
  delCate = async (cateId) => {
    const cates = this.state()
      .get('cates')
      .filter((c) => c.get('cateId') != cateId);
    if (cates.count() <= 0) {
      message.error('请至少签约一种类目');
      return;
    }
    // 欲删除的分类信息
    const info = this.state()
      .get('cates')
      .filter((f) => f.get('contractCateId'))
      .find((c) => c.get('cateId') == cateId);

    const delIds = this.state().get('delCateIds');
    if (info) {
      const { res } = await webApi.checkExsit(cateId);
      if (res.code != Const.SUCCESS_CODE) {
        message.error(res.message);
        return;
      }
      this.dispatch('modal: cate: delete', delIds.concat(fromJS([cateId])));
    }
    this.dispatch('modal: cates', cates);
  };

  /**
   * 新增分类
   */
  addCate = (cateId) => {
    const cateSize = this.state().get('cateSize');
    if (cateSize >= 200) {
      message.error('最多可签约200个类目');
      return;
    }
    // 一级分类集合
    const firstLevel = this.state().get('allCates');
    // 二级分类集合
    const secondLevel = firstLevel.flatMap((f) => f.get('goodsCateList'));
    // 三级分类集合
    const thirdLevel = secondLevel.flatMap((f) => f.get('goodsCateList'));
    // 三级分类
    const third = thirdLevel.find((c) => c.get('cateId') == cateId);
    // 当前需要新增的三级分类
    let infos = [];
    if (third) {
      infos = [third];
    }
    // 已存在的分类Id
    const filterIds = this.state()
      .get('cates')
      .map((c) => c.get('cateId'));

    infos = infos
      .map((info) => {
        // 二级分类
        const secondLevelInfo = secondLevel.find(
          (f) => f.get('cateId') == info.get('cateParentId')
        );
        // 一级分类
        const firstLevelInfo = firstLevel.find(
          (f) => f.get('cateId') == secondLevelInfo.get('cateParentId')
        );
        // 设置后台返回的格式类型
        info = info
          .set(
            'parentGoodCateNames',
            firstLevelInfo.get('cateName') +
              '/' +
              secondLevelInfo.get('cateName')
          )
          .set('platformCateRate', info.get('cateRate'))
          .set('cateRate', '');
        return info;
      })
      .filter((f) => filterIds.every((i) => i != f.get('cateId')));
    this.dispatch('modal: cates', this.state().get('cates').concat(infos));
  };

  /**
   * 修改折扣率
   */
  changeRate = ({ rate, cateId }) => {
    const cates = this.state()
      .get('cates')
      .map((c) => {
        if (c.get('cateId') == cateId) {
          c = c.set('cateRate', rate);
        }
        return c;
      });
    this.dispatch('modal: cates', cates);
  };

  /**
   * 修改图片
   */
  changeImg = ({ imgs, cateId }) => {
    const cates = this.state()
      .get('cates')
      .map((c) => {
        if (c.get('cateId') == cateId) {
          c = c.set('qualificationPics', imgs);
        }
        return c;
      });
    this.dispatch('modal: cates', cates);
  };

  /**
   * 保存
   */
  save = async () => {
    this.dispatch('modal: cate: loading');
    const cates = this.state()
      .get('cates')
      .map((info) => {
        const qualificationPics =
          info.get('qualificationPics') &&
          JSON.parse(info.get('qualificationPics'));
        info = info.set(
          'qualificationPics',
          (qualificationPics
            ? qualificationPics.map((b) => b.thumbUrl || b.url)
            : []
          ).toString()
        );
        return info;
      });
    const delCateIds = this.state().get('delCateIds');
    const { res } = await webApi.saveSignCate({
      delCateIds,
      cateSaveRequests: cates
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('save successful!');
      this.sortModal();
    } else {
      message.error(res.message);
      this.dispatch('modal: cate: loading: over');
    }
  };

  /**
   * 同意/拒绝 注册协议
   */
  agreeOrNot = () => {
    this.dispatch('common: agree');
  };

  /**
   * 通过注册协议页面
   */
  passAgree = () => {
    this.dispatch('common: pass');
    this.setCurrentStep(0);
  };

  /**
   * 获取签约信息
   */
  fetchSignInfo = async () => {
    //获取签约分类和品牌分类
    const { res: cateList } = await webApi.getCateList();
    const { res: brandList } = await webApi.getBrandList();
    if (
      cateList.code == Const.SUCCESS_CODE &&
      brandList.code == Const.SUCCESS_CODE
    ) {
      this.transaction(() => {
        this.dispatch('detail:cate', fromJS(cateList.context));
        this.dispatch('detail:twoBrandKinds', fromJS(brandList.context));
      });
    } else {
      message.error(cateList.message);
    }
    //获取所有品牌
    this.filterBrandName('');
  };

  /**
   * 添加品牌
   * @param brand
   */
  addBrand = async (param: any) => {
    const oldBrandList = this.state().get('company').toJS().brandList;
    const otherBrands = this.state().get('otherBrands').toJS();
    if (oldBrandList.length + otherBrands.length >= 50) {
      message.error('您最多只能签约50个品牌');
      return;
    } else {
      //不存在，则push
      const brandArray = this.state().get('company').toJS().brandList;
      let count = 0;
      brandArray.map((v) => {
        if (v.brandId == param.brandId) {
          count++;
        }
      });
      if (count == 0) {
        brandArray.push({
          brandId: param.brandId,
          brandName: param.brandName,
          nickName: param.nickName,
          logo: param.logo
        });
      }
      this.dispatch('detail:updateBrands', fromJS(brandArray));
    }
  };

  /**
   * 新增自定义品牌
   */
  addNewOtherBrand = () => {
    const otherBrands = this.state().get('otherBrands').toJS();
    const num = this.state().get('num');
    const brandList = this.state().get('company').get('brandList').toJS();
    if (otherBrands.length + brandList.length >= 50) {
      message.error('最多只能添加50个品牌');
    } else {
      otherBrands.push({
        key: num,
        name: '',
        nickName: '',
        logo: '',
        authorizePic: ''
      });
    }
    this.transaction(() => {
      this.dispatch('detail:num', num + 1);
      this.dispatch('detail:addNewBrand', fromJS(otherBrands));
    });
  };

  /**
   * 删除自定义品牌
   */
  deleteOtherBrand = (contractId: number, id: number) => {
    //已删除的id集合
    let deleteBrandIdArray = this.state().get('delBrandIds').toJS();
    const otherBrands = this.state().get('otherBrands').toJS();
    const brandList = this.state().get('company').get('brandList').toJS();
    if (otherBrands.length + brandList.length <= 1) {
      message.error('请至少签约一种品牌');
    } else {
      //删除的是原来里面自增的
      if (contractId) {
        //当删除了已签约品牌时，所做的删除要存放
        deleteBrandIdArray.push(contractId);
        const newOtherBrands = otherBrands.filter(
          (v) => (v.contractBrandId && v.contractBrandId != contractId) || v.key
        );
        this.transaction(() => {
          this.dispatch('detail:deleteBrand', fromJS(deleteBrandIdArray));
          this.dispatch('detail:addNewBrand', fromJS(newOtherBrands));
        });
      } else {
        const otherBrands = this.state().get('otherBrands').toJS();
        const newOtherBrands = otherBrands.filter(
          (v) => (v.key && v.key != id) || v.contractBrandId
        );
        this.dispatch('detail:addNewBrand', fromJS(newOtherBrands));
      }
    }
  };

  /**
   * 添加自定义品牌输入框事件
   */
  onBrandInputChange = ({ ...params }) => {
    const otherBrands = this.state().get('otherBrands').toJS();
    let newOtherBrands = new Array();
    otherBrands.map((v) => {
      if (v.key && v.key == params.id) {
        v[params.field] = params.value;
      } else if (v.contractBrandId && v.contractBrandId == params.contractId) {
        v[params.field] = params.value;
      }
      newOtherBrands.push(v);
    });
    this.dispatch('detail:addNewBrand', fromJS(newOtherBrands));
  };

  /**
   * 上传品牌授权文件
   * @param imgs
   * @param brandId
   */
  changeBrandImg = ({ contractId, imgs, brandId }) => {
    //修改的原来已选中的平台品牌
    let brandList;
    if (contractId) {
      brandList = this.state()
        .get('company')
        .get('brandList')
        .map((v) => {
          if (v.get('contractBrandId') == contractId) {
            //做删除时，清空
            v = v.set(
              'authorizePic',
              JSON.parse(imgs).length == 0 ? '' : JSON.parse(imgs)
            );
          }
          return v;
        });
    } else {
      brandList = this.state()
        .get('company')
        .get('brandList')
        .map((v) => {
          if (v.get('brandId') == brandId) {
            v = v.set(
              'authorizePic',
              JSON.parse(imgs).length == 0 ? '' : JSON.parse(imgs)
            );
          }
          return v;
        });
    }
    this.dispatch('detail:updateBrands', brandList);
  };

  /**
   * 上传自定义品牌授权文件
   * @param imgs
   * @param brandId
   */
  changeOtherBrandImg = ({ imgs, contractId, brandId }) => {
    let brandList;
    //修改的原来的自定义品牌
    if (contractId) {
      brandList = this.state()
        .get('otherBrands')
        .map((v) => {
          if (v.get('contractBrandId') == contractId) {
            v = v.set('authorizePic', JSON.parse(imgs));
          }
          return v;
        });
    } else {
      brandList = this.state()
        .get('otherBrands')
        .map((v) => {
          if (v.get('key') == brandId) {
            v = v.set('authorizePic', JSON.parse(imgs));
          }
          return v;
        });
    }
    //重置自定义品牌
    this.dispatch('detail:addNewBrand', brandList);
  };

  /**
   * 上传自定义品牌的logo
   * @param imgs
   * @param brandId
   */
  changeLogoImg = ({ imgs, contractId, brandId }) => {
    let brandList;
    if (contractId) {
      brandList = this.state()
        .get('otherBrands')
        .map((v) => {
          if (v.get('contractBrandId') == contractId) {
            v = v.set(
              'logo',
              JSON.parse(imgs).length == 0 ? '' : JSON.parse(imgs)
            );
          }
          return v;
        });
    } else {
      brandList = this.state()
        .get('otherBrands')
        .map((v) => {
          if (v.get('key') == brandId) {
            v = v.set(
              'logo',
              JSON.parse(imgs).length == 0 ? '' : JSON.parse(imgs)
            );
          }
          return v;
        });
    }
    //重置自定义品牌
    this.dispatch('detail:addNewBrand', brandList);
  };

  /**
   * 删除选中的平台品牌
   */
  deleteBrand = async (contractId: string, brandId: string) => {
    const brandList = this.state().get('company').get('brandList').toJS();
    const otherBrands = this.state()
      .get('otherBrands')
      .filter((v) => v.name != '')
      .toJS();
    if (brandList.length + otherBrands.length <= 1) {
      message.error('签约品牌不能为空');
    } else {
      //已删除的id集合
      let deleteBrandIdArray = this.state().get('delBrandIds').toJS();
      if (contractId) {
        //当删除了已签约品牌时，所做的删除要存放
        deleteBrandIdArray.push(contractId);
        this.dispatch('detail:deleteBrand', fromJS(deleteBrandIdArray));
      }
      const brandArray = brandList.filter((v) => v.brandId != brandId);
      this.dispatch('detail:updateBrands', fromJS(brandArray));
    }
  };

  /**
   * 保存品牌编辑
   * @returns {Promise<void>}
   */
  saveBrandEdit = async () => {
    const storeId = this.state().get('storeId');
    const delBrandIds = this.state().get('delBrandIds').toJS();
    let brandSaveRequests = new Array();
    //选中的平台品牌
    const brandList = this.state().get('company').get('brandList').toJS();
    const otherBrands = this.state().get('otherBrands').toJS();

    brandList.map((v) => {
      let brandUrl = new Array();
      v.authorizePic.map((item) => {
        if (item) {
          if (item.response) {
            brandUrl.push(item.response[0]);
          } else {
            brandUrl.push(item.url);
          }
        }
      });
      v.authorizePic = brandUrl.join(',');
      brandSaveRequests.push(v);
    });

    otherBrands
      .filter((v) => v.name != '')
      .map((v) => {
        let otherUrl = new Array();
        v.authorizePic.map((item) => {
          if (item) {
            if (item.response) {
              otherUrl.push(item.response[0]);
            } else {
              otherUrl.push(item.url);
            }
          }
        });
        if (typeof v.logo == 'string') {
          v.logo = v.logo;
        } else {
          if (v.logo[0].url) {
            v.logo = v.logo[0].url;
          } else {
            v.logo = v.logo[0].response[0];
          }
        }
        v.authorizePic = otherUrl.join(',');
        brandSaveRequests.push(v);
      });
    //增加的自定义品牌
    const { res } = await webApi.updateBrands({
      storeId: storeId,
      delBrandIds: delBrandIds,
      brandSaveRequests: brandSaveRequests
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('save successful!');
      //弹框关闭
      this.dispatch('modalActor: brandModal');
      //重新获取签约详情
      this.fetchSignInfo();
    } else {
      message.error(res.message);
    }
  };

  initCountryDictionary = async () => {
    const { res } = await webApi.getDictionaryByType('country');
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('dictionary: country', res.context.sysDictionaryVOS);
      });
    }
  };

  initCityDictionary = async () => {
    const { res } = await webApi.getDictionaryByType('city');
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('dictionary: city', res.context.sysDictionaryVOS);
      });
    }
  };

  initLanguageDictionary = async () => {
    const { res } = await webApi.getDictionaryByType('language');
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('dictionary: language', res.context.sysDictionaryVOS);
      });
    }
  };

  initCurrencyDictionary = async () => {
    const { res } = await webApi.getDictionaryByType('currency');
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('dictionary: currency', res.context.sysDictionaryVOS);
      });
    }
  };

  initTimeZoneDictionary = async () => {
    const { res } = await webApi.getDictionaryByType('timeZone');
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('dictionary: timeZone', res.context.sysDictionaryVOS);
      });
    }
  };
  /**
   * 查询商家基本信息
   */
  init = async () => {
    const { res } = await webApi.fetchStoreInfo();
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('store: info', res.context);
        /**
         * 审核状态 0、待审核 1、已审核 2、审核未通过 -1、未开店
         */
        switch ((res.context as any).auditState) {
          /**待审核*/
          case 0:
            let header1 = {
              preTxt: '开店申请审核中',
              text: '您的开店申请正在审核中，请耐心等待！'
            };
            this.dispatch('common: header', header1);
            break;
          /**审核未通过*/
          case 2:
            let header2 = {
              preTxt: '开店申请审核未通过',
              text: '您的开店申请未通过，原因是：',
              bottomErrTxt: res.context.auditReason || '-',
              btnShow: true,
              btnTxt: '重新提交'
            };
            this.dispatch('common: header', header2);
            break;
          case null:
            //申请开店
            let header3 = { preTxt: '您没有开店噢，请提交您的开店申请' };
            this.dispatch('common: header', header3);
            break;
        }
      });
    }
  };
  /**
   * 修改商家基本信息字段
   */
  onChange = ({ field, value, zone }) => {
    //如果是省市区级联
    if (field == 'area') {
      this.transaction(() => {
        ['provinceId', 'cityId', 'areaId'].forEach((v, index) => {
          this.dispatch('company: store: merge', {
            field: v,
            value: value[index] || 0
          });
        });
      });
    } else {
      this.dispatch('company: store: merge', { field, value });
      let a = zone.match(/\d+/g);
      let b = Number(a[0] + '.' + a[1]);
      if (zone.substring(4, 5) == '+') {
        sessionStorage.setItem(
          'zoneDate',
          moment(this.GMTToStr(b))
            .subtract(1, 'days')
            .format('YYYY-MM-DD hh:mm:ss')
        );
      } else {
        sessionStorage.setItem(
          'zoneDate',
          moment(this.GMTToStr(b)).format('YYYY-MM-DD hh:mm:ss')
        );
      }
      console.log(sessionStorage.getItem('zoneDate'), 11111111111);
    }
  };

  /*
   * 格林威治标准时间GMT转换
   *
   */
  GMTToStr(time) {
    let timezone = time; //目标时区时间，东八区
    console.log('timezone:' + timezone);
    let offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
    let nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
    let targetDate = new Date(
      nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000
    );
    return targetDate;
  }
  /**
   * 入驻流程 基本信息保存
   * @param storeInfo
   * @returns {Promise<void>}
   */
  onSaveStoreInfo = async (storeInfo) => {
    const storeId = storeInfo.get('storeId');
    if (storeId != null) {
      const { res } = await webApi.editStoreInfo(storeInfo);
      if (res.code === Const.SUCCESS_CODE) {
        message.success('save successful!');
        this.setCurrentStep(1);
      } else {
        message.error(res.message);
      }
    } else {
      const { res } = await webApi.saveStoreInfo(storeInfo);
      if (res.code === Const.SUCCESS_CODE) {
        message.success('save successful!');
        this.setCurrentStep(1);
      } else {
        message.error(res.message);
      }
    }
  };

  /**
   * 店铺信息编辑
   * @param storeInfo
   * @returns {Promise<void>}
   */
  onEditStoreInfo = async (storeInfo) => {
    const { res } = await webApi.editStoreInfo(storeInfo);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('save successful!');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 店铺信息编辑
   */
  editCompanyInfo = async (info) => {
    const businessLicence =
      info.get('businessLicence') && JSON.parse(info.get('businessLicence'));
    const frontIDCard =
      info.get('frontIDCard') && JSON.parse(info.get('frontIDCard'));
    const backIDCard =
      info.get('backIDCard') && JSON.parse(info.get('backIDCard'));
    info = info
      .set(
        'businessLicence',
        (businessLicence
          ? businessLicence.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      )
      .set(
        'frontIDCard',
        (frontIDCard
          ? frontIDCard.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      )
      .set(
        'backIDCard',
        (backIDCard
          ? backIDCard.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      );
    const { res } = await webApi.saveCompanyInfo(info);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('save successful!');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 财务信息初始化
   * @param id
   * @returns {Promise<void>}
   */
  initAccount = async () => {
    const { res } = await webApi.fetchAccountDay();
    const { res: account } = await webApi.fetchAccountList();
    const { res: bank } = await webApi.fetchBaseBank();
    let newAccounts = [];
    let accounts = account.context;
    //如果有银行账号
    if (accounts != null && fromJS(accounts).count() > 0) {
      accounts.forEach((value) => {
        newAccounts.push({
          accountId: value.accountId,
          bankName: value.bankName,
          bankCode: value.bankCode,
          accountName: value.accountName,
          bankNo: value.bankNo,
          bankBranch: value.bankBranch,
          isReceived: value.isReceived,
          isDefaultAccount: value.isDefaultAccount,
          key: Math.random().toString().substring(2)
        });
      });
    } else {
      //如果没有银行账号，则默认初始化一个
      newAccounts.push({
        accountId: null,
        bankName: '',
        bankCode: '',
        accountName: '',
        bankNo: '',
        bankBranch: '',
        key: Math.random().toString().substring(2)
      });
    }
    this.transaction(() => {
      this.dispatch('company:accountDay', fromJS(res.context));
      this.dispatch('company:account', newAccounts);
      this.dispatch('company:bank', bank.context);
    });
  };

  /**
   * 新增银行结算账户
   */
  addNewAccounts = () => {
    const newAccounts = this.state()
      .getIn(['company', 'offlineAccount'])
      .toJS();
    if (newAccounts.length >= 5) {
      message.error('最多可添加5个结算账户');
      return;
    }
    newAccounts.push({
      accountId: null,
      bankName: '',
      bankCode: '',
      accountName: '',
      bankNo: '',
      bankBranch: '',
      key: Math.random().toString().substring(2)
    });

    this.dispatch('company:account', newAccounts);
  };

  /**
   * 添加银行结算账户输入框事件
   */
  onAccountInputChange = ({ id, field, value }) => {
    this.dispatch('company: account: merge', { id, field, value });
  };

  /**
   * 添加选择开户行事件
   */
  onBankNameChange = ({ id, value }) => {
    const banks = this.state().getIn(['company', 'bankList']);
    const bank = banks.filter((bank) => bank.get('bankCode') == value).first();
    let bankName = '';
    if (bank && bank.get('bankName')) {
      bankName = banks
        .find((bank) => bank.get('bankCode') == value)
        .get('bankName');
    }
    this.transaction(() => {
      this.dispatch('company: account: merge', {
        id,
        field: 'bankCode',
        value
      });
      this.dispatch('company: account: merge', {
        id,
        field: 'bankName',
        value: bankName
      });
    });
  };

  /**
   * 删除银行结算账户
   */
  deleteAccount = (id: number) => {
    const accounts = this.state().getIn(['company', 'offlineAccount']);
    let delAccountIds = this.state().getIn(['company', 'delAccountIds']);
    const accountId = accounts.get(id).get('accountId');
    if (accountId != null) {
      delAccountIds = delAccountIds.push(accountId);
    }
    this.transaction(() => {
      this.dispatch('company:account', accounts.delete(id));
      this.dispatch('company:account:delete', delAccountIds);
    });
  };

  /**
   * 保存银行结算账户
   * @returns {Promise<void>}
   */
  saveNewAccount = async () => {
    const deleteIds = this.state().getIn(['company', 'delAccountIds']).toJS();
    const offlineAccounts = this.state()
      .getIn(['company', 'offlineAccount'])
      .toJS();
    let canAdd = true;
    offlineAccounts.forEach((account) => {
      if (account.bankName == '') {
        canAdd = false;
      }
    });
    if (!canAdd) {
      message.error('银行不存在');
      return;
    }
    //增加的银行结算账户
    const { res } = await webApi.updateAccounts({
      deleteIds: deleteIds,
      offlineAccounts: offlineAccounts
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('店铺申请成功!');
      history.push('/shop-info');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 保存所有的分类和品牌编辑
   * @returns {Promise<void>}
   */
  renewAll = async () => {
    const brandList = this.state().get('company').get('brandList').toJS();
    const otherBrands = this.state().get('otherBrands').toJS();

    const cateList = this.state().get('company').get('cateList');
    if (cateList.toJS().length < 1) {
      message.error('请至少选择一种签约类目');
    } else if (brandList.length + otherBrands.length < 1) {
      message.error('请至少选择一种签约品牌');
    } else {
      //转到下一页
      this.setCurrentStep(3);
    }
  };

  /**
   * 保存所有的分类和品牌编辑以及签约日期和商家类型
   * @returns {Promise<void>}
   */
  storeRenewAll = async () => {
    const brandList = this.state().get('company').get('brandList').toJS();
    const otherBrands = this.state().get('otherBrands').toJS();

    const cateList = this.state().get('company').get('cateList');
    if (cateList.toJS().length < 1) {
      message.error('请至少选择一种签约类目');
    } else if (brandList.length + otherBrands.length < 1) {
      message.error('请至少选择一种签约品牌');
    } else {
      message.success('save successful！');
    }
  };

  /**
   * 品牌名称检索
   * @param value
   * @returns {Promise<void>}
   */
  filterBrandName = async (value: string) => {
    const { res } = await webApi.getAllBrands({
      likeBrandName: value
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('company:allBrands', fromJS(res.context));
    }
  };

  /**
   * 当前页签
   */
  setCurrentTab = (tab) => {
    this.dispatch('common:current:tab', tab);
    switch (tab) {
      case '0':
        this.init();
        break;
      case '1':
        this.fetchCompanyInfo();
        break;
      case '2':
        this.fetchSignInfo(); //编辑签约信息
        break;
      case '3':
        this.initAccount();
        break;
    }
  };

  getEnterBusiness = async () => {
    const { res } = (await webApi.getBusinessEnter()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      const businessEnter = res.context.supplierEnter;
      this.dispatch('common: businessEnter', businessEnter);
    } else {
      message.error(res.message);
    }
  };
}
