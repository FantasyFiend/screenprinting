(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by zwy on 2017/3/19.
 */

var Condition = React.createClass({
    displayName: "Condition",

    getInitialState: function () {
        return {
            allCondition: [],
            condition: null
        };
    },
    componentWillMount: function () {
        $.ajax({
            type: "get",
            url: "service/shop/queryAllCondition",
            data: { type: getQueryString("type") },
            success: function (msg) {
                this.setState({ allCondition: msg.list });
            }.bind(this)
        });
    },
    conditionClick: function (event) {
        var conditionName = $(event.target).attr("data-tag");
        alert(conditionName);
    },
    render: function () {
        var map = formatTags(this.state.allCondition);
        var conditionMap = arrayToMap(this.state.condition, name);
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
            var uls = [];
            if (con.children) {
                for (var j = 0; j < con.children.length; j++) {
                    var tag = con.children[j];
                    uls.push(React.createElement(
                        "li",
                        { onClick: this.conditionClick, "data-tag": tag.name },
                        React.createElement(
                            "p",
                            { "data-name": tag.name, "data-tag": tag.name },
                            tag.text
                        )
                    ));
                }
            }
            divs.push(React.createElement(
                "div",
                { className: "dropdown" },
                React.createElement(
                    "p",
                    { className: "dropdown-toggle", id: "dropdown_" + con.name, "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "true", "data-name": con.name },
                    con.text,
                    React.createElement("span", { "class": "caret" }),
                    React.createElement(
                        "ul",
                        { className: "dropdown-menu", "aria-labelledby": "dropdown_" + con.name },
                        uls
                    )
                )
            ));
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
        var commodityNumber = $(event.target).attr("data-commodity");
        alert(commodityNumber);
    },
    render: function () {
        var divs = [];
        for (var i = 0; i < this.state.list.length; i++) {
            var commodity = this.state.list[i];
            divs.push(React.createElement(
                "div",
                { className: "col-xs-6 col-sm-6 col-md-4 col-lg-4" },
                React.createElement(
                    "div",
                    { className: "thumbnail" },
                    React.createElement(
                        "a",
                        { href: "/commodity?commodityNumber=" + commodity.commodityNumber },
                        React.createElement("img", { src: commodity.imgPath, alt: commodity.name })
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
                                { className: "btn btn-default", role: "button", "data-commodity": commodity.commodityNumber, onClick: this.addToCart },
                                React.createElement("span", { className: "glyphicon glyphicon-plus-sign" }),
                                "\xA0",
                                React.createElement("span", { className: "glyphicon glyphicon-shopping-cart" })
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
            condition: null,
            list: []
        };
    },
    componentWillMount: function () {
        var condition = getQueryString("keywords");
        // this.setState({condition:condition});
        $.ajax({
            type: "get",
            url: "service/shop/queryCommodityByCondition",
            data: { condition: condition },
            success: function (data) {
                console.log(data);
                this.setState({ condition: condition, list: data.list });
            }.bind(this)
        });
    },
    render: function () {
        return React.createElement(
            "div",
            { className: "shop_main_container" },
            React.createElement(Condition, { condition: this.state.condition }),
            React.createElement(List, { list: this.state.list })
        );
    }
});
ReactDOM.render(React.createElement(Shop, null), document.getElementById("main_container"));

},{}]},{},[1]);
