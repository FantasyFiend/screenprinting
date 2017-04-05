(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by zwy on 2017/4/5.
 */
var Commodity = React.createClass({
    displayName: "Commodity",

    getInitialState: function () {
        return {
            commodity: null,
            imgIndex: 0
        };
    },
    componentWillMount: function () {
        var id = getQueryString("id");
        $.ajax({
            type: "get",
            url: "service/shop/getCommodityById",
            data: { id, id },
            success: function (data) {
                if (data.map.commodity != null) {
                    this.setState({ commodity: data.map.commodity });
                }
            }.bind(this)
        });
    },
    changeImgIndex: function (event) {
        var index = parseInt($(event.target).attr("data-index"));
        this.setState({ imgIndex: index });
    },
    addToCart: function (event) {
        var commodityId = $(event.target).attr("data-id");
        $.ajax({
            type: "post",
            url: "service/shop/addToCart",
            data: { commodity: commodityId, amount: $("#amount").val() },
            success: function (data) {
                if (data.map.msg === "success") {
                    $("#cartBadge").text(data.map.count);
                } else if (data.map.msg === "login") {
                    setCookie("swyFrom", window.location.href);
                    window.location.href = "login.html";
                }
            }
        });
    },
    render: function () {
        if (this.state.commodity == null) {
            return React.createElement(
                "div",
                { className: "no-commodity" },
                "\u672A\u67E5\u5230\u6B64\u5546\u54C1!"
            );
        }
        var commodity = this.state.commodity;
        var imgPathArray = commodity.imgPath.split("|");
        console.log(imgPathArray);
        var index = this.state.imgIndex;
        var imgs = [];
        for (var i = 0; i < imgPathArray.length; i++) {
            imgs.push(React.createElement("img", { className: i === this.state.imgIndex ? "active" : "opacity", src: imgPathArray[i], "data-index": i, onClick: this.changeImgIndex }));
        }
        return React.createElement(
            "div",
            { className: "commodity_container" },
            React.createElement(
                "div",
                { className: "info-container" },
                React.createElement(
                    "div",
                    { className: "col-sm-12 col-md-6 info-img-container" },
                    React.createElement(
                        "div",
                        { className: "main-img" },
                        React.createElement("img", { src: imgPathArray[index] })
                    ),
                    React.createElement(
                        "div",
                        { className: "little-img" },
                        imgs
                    )
                ),
                React.createElement(
                    "div",
                    { className: "col-sm-12 col-md-6 info-text-container" },
                    React.createElement(
                        "div",
                        { className: "info-title" },
                        commodity.name
                    ),
                    React.createElement(
                        "div",
                        { className: "info-description" },
                        commodity.description
                    ),
                    React.createElement(
                        "div",
                        { className: "info-price" },
                        "\u4EF7\u683C\uFF1A",
                        React.createElement(
                            "span",
                            { className: "price-number" },
                            commodity.price
                        ),
                        "\u5143"
                    ),
                    React.createElement(
                        "div",
                        { className: "info-amount" },
                        "\u6570\u91CF\uFF1A",
                        React.createElement("input", { type: "number", min: "1", step: "1", id: "amount" })
                    ),
                    React.createElement(
                        "div",
                        { className: "info-button-group" },
                        React.createElement(
                            "span",
                            { className: "add-to-cart", onClick: this.addToCart, "data-id": commodity.id },
                            "\u52A0\u5165\u8D2D\u7269\u8F66"
                        )
                    )
                )
            ),
            React.createElement("div", { className: "detail-container", dangerouslySetInnerHTML: { __html: commodity.detailHtml } })
        );
    }
});
ReactDOM.render(React.createElement(Commodity, null), document.getElementById("main_container"));

},{}]},{},[1]);
