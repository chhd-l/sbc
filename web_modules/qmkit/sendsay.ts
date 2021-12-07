class SendSay {
  _o = {
    sTag: '<%', //开始标签
    eTag: '%>', //结束标签
    compress: false, //是否压缩html
    escape: true,   //默认输出是否进行HTML转义
    error: function(e) {
      console.log(e)
      //错误回调
    }
  };

  _modifierMap = {
    '': (param) => this._nothing(param),
    'h': (param) => this._encodeHTML(param),
    'u': (param) => encodeURI(param)
  };

  _toString = {}.toString;

  tpl = null;

  data = null;

  constructor(tpl, data) {
    this.tpl = tpl;

    this.data = data;
  }

  _type = (x) => {
    if (x === null) {
      return 'null';
    }

    const t = typeof x;

    if (t !== 'object') {
      return t;
    }

    const c = this._toString.call(x).slice(8, -1).toLowerCase();
    if (c !== 'object') {
      return c;
    }

    if (x.constructor === Object) {
      return c;
    }

    return 'unkonw';
  };

  _isObject = (obj) => {
    return this._type(obj) === 'object';
  };

  _nothing = (param) => {
    return param;
  };

  _encodeHTML = (source) => {
    return String(source)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\\/g, '&#92;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  _compress = (html) => {
    return html.replace(/\s+/g, ' ').replace(/<!--[\w\W]*?-->/g, '');
  };

  _consoleAdapter = (cmd, msg) => {
    // tslint:disable-next-line:no-unused-expression
    typeof console !== 'undefined' && console[cmd] && console[cmd](msg);
  };

  _handleError = (e) => {
    let message = 'template.js error\n\n';

    for (let key in e) {
      message += '<' + key + '>\n' + e[key] + '\n\n';
    }
    message += '<message>\n' + e.message + '\n\n';
    this._consoleAdapter('error', message);

    this._o.error(e);

    function error() {
      return 'template.js error';
    }

    error.toString = function () {
      return '__code__ = "template.js error"';
    }
    return error;
  };

  _parse = (tpl, opt) => {
    let code = '';
    const sTag = opt.sTag;
    const eTag = opt.eTag;
    const escape = opt.escape;
    const parseHtml = (line) => {
      // 单双引号转义，换行符替换为空格
      line = line.replace(/('|")/g, '\\$1').replace(/\n/g, ' ');
      return ';__code__ += ("' + line + '")\n';
    };
    const parseJs = (line) => {
      const reg = /^(?:=|(:.*?)=)(.*)$/
      let html;
      let arr = reg.exec(line);
      let modifier;

      // = := :*=
      // :h=123 [':h=123', 'h', '123']
      if (arr) {
        html = arr[2]; // 输出
        if (Boolean(arr[1])) {
          // :开头
          modifier = arr[1].slice(1);
        } else {
          // = 开头
          modifier = escape ? 'h' : '';
        }

        return ';__code__ += __modifierMap__["' + modifier + '"](typeof (' + html + ') !== "undefined" ? (' + html + ') : "")\n';
      }

      //原生js
      return ';' + line + '\n';
    };

    const tokens = tpl.split(sTag);

    for (let i = 0, len = tokens.length; i < len; i++) {
      let token = tokens[i].split(eTag);

      if (token.length === 1) {
        code += parseHtml(token[0]);
      } else {
        //
        code += parseJs(token[0]);
        if (token[1]) {
          code += parseHtml(token[1]);
        }
      }
    }

    return code;
  };

  _compiler = (tpl, opt) => {
    const mainCode = this._parse(tpl, opt);

    const headerCode = '\n' +
      '    var html = (function (__data__, __modifierMap__) {\n' +
      '        var __str__ = "", __code__ = "";\n' +
      '        for(var key in __data__) {\n' +
      '            __str__+=("var " + key + "=__data__[\'" + key + "\'];");\n' +
      '        }\n' +
      '        eval(__str__);\n\n';


    const footerCode = '\n' +
      '        ;return __code__;\n' +
      '    }(__data__, __modifierMap__));\n' +
      '    return html;\n';

    let code = headerCode + mainCode + footerCode;
    code = code.replace(/[\r]/g, ' '); // ie 7 8 会报错，不知道为什么
    try {
      const Render = new Function('__data__', '__modifierMap__', code);
      Render.toString = function () {
        return mainCode;
      }
      return Render;
    } catch (e) {
      e.temp = 'function anonymous(__data__, __modifierMap__) {' + code + '}';
      throw e;
    }
  };

  _compile = (tpl) => {
    const me = this;
    const opt = me._o;
    let Render;

    try {
      Render = me._compiler(tpl, opt);
    } catch (e) {
      e.name = 'CompileError';
      e.tpl = tpl;
      e.render = e.temp;
      delete e.temp;
      return me._handleError(e);
    }

    const render = (data) => {
      try {
        let html = Render(data, me._modifierMap);
        html = opt.compress ? me._compress(html) : html;
        return html;
      } catch (e) {
        e.name = 'RenderError';
        e.tpl = tpl;
        e.render = Render.toString();
        return me._handleError(e)();
      }
    }

    render.toString = function () {
      return Render.toString();
    };

    return render;
  };

  _translateCode = (tpl) => {
    const switchCode = (item) => {
      if (item.includes('ELSIF')) {
        const splitELSIF = item.split('ELSIF')[1]
        return `<%}else if(${splitELSIF.trim()}){%>`;
      }
      if (item.includes('IF')) {
        const splitIF = item.split('IF')[1];
        return `<%if(${splitIF.trim()}){%>`;
      }
      if (item.includes('ELSE')) {
        return '<%}else{%>';
      }
      if (item.includes('END')) {
        return '<%}%>';
      }
      if (item.includes('FOREACH')) {
        const splitFOREACHS = item.split('FOREACH')[1].split('IN');
        return `<%for(var ${splitFOREACHS[0].trim()} of (${splitFOREACHS[1].trim()} || [])){%>`;
      }
      if (item.includes('param.url_unsub')) {
        return 'param.url_unsub'
      }
      const splitItem = item.trim().split('.').join('?.');
      return `<%=${splitItem}%>`;
    }

    const splitTpl = tpl.split('[%');

    const codes = splitTpl.map(item => {
      const splitItem = item.split('%]');
      if (splitItem.length === 1) {
        return splitItem[0];
      }
      return switchCode(splitItem[0]) + splitItem[1];
    });

    return codes.join('');
  };

  getTemplate = () => {
    if (typeof this.tpl !== 'string') {
      return '';
    }

    const fn = this._compile(this._translateCode(this.tpl));

    if (!this._isObject(this.data)) {
      return fn;
    }

    return fn(this.data);
  };

}

export default SendSay;