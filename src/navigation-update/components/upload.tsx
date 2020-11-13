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
      imageList: [],
      imageLogo: ''
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
    this.setState({ imageList: fileList });

    //当所有图片都被删除时
    if (fileList.length == 0) {
      this.setState({ imageLogo: '' });
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
      this.setState({ imageLogo: fileList[0].url });
      this.props.setUrl(fileList[0].url);
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

  componentDidMount() {
    let defaultValue = this.props.defaultValue;
    if (defaultValue) {
      this.setState({
        imageLogo: defaultValue,
        imageList: [
          {
            uid: 'navigation-logo',
            name: defaultValue,
            size: 1,
            status: 'done',
            url: defaultValue
          }
        ]
      });
    }
  }

  render() {
    const { storeInfo, imageList } = this.state;
    return (
      <div className="clearfix logoImg">
        <QMUpload
          style={styles.box}
          action={Const.HOST + `/store/uploadStoreResource?storeId=${storeInfo.storeId}&companyInfoId=${storeInfo.companyInfoId}&resourceType=IMAGE`}
          listType="picture-card"
          name="uploadFile"
          onChange={this._editStoreLogo}
          fileList={imageList}
          accept={'.jpg,.jpeg,.png,.gif'}
          beforeUpload={this._checkUploadFile.bind(this, 1)}
        >
          {imageList.length >= 1 ? null : (
            <div>
              <Icon type="plus" style={styles.plus} />
            </div>
          )}
        </QMUpload>
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
