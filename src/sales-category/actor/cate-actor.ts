import { Actor, Action } from 'plume2';
import { List, Map } from 'immutable';
import { IMap } from 'typings/globalType';

declare type IList = List<any>;

export default class CateActor extends Actor {
  defaultState() {
    return {
      cateList: [],
      dataList: [],
      allDataList: [],
      // 弹框是否显示
      modalVisible: false,
      // 表单内容
      formData: {},
      childFlag: false,
      goodsFlag: false,
      goods: {
        // 分类编号
        cateId: '',
        // 品牌编号
        brandId: '',
        // 商品名称
        goodsName: '',
        // SPU编码
        goodsNo: '',
        // 计量单位
        goodsUnit: '',
        // 上下架状态
        addedFlag: 1,
        // 商品详情
        goodsDetail: '',
        // 市场价
        mktPrice: '',
        // 成本价
        costPrice: '',
        goodsSubTitle: '',
        //商品视频
        goodsVideo: '',
        //是否允许独立设价
        allowPriceSet: 0,
        saleType: 0
      },
      sourceCateList: [],
      resCateAllList: [],
      images: [],
      video: {}
    };
  }

  /**
   * 初始化
   */
  @Action('cateActor: init')
  init(state, dataList: IList) {
    // 改变数据形态，变为层级结构

    const newDataList = dataList
      .filter((item) => item.get('cateParentId') == 0)
      .map((data) => {
        const children = dataList
          .filter((item) => item.get('cateParentId') == data.get('storeCateId'))
          .map((childrenData) => {
            const lastChildren = dataList.filter((item) => item.get('cateParentId') == childrenData.get('storeCateId'));
            if (!lastChildren.isEmpty()) {
              const sum = lastChildren.reduce(function (prev, cur) {
                return cur.productNo + prev;
              }, 1);
              childrenData = childrenData.set('children', lastChildren).set('productNo', sum);
            }
            return childrenData;
          });

        if (!children.isEmpty()) {
          const sum = children.reduce(function (prev, cur) {
            return cur.productNo + prev;
          }, 2);
          data = data.set('children', children).set('productNo', sum);
        }
        return data;
      });

    // const newDataList = dataList
    //   .filter((item) => item.get('cateParentId') == 0)
    //   .map((data) => {
    //     const children = dataList.filter((item) => item.get('cateParentId') == data.get('storeCateId'));
    //     if (!children.isEmpty()) {
    //       data = data.set('children', children);
    //     }
    //     return data;
    //   });
    return state.set('dataList', newDataList).set('allDataList', dataList);
  }

  /**
   * 修改表单内容
   */
  @Action('cateActor: editFormData')
  editCateInfo(state, data: IMap) {
    return state.update('formData', (formData) => formData.merge(data));
  }

  /**
   * 显示弹窗
   */
  @Action('cateActor: showModal')
  show(state, needClear: boolean) {
    if (needClear) {
      state = state.set('formData', Map());
    }
    return state.set('modalVisible', true);
  }

  /**
   * 关闭弹窗
   */
  @Action('cateActor: closeModal')
  close(state) {
    return state
      .set('modalVisible', false)
      .set(
        'images',
        state.get('images').filter((i) => {
          return false;
        })
      )
      .set('formData', Map());
  }

  /**
   * 检测子类
   */
  @Action('cateActor: child')
  child(state, flag: boolean) {
    return state.set('childFlag', flag);
  }

  /**
   * 检测商品关联
   */
  @Action('cateActor: goods')
  image(state, flag: boolean) {
    return state.set('goodsFlag', flag);
  }
  /**
   * 初始化分类
   * @param state
   * @param dataList
   */
  @Action('cateActor: initCateList')
  initCateList(state, dataList: IList) {
    // 改变数据形态，变为层级结构
    const newDataList = dataList
      .filter((item) => item.get('cateParentId') == 0)
      .map((data) => {
        const children = dataList
          .filter((item) => item.get('cateParentId') == data.get('cateId'))
          .map((childrenData) => {
            const lastChildren = dataList.filter((item) => item.get('cateParentId') == childrenData.get('cateId'));
            if (!lastChildren.isEmpty()) {
              childrenData = childrenData.set('children', lastChildren);
            }
            return childrenData;
          });

        if (!children.isEmpty()) {
          data = data.set('children', children);
        }
        return data;
      });
    return state.set('cateList', newDataList).set('sourceCateList', dataList);
  }
  /**
   * 修改商品信息
   * @param state
   * @param data
   */
  @Action('cateActor: editGoods')
  editGoods(state, data: IMap) {
    return state.update('formData', (formData) => formData.merge(data));
  }
  /**
   * 素材分类选择
   * @param state
   * @param cateId
   */
  @Action('cateActor: cateId')
  editCateId(state, cateId) {
    return state.set('videoCateId', cateId);
  }

  @Action('cateActor: editImages')
  editImages(state, images) {
    images = images.map((i, index) => {
      i = i.set('imageId', index);
      return i;
    });
    return state.set('images', images);
  }

  /**
   * 移除图片
   * @param state
   * @param {number} imageId
   */
  @Action('cateActor: remove')
  removeImg(state, imageId: number) {
    return state.set(
      'images',
      state.get('images').filter((i) => i.get('imageId') !== imageId)
    );
  }

  @Action('cateActor: editVideo')
  editVideo(state, video) {
    return state.set('video', video);
  }

  @Action('cateActor: deleteVideo')
  deleteVideo(state: IMap) {
    return state.set('video', {});
  }
}
