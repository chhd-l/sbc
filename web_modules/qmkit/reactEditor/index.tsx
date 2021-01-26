import React, { Component } from 'react'
import E from 'wangeditor'
import Const from '../config';
import i18next from 'i18next'

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
    }
    constructor(props) {
        super(props);

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
            'video',  // 插入视频
           // 'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 重复
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
        const { id, tabNanme, disabled, onContentChange, toolbars } = this.props
        const elemMenu = ".editorElem-menu-" + id;
        const elemBody = ".editorElem-body-" + id;
        this.editor = new E(elemMenu, elemBody)
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        this.editor.config.onchange = (html: any) => {
            onContentChange(html, tabNanme);
        }
        this.editor.config.menus = toolbars
        this.editor.config.zIndex = 90
       /* this.editor.config.uploadImgServer =  Const.HOST + '/uploadImage4UEditor/uploadimage';
        this.editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
        this.editor.config.uploadImgMaxSize = 2048000;
        this.editor.config.uploadFileName = 'uploadFile' //提交的图片表单名称 ,
        this.uploadImage();*/
       this.editor.config.lang = 'en'
        this.editor.i18next = i18next
    //    this.editor.config.placeholder = 'Please enter the text'
        this.editor.config.uploadImgShowBase64 = true
        this.editor.create()
        disabled && this.editor.disable()
        this.editor.txt.html(this.props.content)
    }
    uploadImage=()=>{
        this.editor.config.uploadImgHooks = {
            // 上传图片之前
          
            // 图片上传并返回了结果，图片插入已成功
            success: function(xhr) {
                console.log('success', xhr)
            },
            // 图片上传并返回了结果，但图片插入时出错了
            fail: function(xhr, editor, resData) {
                console.log('fail', resData)
            },
            // 上传图片出错，一般为 http 请求的错误
            error: function(xhr, editor, resData) {
                console.log('error', xhr, resData)
            },
            // 上传图片超时
            timeout: function(xhr) {
                console.log('timeout')
            },
            // 图片上传并返回了结果，想要自己把图片插入到编辑器中
            // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
            customInsert: function(insertImgFn, result) {
                // result 即服务端返回的接口
                console.log('customInsert', result)
        
                // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
                insertImgFn(result.data[0])
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
                    <div
                        style={{
                            padding: "0 10px",
                            height: this.props.height,
                            border: "1px solid #ccc",
                            borderTop: "none"
                        }}
                        ref="editorElemBody" className={'editorElem-body-' + this.props.id}>

                    </div>
                </div>
            </div>
        );
    }
}

export default ReactEditor