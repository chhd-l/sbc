import * as React from 'react';
import { QMUpload, Const } from 'qmkit';
import { Modal, Form, Input, message, Tree, Row, Col, Button, Checkbox, Pagination } from 'antd';
import * as webapi from './webapi';


const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const FILE_MAX_SIZE = 2 * 1024 * 1024;

export default class PicModal extends React.Component<any, any> {
  props: {
  };


  constructor(props) {
    super(props);
  }

  state = {
    visible: true,
    cateList:[],
    imgs:null,
    clickImgsCount:0,
    choosedImgCount:0,
    clickEnabled:true,
    cateId:'',
    searchImageName:'',
    cateIds:[],

    currentPage:1,
    total:0,
    pageSize:10,



    successCount: 0, // 成功上传数量
    uploadCount: 0, // 总上传数量
    errorCount: 0, // 失败上传数量
    fileList: [] // 上传文件列表
  };

  componentDidMount(){
    this.getCateList()
  }


  handleCancel = () => {
    this.setState({
      successCount: 0,
      uploadCount: 0,
      errorCount: 0
    });
  };

  //获取
  getCateList = () =>{
    webapi.getImgCates().then(data=>{
      const {res} = data
      if(res){
        let cateIds = []
        cateIds.push(res[0].cateId)
        this.setState({
          cateIds,
          cateList: res
      },()=>{
        this.initImages()
      })
    } 
    }).catch(err=>{
      message.error(err.toString()||'Operation failure')
    })

  }

  getImages = () =>{
    const {cateIds,currentPage,pageSize,searchImageName}= this.state
    let params={
      cateIds: cateIds,
      pageNum: currentPage-1,
      pageSize: pageSize,
      resourceName: searchImageName,
      resourceType: 0,
    }
    webapi.fetchImages(params).then(data=>{
      const {res} = data
      if(res.code=== Const.SUCCESS_CODE){
        let imgs = res.context.content
        let total = res.context.total
        if(imgs){
          this.setState({
            imgs,
            total
          })
        }
        
      }else{
        message.error(res.message||'Operation failure')
      }
    }).catch(err=>{
      message.error(err.toString()||'Operation failure')
    })
  }

  initImages=()=>{
    this.setState({
      currentPage:1,
      searchImageName:""
    },()=>{
      this.getImages()
    })
    
  }

   /**
   * 修改搜索数据
   */
  editSearchData = (e) => {
    this.setState({
      searchImageName:e.target.value
    })
  };
  // 改变数据形态，变为层级结构
  cates(cateList) {
    // 改变数据形态，变为层级结构
    const newDataList = cateList
      .filter((item) => item.cateParentId === 0)
      .map((data) => {
        const children = cateList
          .filter((item) => item.cateParentId == data.cateId)
          .map((childrenData) => {
            const lastChildren = cateList.filter((item) => item.cateParentId === childrenData.cateId);
            if (!lastChildren) {
              childrenData.children = lastChildren;
            }
            return childrenData;
          });

        if (children) {
          data.children = children;
        }
        return data;
      });
    return newDataList;
  }
  /**
   * 选择分类
   * @param value 选中的id
   * @private
   */
  selectCate = (value) => {
    console.log(value);
    
  };

 

  /**
   * 查询
   */
  search = () => {
    this.setState({
      currentPage:1
    },()=>{
      this.getImages()
    })
  };

  /**
   * 分页
   * @param pageNum
   * @private
   */
  handlePageChange = (page) => {
    debugger
    this.setState({
      currentPage:page
    },()=>{
      this.getImages()
    })
    
  };

  /**
   * 改变图片
   */
  uploadImages = async (info) => {
    const { file } = info;
    const status = file.status;
    let fileList = info.fileList;
    if (status === 'done') {
      if (file.response && file.response.code && file.response.code !== Const.SUCCESS_CODE) {
        this.setState({
          errorCount: this.state.errorCount + 1
        });
      } else {
        this.setState({
          successCount: this.state.successCount + 1
        });
        message.success(`${file.name} 上传成功！`);
      }
    } else if (status === 'error') {
      this.setState({
        errorCount: this.state.errorCount + 1
      });
    }
    //仅展示上传中的文件列表
    fileList = fileList.filter((f) => f.status == 'uploading');
    this.setState({ fileList });
    if (this.state.successCount > 0 && this.state.successCount + this.state.errorCount === this.state.uploadCount) {
     console.log('init');
     
      this.setState({
        successCount: 0,
        errorCount: 0,
        uploadCount: 0
      });
    }
  };

  /**
   * 检查文件格式
   */
  checkUploadFile = (file, fileList) => {
    const { choosedImgCount } = this.state;
    this.setState({
      uploadCount: fileList.length,
      errorCount: 0
    });
    if (fileList.length > choosedImgCount) {
      if (fileList.filter((f) => f.uid).length == fileList.length) {
        message.error(`Upload up to ${choosedImgCount} pictures at a time`);
      }
      return false;
    }
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif')) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('The file size cannot exceed 2M');
        return false;
      }
    } else {
      message.error('File format error');
      return false;
    }
  };

  /**
   * 点击图片
   * @param e
   * @param v
   * @private
   */
  chooseImg = (e, v) => {
    console.log('chooseImg');
    
  };

  /**
   * 确认选择的图片
   * @private
   */
  handleOk = () => {
    this.setState({
      successCount: 0,
      uploadCount: 0,
      errorCount: 0
    });
  };

  /**
   * 清除选中的图片
   * @private
   */
  handleUploadClick = () => {
    const { cateId } = this.state;
    if (cateId) {
      console.log('清除选中');
      
    } else {
      message.error('Please select picture category');
    }
  };

  render() {
    const { visible,cateList,choosedImgCount,clickImgsCount,cateId,searchImageName,cateIds,imgs,currentPage,total,pageSize } = this.state

    //分类列表生成树形结构
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.children && item.children.length>0) {
          return (
            <TreeNode key={item.cateId} value={item.cateId} title={item.cateName}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.cateId} value={item.cateId} title={item.cateName} />;
      });

    return (
      <Modal
        maskClosable={false}
        title={
          <div style={styles.title}>
            <h4>Picture library</h4>
            <span style={styles.grey}>
              <strong style={styles.dark}>{clickImgsCount}</strong> has been selected and up to <strong style={styles.dark}>{choosedImgCount}</strong> can be selected
            </span>
          </div>
        }
        visible={visible}
        width={880}
        zIndex={200}
        onCancel={this.handleCancel}
        onOk={() => this.handleOk()}
      >
        <div>
          <Row style={styles.header}>
            <Col span={4}>
              <QMUpload
                name="uploadFile"
                onChange={this.uploadImages}
                showUploadList={{
                  showPreviewIcon: false,
                  showRemoveIcon: false
                }}
                action={Const.HOST + `/store/uploadStoreResource?cateId=${cateId}&resourceType=IMAGE`}
                multiple={true}
                disabled={cateId ? false : true}
                accept={'.jpg,.jpeg,.png,.gif'}
                beforeUpload={this.checkUploadFile}
                fileList={this.state.fileList}
              >
                <Button size="large" onClick={() => this.handleUploadClick()}>
                  Local upload
                </Button>
              </QMUpload>
            </Col>
            <Col span={10}>
              <Form layout="inline">
                <FormItem>
                  <Input placeholder="Please enter the content" value={searchImageName} onChange={(e) => this.editSearchData(e)} />
                </FormItem>
                <FormItem>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      this.search();
                    }}
                    type="primary"
                    icon="search"
                    shape="round"
                    htmlType="submit"
                  >
                    Search
                  </Button>
                </FormItem>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <div style={{ height: 560, overflowY: 'auto' }}>
                <Tree className="draggable-tree" defaultExpandedKeys={cateIds} defaultSelectedKeys={cateIds} selectedKeys={cateIds} onSelect={this.selectCate}>
                  {loop(this.cates(cateList))}
                </Tree>
              </div>
            </Col>
            <Col span={1} />
            <Col span={17}>
              <div style={styles.box}>
                { imgs&&imgs.map((v, k) => {
                  return (
                    <div style={styles.navItem} key={k}>
                      <div style={styles.boxItem}>
                        <Checkbox className="big-check" checked={v.checked} onChange={(e) => this.chooseImg(e, v)} />
                        <img src={v.artworkUrl} alt="" width="100" height="100" />
                      </div>
                      <p style={styles.name}>{v.resourceName}</p>
                    </div>
                  );
                })}
              </div>
              {imgs&&imgs.length > 0 ? null : (
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    color: 'rgba(0, 0, 0, 0.43)'
                  }}
                >
                  <span>
                    <i className="anticon anticon-frown-o" />
                    No data
                  </span>
                </div>
              )}
            </Col>
          </Row>
          { imgs&&imgs.length > 0 ? <Pagination onChange={this.handlePageChange} current={currentPage} total={total} pageSize={pageSize} /> : null}
        </div>
      </Modal>
    );
  }

  
}

const styles = {
  header: {
    paddingBottom: 15,
    borderBottom: '1px solid #ddd'
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: '20px'
  } as any,
  navItem: {
    width: 120,
    marginBottom: 15,
    marginRight: 14
  },
  boxItem: {
    width: '120px',
    height: '120px',
    padding: '10px',
    position: 'relative',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  detail: {
    height: '20px',
    lineHeight: '20px',
    overflow: 'hidden'
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  grey: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 10
  },
  dark: {
    color: '#333333'
  },
  name: {
    height: 20,
    overflow: 'hidden',
    width: '100%',
    marginTop: 5,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
} as any;
