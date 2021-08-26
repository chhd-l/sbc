// 通过设置 createFromIconfontCN 方法参数对象中的 scriptUrl 字段， 即可轻松地使用已有项目中的图标。
import React from 'react';
import { Icon } from 'antd';
const SCRIPTURL = '//at.alicdn.com/t/font_1991001_6pz2fm1i3rb.js'

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: SCRIPTURL,
});

export default IconFont;