(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by zwy on 2017/6/2.
 */
var Article = React.createClass({
    displayName: "Article",

    getInitialState: function () {
        return {
            article: null
        };
    },
    componentWillMount: function () {
        var id = getQueryString("id");
        $.ajax({
            type: "GET",
            url: "service/shop/getArticle",
            data: { id: id },
            success: function (data) {
                this.setState({ article: data.map.article });
            }.bind(this)
        });
    },
    render: function () {
        var article = this.state.article;
        if (article == null) {
            return React.createElement(
                "div",
                null,
                "\u65E0\u76F8\u5173\u6587\u7AE0\uFF01"
            );
        }
        return React.createElement(
            "div",
            { className: "container" },
            React.createElement(
                "div",
                { className: "article-title" },
                React.createElement(
                    "div",
                    { className: "article-name" },
                    article.name
                ),
                React.createElement(
                    "div",
                    { className: "article-info" },
                    React.createElement(
                        "span",
                        null,
                        article.author
                    ),
                    "|",
                    React.createElement(
                        "span",
                        null,
                        article.time
                    )
                )
            ),
            React.createElement("div", { className: "article-content", dangerouslySetInnerHTML: { __html: article.content } })
        );
    }
});
ReactDOM.render(React.createElement(Article, null), document.getElementById("article_container"));

},{}]},{},[1]);
