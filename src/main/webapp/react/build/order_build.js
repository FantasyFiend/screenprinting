(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by zwy on 2017/4/12.
 */
var Order = React.createClass({
    displayName: "Order",

    getInitialState: function () {
        return {
            type: "A",
            list: []
        };
    },
    componentWillMount: function () {
        $.ajax({
            type: "get",
            url: "service/shop/getOrderList",
            data: { type: "A" },
            success: function (data) {
                if (data.map.msg === "login") {
                    setCookie("swyFrom", window.location.href);
                    window.location.href = "login.html";
                } else if (data.map.msg === "success") {
                    this.setState({ list: data.list });
                }
            }.bind(this)
        });
    },
    switchType: function (event) {
        var type = $(event.target).attr("data-type");
        $.ajax({
            type: "get",
            url: "service/shop/getOrderList",
            data: { type: type },
            success: function (data) {
                if (data.map.msg === "login") {
                    setCookie("swyFrom", window.location.href);
                    window.location.href = "login.html";
                } else if (data.map.msg === "success") {
                    this.setState({ type: type, list: data.list });
                }
            }.bind(this)
        });
    },
    // handlePay: function () {
    //     var ua = navigator.userAgent.toLowerCase();
    //     var method = $("input[name='method_choice']:checked").val();
    //     var order = this.state.order;
    //     if (method == "alipay") {
    //         if (ua.match(/MicroMessenger/i) == "micromessenger") {
    //             alert("微信浏览器不支持支付宝支付，您可以选择微信支付，或者点击右上角\"在浏览器中打开\"在其他浏览器中使用支付宝!");
    //             return false;
    //         }
    //         window.location.href = "/letspogo/alipayapi.jsp?out_trade_no=" + order.orderNumber + "&subject=" + utf16to8(order.orderTitle) + "&total_fee=" + order.totalPrice;
    //     } else if (method == "wechatpay") {
    //         var data = {
    //             body: "Let's Pogo 商城-" + order.orderTitle,
    //             out_trade_no: order.orderNumber,
    //             total_fee: order.totalPrice * 100
    //         };
    //         window.location.href = "http://www.letspogo.com/letspogo/shop/weixinNATIVEPay?info=" + data.body + "|" + data.out_trade_no + "|" + data.total_fee;
    //     }
    // },
    toAlipay: function (event) {
        var id = $(event.target).attr("data-id");
        var list = this.state.list;
        for (var i = 0; i < list.length; i++) {
            var order = list[i];
            if (order.id == id) {
                var ua = navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    alert("微信浏览器不支持支付宝支付，您可以选择微信支付，或者点击右上角\"在浏览器中打开\"在其他浏览器中使用支付宝!");
                    return false;
                }
                window.location.href = "alipayapi.jsp?out_trade_no=" + order.orderNumber + "&subject=" + utf16to8(order.orderTitle) + "&total_fee=" + order.totalPrice;
            }
        }
    },
    toWxpay: function (event) {
        alert("微信支付尚未开通，请加微信号：siwangyin");
    },
    deleteOrder: function (event) {
        var id = $(event.target).attr("data-id");
        $.ajax({
            type: "get",
            url: "service/shop/deleteOrder",
            data: { id: id, type: this.state.type },
            success: function (data) {
                if (data.map.msg === "login") {
                    setCookie("swyFrom", window.location.href);
                    window.location.href = "login.html";
                } else if (data.map.msg === "success") {
                    this.setState({ list: data.list });
                }
            }.bind(this)
        });
    },
    render: function () {
        var list = this.state.list;
        var divs = [];
        for (var i = 0; i < list.length; i++) {
            var order = list[i];
            if (order.state == "P") {
                var span = React.createElement(
                    "span",
                    { className: "pay-order" },
                    React.createElement(
                        "p",
                        { onClick: this.toAlipay, "data-id": order.id },
                        "\u652F\u4ED8\u5B9D\u4ED8\u6B3E"
                    ),
                    React.createElement(
                        "p",
                        { onClick: this.toWxpay, "data-id": order.id },
                        "\u5FAE\u4FE1\u4ED8\u6B3E"
                    )
                );
            } else if (order.state == "C") {
                span = React.createElement(
                    "span",
                    { className: "complete-order" },
                    "\u5DF2\u5B8C\u6210"
                );
            }
            var itemList = JSON.parse(order.orderItem);
            var trs = [];
            console.log(itemList);
            for (var j = 0; j < itemList.length; j++) {
                var item = itemList[j];
                trs.push(React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "td",
                        null,
                        React.createElement("img", { src: item.imgPath }),
                        React.createElement(
                            "span",
                            null,
                            item.name
                        )
                    ),
                    React.createElement(
                        "td",
                        null,
                        item.price
                    ),
                    React.createElement(
                        "td",
                        null,
                        item.amount
                    ),
                    React.createElement(
                        "td",
                        null,
                        item.price * item.amount
                    )
                ));
            }
            divs.push(React.createElement(
                "div",
                { className: "order-div" },
                React.createElement(
                    "table",
                    { className: "order-item-table" },
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            "\u5546\u54C1"
                        ),
                        React.createElement(
                            "td",
                            null,
                            "\u5355\u4EF7"
                        ),
                        React.createElement(
                            "td",
                            null,
                            "\u6570\u91CF"
                        ),
                        React.createElement(
                            "td",
                            null,
                            "\u5C0F\u7ED3"
                        )
                    ),
                    trs
                ),
                React.createElement(
                    "table",
                    { className: "order-info-table" },
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            { className: "info-table-title" },
                            "\u8BA2\u5355\u7F16\u53F7\uFF1A"
                        ),
                        React.createElement(
                            "td",
                            null,
                            order.orderNumber
                        ),
                        React.createElement(
                            "td",
                            { className: "info-table-title" },
                            "\u4E0B\u5355\u65F6\u95F4\uFF1A"
                        ),
                        React.createElement(
                            "td",
                            null,
                            order.createTime
                        )
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            { className: "info-table-title" },
                            "\u8BA2\u5355\u540D\u79F0\uFF1A"
                        ),
                        React.createElement(
                            "td",
                            null,
                            order.orderTitle
                        ),
                        React.createElement(
                            "td",
                            { className: "info-table-title" },
                            "\u652F\u4ED8\u65F6\u95F4\uFF1A"
                        ),
                        React.createElement(
                            "td",
                            null,
                            order.payTime == null ? "" : order.payTime
                        )
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            { className: "info-table-title" },
                            "\u6536\u8D27\u5730\u5740\uFF1A"
                        ),
                        React.createElement(
                            "td",
                            null,
                            order.addressText
                        ),
                        React.createElement(
                            "td",
                            { className: "info-table-title" },
                            "\u8BA2\u5355\u91D1\u989D\uFF1A"
                        ),
                        React.createElement(
                            "td",
                            null,
                            order.totalPrice
                        )
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            { className: "info-table-title" },
                            "\u5907\u6CE8\u4FE1\u606F\uFF1A"
                        ),
                        React.createElement(
                            "td",
                            null,
                            order.remark
                        ),
                        React.createElement(
                            "td",
                            { className: "info-table-title" },
                            "\u8BA2\u5355\u72B6\u6001\uFF1A"
                        ),
                        React.createElement(
                            "td",
                            null,
                            span
                        )
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            { colSpan: 4, className: "delete-button", "data-id": order.id, onClick: this.deleteOrder },
                            React.createElement("span", { className: "glyphicon glyphicon-trash", "data-id": order.id })
                        )
                    )
                )
            ));
        }
        var aSpan;
        var pSpan;
        var cSpan;
        switch (this.state.type) {
            case "A":
                aSpan = React.createElement(
                    "span",
                    { onClick: this.switchType, "data-type": "A", className: "active" },
                    "\u5168\u90E8\u8BA2\u5355"
                );
                pSpan = React.createElement(
                    "span",
                    { onClick: this.switchType, "data-type": "P" },
                    "\u5F85\u652F\u4ED8\u8BA2\u5355"
                );
                cSpan = React.createElement(
                    "span",
                    { onClick: this.switchType, "data-type": "C" },
                    "\u5DF2\u5B8C\u6210\u8BA2\u5355"
                );
                break;
            case "P":
                aSpan = React.createElement(
                    "span",
                    { onClick: this.switchType, "data-type": "A" },
                    "\u5168\u90E8\u8BA2\u5355"
                );
                pSpan = React.createElement(
                    "span",
                    { onClick: this.switchType, "data-type": "P", className: "active" },
                    "\u5F85\u652F\u4ED8\u8BA2\u5355"
                );
                cSpan = React.createElement(
                    "span",
                    { onClick: this.switchType, "data-type": "C" },
                    "\u5DF2\u5B8C\u6210\u8BA2\u5355"
                );
                break;
            case "C":
                aSpan = React.createElement(
                    "span",
                    { onClick: this.switchType, "data-type": "A" },
                    "\u5168\u90E8\u8BA2\u5355"
                );
                pSpan = React.createElement(
                    "span",
                    { onClick: this.switchType, "data-type": "P" },
                    "\u5F85\u652F\u4ED8\u8BA2\u5355"
                );
                cSpan = React.createElement(
                    "span",
                    { onClick: this.switchType, "data-type": "C", className: "active" },
                    "\u5DF2\u5B8C\u6210\u8BA2\u5355"
                );
                break;
            default:
                aSpan = React.createElement(
                    "span",
                    { onClick: this.switchType, "data-type": "A", className: "active" },
                    "\u5168\u90E8\u8BA2\u5355"
                );
                pSpan = React.createElement(
                    "span",
                    { onClick: this.switchType, "data-type": "P" },
                    "\u5F85\u652F\u4ED8\u8BA2\u5355"
                );
                cSpan = React.createElement(
                    "span",
                    { onClick: this.switchType, "data-type": "C" },
                    "\u5DF2\u5B8C\u6210\u8BA2\u5355"
                );
                break;
        }
        return React.createElement(
            "div",
            { className: "container" },
            React.createElement(
                "div",
                { className: "switch-order-type" },
                aSpan,
                pSpan,
                cSpan
            ),
            React.createElement(
                "div",
                { className: "order-list-div" },
                divs
            )
        );
    }
});
ReactDOM.render(React.createElement(Order, null), document.getElementById("main_container"));

},{}]},{},[1]);
