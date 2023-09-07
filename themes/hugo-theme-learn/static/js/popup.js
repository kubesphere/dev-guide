(function () {
  'use strict';

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Noto+Sans+SC:wght@400;500;700&display=swap';
  var head = document.head || document.getElementsByTagName('head')[0];
  head.appendChild(link);
  var cookie = function cookie(n, v, p) {
    if (typeof v !== 'undefined') {
      window.document.cookie = "".concat([n, '=', encodeURIComponent(v)].join(''), ";path=").concat(p || '/');
    } else {
      v = window.document.cookie.match(new RegExp("(?:\\s|^)".concat(n, "\\=([^;]*)")));
      return v ? decodeURIComponent(v[1]) : null;
    }
  };
  var cssContent = "\n.toast-container {\n    cursor: default;\n    position: fixed;\n    bottom: 20px;\n    right: 20px;\n    background: url('https://ks-com-cn-staging.pek3b.qingstor.com/images/common/communication-group-bg.png') no-repeat;\n    box-shadow: 0px 4px 8px 0px rgba(36, 46, 66, 0.2);\n    background-size: cover;\n    z-index: 3;\n    border-radius: 10px;\n    z-index: 9999;\n}\n\n.toast {\n    max-width: 320px;\n    padding: 20px;\n    background-size: cover;\n    color: #fff;\n    border-radius: 10px;\n    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);\n   \n}\n\n.close {\n    cursor: pointer;\n    position: absolute;\n    top: 12px;\n    right: 12px;\n    height: 24px;\n    width: 24px;\n}\n\n.contentWrapper {\n    flex-direction: column;\n    display: flex;\n    gap: 20px;\n\n    .a{\n        text-decoration: none;\n    }\n  \n    .content1 {\n        .title {\n            background: linear-gradient(91deg, #207254 0%, #212c20 100%);\n            font-family: Montserrat;\n            font-size: 30px;\n            font-weight: 700;\n            line-height: 40px;\n        }\n    }\n\n    .content2 {\n        .title {\n            background: linear-gradient(91deg, #0de99e 0%, #596aff 100%);\n            font-family: Noto Sans SC;\n            font-size: 24px;\n            line-height: 34px;\n        }\n\n        .desc {\n            font-family: PingFang SC;\n            max-width: 210px;\n            margin-top: 4px;\n        }\n    }\n\n    .title,.desc{\n        margin: 0;\n    }\n\n    .content1,\n    .content2 {\n        .title {\n            background-clip: text;\n            -webkit-background-clip: text;\n            -webkit-text-fill-color: transparent;\n            font-weight: 700;\n        }\n    }\n\n    .desc {\n        max-width: 170px;\n        color: #484e58;\n        font-family: Noto Sans SC;\n        font-size: 16px;\n        font-weight: 500;\n        line-height: 28px;\n        /* 175% */\n    }\n\n    .joinDiv {\n        display: flex;\n        justify-content: space-around;\n\n        .p {\n            padding: 8px 20px;\n            font-size: 14px;\n            line-height: 20px;\n            font-weight: 500;\n            font-family: Noto Sans SC;\n        }\n\n        .img {\n            width: 80px;\n            display: block;\n            margin: 0 auto;\n            margin-bottom: 12px;\n        }\n\n        .join1 {\n            .p {\n                cursor: pointer;\n                width: 120px;\n                text-align: center;\n                white-space: nowrap;\n                border-radius: 24px;\n                background: linear-gradient(180deg,\n                        rgba(255, 255, 255, 0.12) 0%,\n                        rgba(0, 0, 0, 0.03) 100%),\n                    #4ba675;\n                color: white;\n            }\n        }\n\n        .join2 {\n            .img {\n                border-radius: 4px;\n                border: 2px solid #4a5974;\n            }\n\n            .p {\n                color: #484e58;\n                text-align: center;\n                letter-spacing: -0.044px;\n            }\n        }\n    }\n}\n\n";
  var styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.appendChild(document.createTextNode(cssContent));
  document.head.appendChild(styleElement);
  function Toast() {
    this.container = null;
    this.toast = null;
    this.closeButton = null;
  }
  Toast.prototype.init = function () {
    this.createContainer();
    this.createToast();
    this.createCloseButton();
    this.createContent();
    this.addEventListeners();
    if (cookie('hide_popup')) {
      this.hide();
    }
  };
  Toast.prototype.createContainer = function () {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  };
  Toast.prototype.createToast = function () {
    this.toast = document.createElement('div');
    this.toast.className = 'toast';
    this.container.appendChild(this.toast);
  };
  Toast.prototype.createCloseButton = function () {
    this.closeButton = document.createElement('img');
    this.closeButton.className = 'close';
    this.closeButton.src = 'https://ks-com-cn-staging.pek3b.qingstor.com/images/common/close.png';
    this.toast.appendChild(this.closeButton);
  };
  Toast.prototype.createContent = function () {
    this.content = document.createElement('div');
    this.content.innerHTML = "  <div class='content1'>\n    <p class='title'>Hello</p>\n    <p class='desc'>\u6B22\u8FCE\u52A0\u5165 KubeSphere\u6269\u5C55\u7EC4\u4EF6\u4EA4\u6D41\u7FA4!</p>\n  </div>\n  <div class='content2'>\n    <p class='title'>\u514D\u8D39\u9886\u53D6\u9AD8\u8FBE 5000 \u5C0F\u65F6\u8F7B\u91CF\u7EA7\u96C6\u7FA4\u8D44\u6E90</p>\n    <p class='desc'}>\u4E3A\u60A8\u7684\u5F00\u53D1\u4E4B\u65C5\u589E\u6DFB\u52A8\u529B\uFF01</p>\n  </div>\n  <div class='joinDiv'>\n    <div class='join1'>\n      <img src=\"\thttps://ks-com-cn-staging.pek3b.qingstor.com/images/common/slack.png\" class=\"img\"/>\n      <a\n        href=\"https://app.slack.com/client/TABN5CPK6/C05M708CBT9\"\n        target=\"_blank\"\n        class='a'\n      >\n        <p class='p'>\u52A0\u5165 Slack</p>\n      </a>\n    </div>\n\n    <div class='join2'>\n      <img src=\"https://ks-com-cn-staging.pek3b.qingstor.com/images/kse/kk.png\" class=\"img\"/>\n      <p class='p'>\u626B\u7801\u52A0\u5165\u5FAE\u4FE1\u7FA4</p>\n    </div>\n  </div>";
    this.content.className = 'contentWrapper';
    this.toast.appendChild(this.content);
  };
  Toast.prototype.addEventListeners = function () {
    var self = this;
    this.closeButton.addEventListener('click', function () {
      self.hide();
    });
  };
  Toast.prototype.show = function (message) {
    // need to change cookie
    this.container.style.display = 'block';
  };
  Toast.prototype.hide = function () {
    this.container.style.display = 'none';
    cookie('hide_popup', true, '/');
  };
  var toast = new Toast();
  Toast.show = function (message, options) {
    if (!cookie('hide_popup')) {
      toast.show(message, options);
    }
  };
  toast.init();
  window.Toast = Toast;

})();
