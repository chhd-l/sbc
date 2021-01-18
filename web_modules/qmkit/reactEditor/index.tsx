import React, { Component } from 'react'
import E from 'wangeditor'
interface StringArray {
    [index: number]: string;
}
class ReactEditor extends Component<any, any> {
    editor: any;
    props: {
        id: String;
        content: string;
        disabled: boolean;
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

        this.editor.create()
        disabled && this.editor.disable()
        this.editor.txt.html(this.props.content)
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