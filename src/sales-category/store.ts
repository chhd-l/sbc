import { Store, IOptions } from 'plume2';
import { fromJS, Map, List } from 'immutable';
import { message } from 'antd';
import update from 'immutability-helper';
import { IMap, IList } from 'typings/globalType';
import { Const } from 'qmkit';
import CateActor from './actor/cate-actor';
import ModalActor from './actor/modal-actor';
import SpecActor from './actor/spec-actor';
import ImageActor from './actor/image-actor';
import SeoActor from './actor/seo-actor';
import { RCi18n } from 'qmkit';

import {
  getSeo,
  editSeo,
  getCateList,
  getSignCateList,
  addCate,
  deleteCate,
  editCate,
  chkChild,
  chkGoods,
  dragSort,
  getCateIdsPropDetail,
  getImgCates,
  fetchImages
} from './webapi';
import { getDictionaryByType } from '@/shop/webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new CateActor(), new ModalActor(), new SpecActor(), new ImageActor(), new SeoActor()];
  }

  /**
   * 初始化
   */
  init = async () => {
    this.dispatch('loading:start');
    const result: any = await getCateList();
    const result1: any = await getSignCateList();
    const petType: any = await getDictionaryByType('petType');
    this.transaction(() => {
      this.dispatch('loading:end');
      this.dispatch('cateActor: init', fromJS(result.res.context));
      this.dispatch('cateActor: initCateList', fromJS(result1.res.context));
      this.dispatch('cateActor: closeModal');
      this.dispatch('cateActor: petType', fromJS(petType.res.context.sysDictionaryVOS));
    });
  };

  getSalesCateList = () => {
    this.dispatch('loading:start');
    getCateList()
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.dispatch('cateActor: init', fromJS(res.context));
          this.dispatch('loading:end');
        } else {
          this.dispatch('loading:end');
        }
      })
      .catch((err) => {
        this.dispatch('loading:end');
      });
  };

  /**
   * 刷新需要延迟一下
   */
  refresh = () => {
    setTimeout(() => {
      this.getSalesCateList();
    }, 1000);
  };

  /**
   * 显示添加框
   */
  showAddModal = () => {
    this.dispatch('cateActor: showModal', true);
  };

  /**
   * 显示修改弹窗
   */
  showEditModal = (formData: IMap, images: IMap) => {
    this.transaction(() => {
      this.dispatch('cateActor: editFormData', formData);
      this.dispatch('cateActor: editImages', images);
      this.dispatch('cateActor: showModal');
    });
  };

  /**
   * 关闭弹窗
   */
  closeModal = () => {
    this.dispatch('cateActor: closeModal');
  };

  /**
   * 修改form信息
   */
  editFormData = (formData: IMap) => {
    this.dispatch('cateActor: editFormData', formData);
  };

  /**
   * 添加品牌
   */
  doAdd = async () => {
    const formData = this.state().get('formData');
    const images = this.state().get('images');

    let imagesJs = images.toJS();
    let formDataJs = formData.toJS();
    if (imagesJs) {
      formDataJs.cateImg = JSON.stringify(imagesJs);
    }

    if (Array.isArray(formDataJs.period) && formDataJs.period.length) {
      formDataJs.periodBeginTime = formDataJs.period[0].format(Const.TIME_FORMAT);
      formDataJs.periodEndTime = formDataJs.period[1].format(Const.TIME_FORMAT);
      delete formDataJs.period;
    } else {
      formDataJs.periodBeginTime = null;
      formDataJs.periodEndTime = null;
    }
    // filterStatus
    formDataJs.filterStatus = formDataJs.filterStatus ? 1 : 0;

    let result: any;
    this.dispatch('loading:start');
    if (formData.get('storeCateId')) {
      result = await editCate(formDataJs);
    } else {
      result = await addCate(formDataJs);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('Operate successfully');
      // 刷新
      this.dispatch('cateActor: closeModal');
      this.refresh();
    } else {
      this.dispatch('loading:end');
    }
  };

  /**
   * 删除品牌
   */
  doDelete = async (storeCateId: string) => {
    this.dispatch('loading:start');
    let result: any = await deleteCate(storeCateId);
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('Operate successfully');
      // 刷新
      this.refresh();
    } else {
      this.dispatch('loading:end');
    }
  };

  /**
   * 检测商品分类是否有子类
   */
  validChild = async (storeCateId: string) => {
    this.dispatch('loading:start');
    const result: any = await chkChild(Map({ storeCateId: storeCateId }));
    if (result.res.context == 0) {
      this.dispatch('loading:end');
      this.dispatch('cateActor: child', false);
    } else if (result.res.context == 1) {
      this.dispatch('loading:end');
      this.dispatch('cateActor: child', true);
    }
  };

  /**
   * 检测商品分类是否有子类商品
   */
  validGoods = async (storeCateId: string) => {
    this.dispatch('loading:start');
    const result: any = await chkGoods(Map({ storeCateId: storeCateId }));
    if (result.res.context == 0) {
      this.dispatch('loading:end');
      this.dispatch('cateActor: goods', false);
    } else if (result.res.context == 1) {
      this.dispatch('loading:end');
      this.dispatch('cateActor: goods', true);
    }
  };

  /**
   * 拖拽排序
   * @param catePath 分类树形结构的父级路径
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @returns {Promise<void>}
   */
  cateSort = async (catePath, dragIndex, hoverIndex) => {
    let cates = this.state().get('dataList').toJS();
    //cateIds: 0|245|246|
    let cateIds = catePath.split('|');
    //拖拽排序后的列表
    let sortList: any;

    //二级分类的拖拽排序
    if (cateIds.length == 3) {
      //二级分类集合
      let secondLevel: any;
      for (let i = 0; i < cates.length; i++) {
        if (cates[i].storeCateId == cateIds[1]) {
          secondLevel = cates[i].children;
        }
      }
      const dragRow = secondLevel[dragIndex];
      sortList = update(secondLevel, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow]
        ]
      });
    } else if (cateIds.length == 2) {
      //一级分类的拖拽排序
      const dragRow = cates[dragIndex];
      sortList = update(cates, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow]
        ]
      });
    }

    let paramList = [];
    for (let index in sortList) {
      paramList.push({
        storeCateId: sortList[index].storeCateId,
        cateSort: Number(index) + 1
      });
    }
    const { res } = (await dragSort(paramList)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('Operate successfully');
      this.init();
    }
  };
  /**
   * 对应类目、商品下的所有属性信息
   */
  showGoodsPropDetail = async (cateId, goodsPropList) => {
    if (!cateId) {
      this.dispatch('propActor: clear');
    } else {
      const result: any = await getCateIdsPropDetail(cateId);
      this.editFormData(Map({ goodsCateId: cateId }));
      if (result.res.code === Const.SUCCESS_CODE) {
        let catePropDetail = fromJS(result.res.context);
        //类目属性中的属性值没有其他，拼接一个其他选项
        catePropDetail = catePropDetail.map((prop) => {
          let goodsPropDetails = prop.get('goodsPropDetails').push(
            fromJS({
              detailId: '0',
              detailName: '其他',
              select: 'select'
            })
          );
          return prop.set('goodsPropDetails', goodsPropDetails);
        });
        //将商品中的属性与属性值信息映射到类目属性里
        if (goodsPropList && catePropDetail.size > 0 && goodsPropList.size > 0) {
          goodsPropList.forEach((item) => {
            const { detailIds, propId } = item.toJS();
            const index = catePropDetail.findIndex((p) => p.get('propId') === propId);
            if (index > -1) {
              let detailList = catePropDetail.getIn([index, 'goodsPropDetails']).map((d) => {
                let detailId = detailIds.find((tmpId) => tmpId === d.get('detailId'));
                if (d.get('detailId') == detailId) {
                  return d.set('select', 'select');
                }
                return d.set('select', '');
              });
              catePropDetail = catePropDetail.setIn([index, 'goodsPropDetails'], detailList);
            }
          });
        }
        this.dispatch('propActor: setPropList', this._changeList(catePropDetail));
        this.dispatch('propActor: goodsPropDetails', catePropDetail);
      }
    }
  };
  /**
   * 将数组切为每两个元素为一个对象的新数组
   * @param propDetail
   * @private
   */
  _changeList(propDetail) {
    const newGoodsProps = new Array();
    let propArr = new Array();
    for (let i = 0; i < propDetail.size; i++) {
      if (i % 2 == 0) {
        propArr = new Array();
        newGoodsProps.push(propArr);
      }
      propArr.push(propDetail.get(i));
    }
    return fromJS(newGoodsProps);
  }
  updateGoodsForm = (goodsForm) => {
    // this.dispatch('formActor:goods', goodsForm);
  };
  /**
   * 修改商品基本信息
   */
  editGoods = (goods: IMap) => {
    if (
      goods.get('saleType') !== undefined &&
      goods.get('saleType') === 1 &&
      this.state().getIn(['goods', 'priceType']) === 1
    ) {
      this.editPriceSetting('priceOpt', 2);
    }
    this.dispatch('cateActor: editGoods', goods);
  };
  /**
   * 更改设价方式
   * @param state
   * @param priceOpt
   */
  editPriceSetting = (key: string, value: any) => {
    // this.dispatch('priceActor: editPriceSetting', { key, value });
  };
  /**
   * 初始化
   */
  initImg = async (
    { pageNum, cateId, successCount } = {
      pageNum: 0,
      cateId: null,
      successCount: 0
    }
  ) => {
    const cateList: any = await getImgCates();
    const cateListIm = this.state() && this.state().get('resCateAllList');
    if (cateId == -1 && cateList.res.length > 0) {
      const cateIdList = fromJS(cateList.res).filter((item) => item.get('isDefault') == 1);
      if (cateIdList.size > 0) {
        cateId = cateIdList.get(0).get('cateId');
      }
    }
    cateId = cateId ? cateId : this.state().get('cateId');
    const imageList: any = await fetchImages({
      pageNum,
      pageSize: 10,
      resourceName: this.state() && this.state().get('searchName'),
      cateIds: this._getCateIdsList(cateListIm, cateId),
      resourceType: 0
    });
    if (imageList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        if (cateId) {
          this.dispatch('modal: cateIds', List.of(cateId.toString()));
          this.dispatch('modal: cateId', cateId.toString());
        }
        this.dispatch('modal: imgCates', fromJS(cateList.res.context.storeResourceCateVOList));
        if (successCount > 0) {
          //表示上传成功之后需要选中这些图片
          this.dispatch(
            'modal: chooseImgs',
            fromJS(imageList.res.context).get('content').slice(0, successCount)
          );
        }
        this.dispatch('modal: imgs', fromJS(imageList.res.context));
        this.dispatch('modal: page', fromJS({ currentPage: pageNum + 1, resourceType: 0 }));
      });
    }
  };
  modalVisibleFun = async (maxCount: number, imgType: number, skuId: string) => {
    // if (this.state().get('visible')) {
    // console.log(2)
    this.initImg({
      pageNum: 0,
      cateId: '',
      successCount: 0
    });
    // }
    // if (this.state().get('videoVisible')) {
    //   this.initVideo({
    //     pageNum: 0,
    //     cateId: '',
    //     successCount: 0
    //   });
    // }
    if (maxCount) {
      //取消时候, 该值为0, 不重置, 防止页面渲染太快, 看到数量变化不友好
      this.dispatch('modal: maxCount', maxCount);
    }
    this.dispatch('modal: visible', { imgType, skuId });
  };
  /**
   * 放大还原图片
   */
  clickImg = (imgUrl: string) => {
    this.dispatch('modal: imgVisible', imgUrl);
  };
  /**
   * 移除图片
   * @param id
   */
  removeImg = ({ type, id }) => {
    if (type === 0) {
      this.dispatch('cateActor: remove', id);
    } else {
      this.dispatch('goodsSpecActor: removeImg', id);
    }
  };
  /**
   * 根据分类id,找寻自己+所有子类List
   */
  _getCateIdsList = (cateListIm, cateId) => {
    let cateIdList = new Array();
    if (cateId) {
      cateIdList.push(cateId);
      const secondCateList =
        cateListIm && cateListIm.filter((item) => item.get('cateParentId') == cateId); //找第二层子节点
      if (secondCateList && secondCateList.size > 0) {
        cateIdList = cateIdList.concat(secondCateList.map((item) => item.get('cateId')).toJS());
        const thirdCateList = cateListIm.filter(
          (item) =>
            secondCateList.filter((sec) => item.get('cateParentId') == sec.get('cateId')).size > 0
        ); //找第三层子节点
        if (thirdCateList && thirdCateList.size > 0) {
          cateIdList = cateIdList.concat(thirdCateList.map((item) => item.get('cateId')).toJS());
        }
      }
    }
    return cateIdList;
  };
  editCateId = async (value: string) => {
    this.dispatch('modal: cateId', value);
  };
  /**
   * 修改选中分类
   * @param value
   * @returns {Promise<void>}
   */
  editDefaultCateId = async (value: string) => {
    this.dispatch('modal: cateIds', List.of(value));
  };
  search = async (imageName: string) => {
    this.dispatch('modal: search', imageName);
  };
  /**
   * 点击搜索保存搜索内容
   * @param {string} searchName
   * @returns {Promise<void>}
   */
  saveSearchName = async (searchName: string) => {
    this.dispatch('modal: searchName', searchName);
  };

  /**
   * 点击搜索保存搜索内容
   * @param {string} searchName
   * @returns {Promise<void>}
   */
  saveVideoSearchName = async (videoSearchName: string) => {
    this.dispatch('modal: videoSearchName', videoSearchName);
  };

  /**
   * 点击图片
   * @param {any} check
   * @param {any} img
   */
  chooseImg = ({ check, img, chooseCount }) => {
    this.dispatch('modal: chooseImg', { check, img, chooseCount });
  };

  /**
   * 确定选择以上图片
   */
  beSureImages = () => {
    const chooseImgs = this.state().get('chooseImgs');
    const imgType = this.state().get('imgType');
    if (imgType === 0) {
      let images = this.state().get('images');
      images = images.concat(chooseImgs);
      this.dispatch('cateActor: editImages', images);
    } else if (imgType === 1) {
      const skuId = this.state().get('skuId');
      this.dispatch('goodsSpecActor: editGoodsItem', {
        id: skuId,
        key: 'images',
        value: chooseImgs
      });
    } else {
      if (this.state().get('editor') === 'detail') {
        this.state()
          .get('detailEditor')
          .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      } else {
        const name = this.state().get('editor');
        this.state()
          .get(name)
          .val.execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
      }
    }
  };
  modalVisible = async (maxCount: number, imgType: number, skuId: string) => {
    if (this.state().get('visible')) {
      this.initImg({
        pageNum: 0,
        cateId: '',
        successCount: 0
      });
    }
    // if (this.state().get('videoVisible')) {
    //   this.initVideo({
    //     pageNum: 0,
    //     cateId: '',
    //     successCount: 0
    //   });
    // }
    if (maxCount) {
      //取消时候, 该值为0, 不重置, 防止页面渲染太快, 看到数量变化不友好
      this.dispatch('modal: maxCount', maxCount);
    }
    this.dispatch('modal: visible', { imgType, skuId });
  };
  /**
   * 修改商品图片
   */
  editImages = (images: IList) => {
    this.dispatch('cateActor: editImages', images);
  };
  /**
   * 清除选中的图片集合
   */
  cleanChooseImgs = () => {
    this.dispatch('modal: cleanChooseImg');
  };

  setSeoModalVisible = (visible) => {
    this.dispatch('seoActor: seoModal', visible);
  };

  updateSeoForm = ({ field, value }) => {
    this.dispatch('seoActor: seoForm', { field, value });
  };

  getSeo = async (storeCateId, type = 2) => {
    this.setCurrentStoreCateId(storeCateId);
    this.setSeoModalVisible(true);
    this.dispatch('loading:start');
    const { res } = (await getSeo(storeCateId, type)) as any;
    if (res.code === Const.SUCCESS_CODE && res.context && res.context.seoSettingVO) {
      let title = null;
      let description = null;
      let keywords = null;
      this.dispatch('loading:end');

      const loginInfo = JSON.parse(sessionStorage.getItem('s2b-supplier@login'));
      if (loginInfo) {
        switch (loginInfo.storeId) {
          case 123457910: //"美国"
            title = 'Royal Canin | {name}s';
            description = null;
            keywords = null;
            break;
          // case 123457911: //"土耳其"
          //   title = '{name} {subtitle} | Royal Canin Türkiye';
          //   description = '{name} {subtitle} Royal Canin resmi mağazasında. "X" TL üzeri siparişlerinizde ücretsiz kargo. Sipariş verin veya mama aboneliğinizi başlatın!';
          //   keywords = '{name}, {subtitle}, {sales category}, {tagging}';
          //   break;
          // case 123457907: //"俄罗斯"
          //   title = 'Купить {technology} корм Royal Canin {name} в официальном интернет-магазине';
          //   description = 'Купить {technology} корм Royal Canin {name} со скидкой 10% при оформлении подписки. Сделайте заказ в интернет-магазине Royal Canin уже сегодня!';
          //   keywords = '{name}, {subtitle}, {sales category}, {tagging}';
          //   break;
          case 123456858: //墨西哥
            title = 'TIENDA OFICIAL DE PRODUCTOS VETERINARIOS ROYAL CANIN MEXICO';
            description = null;
            keywords = null;
            break;
          case 123457915: // se
            title = ' {name} – {sales category}| Royal Canin Shop';
            description =
              ' Köp Royal Canin {name} djurmat, {subtitle}. Gör en beställning på Royal Canin onlinebutik idag!';
            break;
          default:
            title = 'Royal Canin | {name}s';
            description = '{description}';
            keywords = '{name}, {subtitle}, {sales category}, {tagging}';
        }
      }
      this.dispatch(
        'seoActor: setSeoForm',
        fromJS({
          titleSource:
            res.context.seoSettingVO.updateNumbers && res.context.seoSettingVO.updateNumbers > 0
              ? res.context.seoSettingVO.titleSource
              : title,
          metaKeywordsSource:
            res.context.seoSettingVO.updateNumbers && res.context.seoSettingVO.updateNumbers > 0
              ? res.context.seoSettingVO.metaKeywordsSource
              : '',
          metaDescriptionSource:
            res.context.seoSettingVO.updateNumbers && res.context.seoSettingVO.updateNumbers > 0
              ? res.context.seoSettingVO.metaDescriptionSource
              : '',
          headingTag: res.context.seoSettingVO.headingTag ? res.context.seoSettingVO.headingTag : ''
        })
      );
      this.dispatch('seoActor: updateNumbers', res.context.seoSettingVO.updateNumbers);
    } else {
      this.dispatch('loading:end');
    }
  };
  editSeo = async (params) => {
    this.dispatch('loading:start');
    const updateNumbers = this.state().get('updateNumbers') + 1;
    const { res } = (await editSeo({ ...params, updateNumbers })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('loading:end');
      message.success('Save successfully.');
      this.setSeoModalVisible(false);
    } else {
      this.dispatch('loading:end');
    }
  };
  setCurrentStoreCateId = (storeCateId) => {
    this.dispatch('seoActor: currentStoreCateId', storeCateId);
  };

  clear = () => {
    this.dispatch('seoActor: clear');
  };
  //更新显示状态
  updateDisplayStatus = (params) => {
    editCate(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        // 刷新
        this.refresh();
      }
    });
  };
}
