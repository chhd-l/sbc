import React, { Component } from 'react';

import { List } from 'immutable';
import { Icon } from 'antd';

export default class ImageLibraryUpload extends Component<any, any> {
  props: {
    images: List<any>;
    imgCount: number;
    imgType: number;
    skuId: String;
  };
  clickImg = (url) => {};
  removeImg = (obj) => {};
  modalVisible = (imgCount, imgType, skuId) => {};

  render() {
    const { images, imgCount, imgType, skuId } = this.props;
    return (
      <div>
        {images &&
          images.map((v) => {
            return (
              <div key={v.get('imageId')}>
                <div className="ant-upload-list ant-upload-list-picture-card">
                  <div className="ant-upload-list-item ant-upload-list-item-done">
                    <div className="ant-upload-list-item-info">
                      <span>
                        <a className="ant-upload-list-item-thumbnail" href="" target="_blank" rel="noopener noreferrer">
                          <img src={v.get('artworkUrl') || v.get('url')} alt={v.get('imageName')} />
                        </a>
                      </span>
                    </div>
                    <span className="ant-upload-list-item-actions">
                      <i className="anticon anticon-eye-o" onClick={() => this.clickImg(v.get('artworkUrl') || v.get('url'))}>
                        <Icon type="eye" />
                      </i>
                      <i
                        title="Remove file"
                        onClick={() =>
                          this.removeImg({
                            type: skuId ? 1 : 0,
                            id: skuId ? skuId : v.get('imageId')
                          })
                        }
                        className="anticon anticon-delete"
                      >
                        <Icon type="delete" />
                      </i>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        {images && images.count() < 10 ? (
          <div onClick={() => this.modalVisible(imgCount, imgType, skuId)} style={styles.addImg}>
            <div style={styles.imgBox}>
              <Icon type="plus" style={styles.plus} />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const styles = {
  plus: {
    color: '#999',
    fontSize: '28px'
  } as any,
  addImg: {
    border: '1px dashed #d9d9d9',
    width: 96,
    height: 96,
    borderRadius: 4,
    textAlign: 'center',
    display: 'inline-block',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fbfbfb'
  } as any,
  imgBox: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItem: 'center',
    justifyContent: 'center',
    padding: '32px 0'
  } as any
};
