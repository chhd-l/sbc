import React from 'react';
import { Upload, message } from 'antd';
import { Const } from 'qmkit';

const FILE_MAX_SIZE = 4 * 1024 * 1024;

export default class FileItem extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { value, onChange } = this.props;
    const uploadOption = {
      headers:{
        Accept: 'application/json',
        Authorization: 'Bearer ' + (sessionStorage.getItem('token') || ''),
      },
      name: 'uploadFile',
      fileList: [value],
      accept:'.jpg,.jpeg,.png,.pdf',
      action: `${Const.HOST}/store/uploadStoreResource?resourceType=IMAGE`,
      onChange: (info) => {
        console.log(info)
        const { file } = info;
        if (file.status === 'done') {
          if(
              file.status == 'done' &&
              file.response &&
              file.response.code &&
              file.response.code !== Const.SUCCESS_CODE
          ){
            message.error(info.file.response.message);
          }else{
            onChange(file.response.length > 0 && file.response[0])
          }
        } else if (file.status === 'error') {
          message.error(`${file.name} file upload failed.`);
        }
      },
      beforeUpload: (file)=>{
        let fileName = file.name.toLowerCase();
        // 支持的图片格式：jpg、jpeg、png、pdf
        if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.pdf')) {
          if (file.size <= FILE_MAX_SIZE) {
            return true;
          } else {
            message.error('file size cannot exceed 2M');
            return false;
          }
        } else {
          message.error('file format error');
          return false;
        }
      },
      onRemove: (promise)=>{
        console.log(promise)
        onChange('')
      }
    };

    return (
      <Upload {...uploadOption} />
    );
  }
}
