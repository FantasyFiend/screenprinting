(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by zwy on 2017/3/19.
 */

var Condition = React.createClass({
    displayName: "Condition",

    getInitialState: function () {
        return {
            allCondition: [],
            condition: this.props.condition
        };
    },
    componentWillMount: function () {
        $.ajax({
            type: "get",
            url: "service/shop/queryAllCondition",
            data: { type: getQueryString("type") },
            success: function (data) {
                this.setState({ allCondition: data.list });
            }.bind(this)
        });
    },
    componentWillReceiveProps: function (props) {
        this.setState({ condition: props.condition });
    },
    conditionClick: function (event) {
        var name = $(event.target).attr("data-tag");
        var condition = this.state.condition;
        if (_.indexOf(condition, name) > -1) {
            var newCondition = _.without(condition, name);
        } else {
            newCondition = new Array();
            newCondition.push(name);
            newCondition = newCondition.concat(condition);
        }
        this.props.conditionChange(newCondition);
    },
    changeFoldState: function (event) {
        var tagId = $(event.target).attr("data-tag");
        var condition = this.state.allCondition;
        for (var i = 0; i < condition.length; i++) {
            var con = condition[i];
            if (con.id == tagId) {
                con["unfolded"] = !con["unfolded"];
            }
        }
        this.setState({ allCondition: condition });
    },
    render: function () {
        var map = formatTags(this.state.allCondition);
        var conditionMap = new Object();
        for (var i = 0; i < this.state.condition.length; i++) {
            var con = this.state.condition[i];
            conditionMap[con] = con;
        }
        for (var i in map) {
            var con = map[i];
            if (con.children) {
                for (var j = 0; j < con.children.length; j++) {
                    var tag = con.children[j];
                    if (conditionMap[tag.name] != null) {
                        tag.active = true;
                    } else {
                        tag.active = false;
                    }
                }
            }
        }
        var divs = [];
        for (var i in map) {
            var con = map[i];
            var spans = [];
            if (con.children) {
                spans.push(React.createElement(
                    "span",
                    { className: "condition-title", "data-tag": con.id, onClick: this.changeFoldState },
                    con.text,
                    React.createElement(
                        "p",
                        { "data-tag": con.id },
                        React.createElement("span", { className: con["unfolded"] ? "glyphicon glyphicon-minus" : "glyphicon glyphicon-plus", "data-tag": con.id })
                    )
                ));
                for (var j = 0; j < con.children.length; j++) {
                    var tag = con.children[j];
                    spans.push(React.createElement(
                        "span",
                        { onClick: this.conditionClick, "data-tag": tag.name, className: tag.active ? "condition-item active" : "condition-item" },
                        React.createElement(
                            "p",
                            { "data-tag": tag.name },
                            tag.text
                        )
                    ));
                }
                var divStyle;
                var height = 35;
                if (con["unfolded"]) {
                    height += con.children.length * 40;
                }
                divStyle = {
                    height: height + "px"
                };
                divs.push(React.createElement(
                    "div",
                    { style: divStyle, className: con["unfolded"] ? "condition-group unfolded" : "condition-group" },
                    spans
                ));
            }
        }
        return React.createElement(
            "div",
            { className: "col-xs-12 col-sm-4 col-md-3 col-lg-2 condition-div" },
            divs
        );
    }
});

var List = React.createClass({
    displayName: "List",

    getInitialState: function () {
        return {
            list: this.props.list
        };
    },
    addToCart: function (event) {
        var id = $(event.target).attr("data-commodity");
        $.ajax({
            type: "post",
            url: "service/shop/addToCart",
            data: { commodityId: id, amount: 1 },
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
    componentWillReceiveProps: function (props) {
        this.setState({ list: props.list });
    },
    render: function () {
        var divs = [];
        for (var i = 0; i < this.state.list.length; i++) {
            var commodity = this.state.list[i];
            var imgPath = commodity.imgPath.split("|")[0];
            divs.push(React.createElement(
                "div",
                { className: "col-xs-6 col-sm-6 col-md-4 col-lg-4" },
                React.createElement(
                    "div",
                    { className: "thumbnail" },
                    React.createElement(
                        "a",
                        { href: "/commodity.html?id=" + commodity.id },
                        React.createElement("img", { src: imgPath, alt: commodity.name })
                    ),
                    React.createElement(
                        "div",
                        { className: "caption" },
                        React.createElement(
                            "h6",
                            null,
                            commodity.name
                        ),
                        React.createElement(
                            "p",
                            null,
                            "￥" + commodity.price
                        ),
                        React.createElement(
                            "p",
                            null,
                            React.createElement(
                                "span",
                                { className: "btn btn-default", role: "button", "data-commodity": commodity.id, onClick: this.addToCart },
                                React.createElement("span", { className: "glyphicon glyphicon-plus-sign", "data-commodity": commodity.id }),
                                "\xA0",
                                React.createElement("span", { className: "glyphicon glyphicon-shopping-cart", "data-commodity": commodity.id })
                            )
                        )
                    )
                )
            ));
        }
        return React.createElement(
            "div",
            { className: "col-xs-12 col-sm-8 col-md-9 col-lg-10" },
            divs
        );
    }
});

var Shop = React.createClass({
    displayName: "Shop",

    getInitialState: function () {
        return {
            condition: [],
            list: []
        };
    },
    componentWillMount: function () {
        var condition = getQueryString("keywords");
        var array = condition.split("-");
        $.ajax({
            type: "post",
            url: "service/shop/queryCommodityByCondition",
            data: { condition: condition },
            success: function (data) {
                this.setState({ condition: array, list: data.list });
            }.bind(this)
        });
    },
    handleConditionChange: function (newCondition) {
        if (window.history.replaceState) {
            var href = window.location.href;
            var newHref = href.substring(0, href.indexOf("keywords="));
            newHref = newHref + "keywords=" + newCondition.join("-");
            window.history.replaceState(null, "", newHref);
        }
        $.ajax({
            type: "post",
            url: "service/shop/queryCommodityByCondition",
            data: { condition: newCondition.join("-") },
            success: function (data) {
                this.setState({ condition: newCondition, list: data.list });
            }.bind(this)
        });
    },
    render: function () {
        return React.createElement(
            "div",
            { className: "shop_main_container" },
            React.createElement(Condition, { condition: this.state.condition, conditionChange: this.handleConditionChange }),
            React.createElement(List, { list: this.state.list })
        );
    }
});
ReactDOM.render(React.createElement(Shop, null), document.getElementById("main_container"));

},{}]},{},[1]);
