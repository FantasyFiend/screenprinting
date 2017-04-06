(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by zwy on 2017/4/6.
 */
var Cart = React.createClass({
    displayName: "Cart",

    getInitialState: function () {
        return {
            list: null
        };
    },
    componentWillMount: function () {
        $.ajax({
            type: "get",
            url: "service/shop/getCartList",
            success: function (data) {
                if (data.map.msg === "login") {
                    setCookie("swyFrom", window.location.href);
                    window.location.href = "login.html";
                } else if (data.map.msg === "success") {
                    _list = data.list;
                    this.setState({ list: data.list });
                }
            }.bind(this)
        });
    },
    toCommodityPage: function (event) {
        var commodityId = $(event.target).attr("data-commodityId");
        window.location.href = "commodity.html?id=" + commodityId;
    },
    amountChange: function (event) {
        var el = event.target;
        var newAmount = $(el).val();
        var commodityId = $(el).attr("data-commodityId");
        $.ajax({
            type: "post",
            url: "service/shop/changeCartAmount",
            data: { amount: newAmount, commodityId: commodityId },
            success: function (data) {
                if (data.map.msg === "login") {
                    setCookie("swyFrom", window.location.href);
                    window.location.href = "login.html";
                } else if (data.map.msg === "success") {
                    var newList = [];
                    _.map(this.state.list, function (cart, i) {
                        if (cart.commodityId == commodityId) {
                            cart.amount = newAmount;
                        }
                        newList.push(cart);
                    });
                    _list = newList;
                    this.setState({ list: newList });
                }
            }.bind(this)
        });
    },
    deleteCommodityInCart: function (event) {
        var el = event.target;
        var commodityId = $(el).attr("data-commodityId");
        $.ajax({
            type: "post",
            url: "service/shop/deleteCommodityInCart",
            data: { commodityId: commodityId },
            success: function (data) {
                if (data.map.msg === "login") {
                    setCookie("swyFrom", window.location.href);
                    window.location.href = "login.html";
                } else if (data.map.msg === "success") {
                    var newList = [];
                    _.map(this.state.list, function (cart, i) {
                        if (cart.commodityId != commodityId) {
                            newList.push(cart);
                        }
                    });
                    _list = newList;
                    this.setState({ list: newList });
                }
            }.bind(this)
        });
    },
    render: function () {
        if (this.state.list == null) {
            return React.createElement(
                "div",
                null,
                "\u8D2D\u7269\u8F66\u7A7A\u7A7A\u5982\u4E5F\uFF0C",
                React.createElement(
                    "a",
                    { href: "index.html" },
                    "\u5FEB\u53BB\u9009\u8D2D\u5427"
                )
            );
        }
        var table = [];
        table.push(React.createElement(
            "tr",
            { className: "table-title" },
            React.createElement(
                "td",
                { className: "table-title-info" },
                "\u5546\u54C1\u4FE1\u606F"
            ),
            React.createElement(
                "td",
                { className: "table-title-price" },
                "\u4EF7\u683C"
            ),
            React.createElement(
                "td",
                { className: "table-title-amount" },
                "\u6570\u91CF"
            ),
            React.createElement("td", { className: "table-title-operation" })
        ));
        _.map(this.state.list, function (cart, i) {
            table.push(React.createElement(
                "tr",
                null,
                React.createElement(
                    "td",
                    { className: "table-item-info", "data-commodityId": cart.commodityId, onClick: this.toCommodityPage },
                    React.createElement("img", { src: cart.imgPath, "data-commodityId": cart.commodityId }),
                    React.createElement(
                        "span",
                        { "data-commodityId": cart.commodityId },
                        cart.name
                    )
                ),
                React.createElement(
                    "td",
                    { className: "table-item-price" },
                    cart.price
                ),
                React.createElement(
                    "td",
                    { className: "table-item-amount" },
                    React.createElement("input", { type: "number", min: "1", step: "1", "data-commodityId": cart.commodityId, onChange: this.amountChange })
                ),
                React.createElement(
                    "td",
                    { className: "table-item-operation" },
                    React.createElement("span", { className: "glyphicon glyphicon-trash", "data-commodityId": cart.commodityId, onClick: this.deleteCommodityInCart })
                )
            ));
        }.bind(this));
        return React.createElement(
            "div",
            { className: "cart-div" },
            React.createElement(
                "table",
                { className: "cart-table" },
                table
            )
        );
    }
});
ReactDOM.render(React.createElement(Cart, null), document.getElementById("cart_container"));

},{}]},{},[1]);
