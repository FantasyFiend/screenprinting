(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by zwy on 2017/6/5.
 */
var Series = React.createClass({
    displayName: "Series",

    getInitialState: function () {
        return {
            series: null,
            list: []
        };
    },
    componentWillMount: function () {
        var seriesId = getQueryString("id");
        $.ajax({
            type: "GET",
            url: "service/shop/getSeries",
            data: { seriesId: seriesId },
            success: function (data) {
                this.setState({ list: data.list, series: data.map.series });
            }.bind(this)
        });
    },
    render: function () {
        if (this.state.series == null) {
            return React.createElement(
                "div",
                null,
                "\u65E0\u6B64\u7CFB\u5217!"
            );
        }
        var as = [];
        for (var i = 0; i < this.state.list.length; i++) {
            var article = this.state.list[i];
            as.push(React.createElement(
                "a",
                { href: "blog.html?id=" + article.id, className: "list-group-item" },
                article.name
            ));
        }
        return React.createElement(
            "div",
            { className: "series-container" },
            React.createElement(
                "div",
                { className: "series-title" },
                React.createElement(
                    "div",
                    { className: "series-name" },
                    React.createElement(
                        "b",
                        null,
                        this.state.series.name
                    )
                ),
                React.createElement(
                    "div",
                    { className: "series-description" },
                    this.state.series.description
                )
            ),
            React.createElement(
                "div",
                { className: "list-group" },
                as
            )
        );
    }
});

ReactDOM.render(React.createElement(Series, null), document.getElementById("series_container"));

},{}]},{},[1]);
