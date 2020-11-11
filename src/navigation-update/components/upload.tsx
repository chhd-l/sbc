import React, { Component } from 'react';
import { Input, Icon, Form, message } from 'antd';
import { noop, Const, QMUpload, Tips, cache } from 'qmkit';

class upload extends React.Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      storeInfo: sessionStorage.getItem(cache.STORE_INFRO) ? JSON.parse(sessionStorage.getItem(cache.STORE_INFRO)) : {},
      imageLinks: [],
      imageLinkLogo: ''
    };
  }
  _checkUploadFile = (size: number, file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif')) {
      if (file.size <= size * 1024 * 1024) {
        return true;
      } else {
        message.error('File size cannot exceed' + size + 'M');
        return false;
      }
    } else {
      message.error('File format error');
      return false;
    }
  };
  _editStoreLogo = ({ file, fileList }) => {
    this.setState({ imageLinks: fileList });

    //当所有图片都被删除时
    if (fileList.length == 0) {
      this.setState({ imageLinkLogo: '' });
      this.props.form.setFieldsValue({ imageLinkLogo: '' });
      this.props.setUrl('');
      return;
    }

    if (file.status == 'error') {
      message.error('upload failed');
      return;
    }

    //当上传完成的时候设置
    fileList = this._buildFileList(fileList);
    if (fileList && fileList.length > 0) {
      this.setState({ imageLinkLogo: fileList[0].url });
      this.props.form.setFieldsValue({ imageLinkLogo: this.state.imageLinkLogo });
      this.props.setUrl(this.state.imageLinkLogo);
    }
  };

  _buildFileList = (fileList: Array<any>): Array<any> => {
    return fileList
      .filter((file) => file.status === 'done')
      .map((file) => {
        return {
          uid: file.uid,
          status: file.status,
          url: file.response ? file.response[0] : file.url
        };
      });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { storeInfo } = this.state;
    return (
      <div className="clearfix logoImg">
        <QMUpload
          style={styles.box}
          action={Const.HOST + `/store/uploadStoreResource?storeId=${storeInfo.storeId}&companyInfoId=${storeInfo.companyInfoId}&resourceType=IMAGE`}
          listType="picture-card"
          name="uploadFile"
          onChange={this._editStoreLogo}
          fileList={this.state.imageLinks}
          accept={'.jpg,.jpeg,.png,.gif'}
          beforeUpload={this._checkUploadFile.bind(this, 1)}
        >
          {this.state.imageLinks.length >= 1 ? null : (
            <div>
              <Icon type="plus" style={styles.plus} />
            </div>
          )}
        </QMUpload>
        {getFieldDecorator('imageLinkLogo', {
          initialValue: this.props.defaultValue
        })(<Input type="hidden" />)}
      </div>
    );
  }
}
export default upload;

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  }
};
