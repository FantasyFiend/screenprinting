(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by zwy on 2017/6/19.
 */
var Nav = React.createClass({
    displayName: "Nav",

    getInitialState: function () {
        return {
            pageName: _pageName,
            list: [],
            blogList: []
        };
    },
    componentWillMount: function () {
        $.ajax({
            type: "get",
            url: "service/shop/getSessionUserAndNavType",
            success: function (data) {
                this.setState({ list: data.list, blogList: data.map.blogList });
            }.bind(this)
        });
    },
    componentDidMount: function () {
        var array = $(".nav-item");
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if ($(item).attr("data-name") === this.state.pageName) {
                $(item).addClass("active");
            } else {
                $(item).removeClass("active");
            }
        }
    },
    render: function () {
        var lis = [];
        var blogLis = [];
        for (var i = 0; i < this.state.list.length; i++) {
            var type = this.state.list[i];
            if (type.parentId === 0) {
                lis.push(React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "a",
                        { href: type.href, className: "dropdown-header" },
                        type.text
                    )
                ));
                for (var j = 0; j < this.state.list.length; j++) {
                    var child = this.state.list[j];
                    if (child.parentId === type.id) {
                        lis.push(React.createElement(
                            "li",
                            null,
                            React.createElement(
                                "a",
                                { href: child.href },
                                child.text
                            )
                        ));
                    }
                }
                lis.push(React.createElement("li", { className: "divider" }));
            }
        }
        for (var i = 0; i < this.state.blogList.length; i++) {
            var type = this.state.blogList[i];
            if (type.parentId === 0) {
                blogLis.push(React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "a",
                        { href: type.href, className: "dropdown-header" },
                        type.text
                    )
                ));
                for (var j = 0; j < this.state.blogList.length; j++) {
                    var child = this.state.blogList[j];
                    if (child.parentId === type.id) {
                        blogLis.push(React.createElement(
                            "li",
                            null,
                            React.createElement(
                                "a",
                                { href: child.href },
                                child.text
                            )
                        ));
                    }
                }
                blogLis.push(React.createElement("li", { className: "divider" }));
            }
        }
        lis.pop();
        blogLis.pop();
        return React.createElement(
            "nav",
            { className: "index-nav" },
            React.createElement(
                "span",
                { "data-name": "index", className: "nav-item" },
                React.createElement(
                    "a",
                    { href: "index.html" },
                    React.createElement("span", { className: "icon-blacklightlogo" })
                )
            ),
            React.createElement(
                "span",
                { "data-name": "print", className: "nav-item" },
                React.createElement(
                    "a",
                    { href: "print.html" },
                    React.createElement("span", { className: "icon-hei" }),
                    React.createElement("span", { className: "icon-gaung" }),
                    React.createElement("span", { className: "icon-yin" }),
                    React.createElement("span", { className: "icon-zao" })
                )
            ),
            React.createElement(
                "span",
                { "data-name": "shop", className: "nav-item" },
                React.createElement("span", { className: "icon-hei" }),
                React.createElement("span", { className: "icon-gaung" }),
                React.createElement("span", { className: "icon-shang" }),
                React.createElement("span", { className: "icon-dian" }),
                React.createElement(
                    "ul",
                    null,
                    lis
                )
            ),
            React.createElement(
                "span",
                { "data-name": "blog", className: "nav-item" },
                React.createElement("span", { className: "icon-hei" }),
                React.createElement("span", { className: "icon-gaung" }),
                React.createElement("span", { className: "icon-tu" }),
                React.createElement("span", { className: "icon-shu" }),
                React.createElement("span", { className: "icon-guan" }),
                React.createElement(
                    "ul",
                    null,
                    blogLis
                )
            ),
            React.createElement(
                "span",
                { "data-name": "contact", className: "nav-item" },
                React.createElement(
                    "a",
                    { href: "contact.html" },
                    React.createElement("span", { className: "icon-lian" }),
                    React.createElement("span", { className: "icon-xi" }),
                    React.createElement("span", { className: "icon-wo" }),
                    React.createElement("span", { className: "icon-men" })
                )
            )
        );
    }
});
ReactDOM.render(React.createElement(Nav, null), document.getElementById("nav_container"));

},{}]},{},[1]);
