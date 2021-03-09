import React, { Component } from 'react'
import E from 'wangeditor'
import Const from '../config';
import lang from './lang/index.js'
import i18next from 'i18next'
import { message, Spin } from 'antd';
import { cache } from 'qmkit'
import _ from 'lodash';
interface StringArray {
    [index: number]: string;
}
class ReactEditor extends Component<any, any> {
    editor: any;
    props: {

        id: String;
        content: string;
        disabled?: boolean;
        height: number;
        onContentChange: Function;
        toolbars?: StringArray;
        tabNanme?: string
        count?: number
        contentType?: string
        cateId?: any
        fontNames?: any
    }
    constructor(props) {
        super(props);

    }
    state = {
        loading: false
    }
    static defaultProps = {
        toolbars: [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            'emoticon',  // 表情
            'image',  // 插入图片
            'table',  // 表格
            // 'video',  // 插入视频
            // 'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 重复
        ],
        fontNames: [
            // '黑体',
            // '仿宋',
            // '楷体',
            // '标楷体',
            // '华文仿宋',
            // '华文楷体',
            // '宋体',
            // '微软雅黑',
            'Arial',
            'Tahoma',
            'Verdana',
            'Times New Roman',
            'Courier New',
        ]
    };

    componentDidMount() {
        if (this.props.id) {
            this.initEditor()
        }
    };
    /**
     * 初始化编辑器
     */
    initEditor() {
        const { id, tabNanme, disabled, onContentChange, toolbars, fontNames, content } = this.props
        const elemMenu = ".editorElem-menu-" + id;
        const elemBody = ".editorElem-body-" + id;

        this.editor = new E(elemMenu, elemBody)
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        this.editor.config.onchange = (html: any) => {
            let text = this.editor.txt.text();
            if (this.props.count && text.length > this.props.count) {
                message.info('More than 1000 words, please delete some after retry')
                return
            }
            onContentChange(html, tabNanme);

        }
        this.editor.config.focus = false
        this.editor.config.menus = toolbars
        this.editor.config.fontNames = fontNames
        this.editor.config.zIndex = 90
        this.editor.config.onchangeTimeout = 500
        this.uploadImage();
        this.editor.config.lang = 'en'
        this.editor.i18next = i18next
        this.editor.create()

        this.editor.txt.html(content)
        disabled && this.editor.disable()
    }
    uploadImage = () => {
        const _this = this;
        const userInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')
        this.editor.config.uploadImgMaxLength = 1;
        this.editor.config.uploadImgServer = Const.HOST + `/store/uploadStoreResource?cateId=${this.props.cateId}&storeId=${userInfo.storeId}&companyInfoId=${userInfo.companyInfoId}&resourceType=IMAGE`;
        this.editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
        this.editor.config.uploadImgMaxSize = 10 * 1024 * 1024;
        this.editor.config.withCredentials = true
        this.editor.config.uploadImgHeaders = {
            Authorization: `Bearer ${userInfo.token}`
        }
        this.editor.config.uploadFileName = 'uploadFile' //提交的图片表单名称 ,
        this.editor.config.uploadImgHooks = {
            // 上传图片之前
            before: function (xhr) {
                _this.setState({
                    loading: true
                })
            },
            // 图片上传并返回了结果，图片插入已成功
            success: function (xhr) {

            },
            // 图片上传并返回了结果，但图片插入时出错了
            fail: function (xhr, editor, resData) {
                _this.setState({
                    loading: false
                })
            },
            // 上传图片出错，一般为 http 请求的错误
            error: function (xhr, editor, resData) {
                _this.setState({
                    loading: false
                })
            },
            // 上传图片超时
            timeout: function (xhr) {
                _this.setState({
                    loading: false
                })
            },
            // 图片上传并返回了结果，想要自己把图片插入到编辑器中
            // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
            customInsert: function (insertImgFn, result) {
                // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
                insertImgFn(result[0])
                _this.setState({
                    loading: false
                })
            }
        }
    }
    componentWillUnmount() {
        // 清除实例
        setTimeout(() => {
            this.editor.destroy()
            this.editor = null
        }, 1000)
    }
    render() {
        return (
            <div className="shop">
                <div className="text-area" >
                    <div ref="editorElemMenu"
                        style={{ backgroundColor: '#f1f1f1', border: "1px solid #ccc" }}
                        className={"editorElem-menu-" + this.props.id}>

                    </div>
                    <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
                        <div
                            style={{
                                padding: "0 10px",
                                height: this.props.height,
                                border: "1px solid #ccc",
                                borderTop: "none"
                            }}
                            ref="editorElemBody" className={'editorElem-body-' + this.props.id}>

                        </div>
                    </Spin>
                </div>
            </div>
        );
    }
}

export default ReactEditor
