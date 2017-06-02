(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by zwy on 2017/6/2.
 */
var Comment = React.createClass({
    displayName: "Comment",

    getInitialState: function () {
        return {
            commentList: []
        };
    },
    componentWillMount: function () {
        var articleId = getQueryString("id");
        $.ajax({
            type: "GET",
            url: "service/shop/getCommentsByArticleId",
            data: { articleId: articleId },
            success: function (data) {
                console.log(data.list);
                this.setState({ commentList: data.list });
            }.bind(this)
        });
    },
    render: function () {
        var divs = [];
        var commentList = this.state.commentList;
        for (var i = 0; i < commentList.length; i++) {
            var comment = commentList[i];
            var commentsDiv = [];
            commentsDiv.push(React.createElement(
                "div",
                { className: "comment-main-floor" },
                React.createElement(
                    "span",
                    null,
                    comment.commentBy,
                    ":",
                    comment.content
                ),
                React.createElement(
                    "span",
                    null,
                    comment.time
                )
            ));
            if (comment.children != null) {
                for (var j = 0; j < comment.children.length; j++) {
                    var child = comment.children[j];
                    commentsDiv.push(React.createElement(
                        "div",
                        { className: "comment-sub-floor" },
                        React.createElement(
                            "span",
                            null,
                            child.commentBy,
                            "\xA0\u56DE\u590D\xA0",
                            child.replyTo,
                            ":",
                            child.content
                        ),
                        React.createElement(
                            "span",
                            null,
                            child.time
                        )
                    ));
                }
            }
            divs.push(React.createElement(
                "div",
                { className: "comment-floor" },
                commentsDiv
            ));
        }
        return React.createElement(
            "div",
            { className: "container comments-total-container" },
            React.createElement(
                "div",
                { className: "comments-total-container-title" },
                "\u8BC4\u8BBA"
            ),
            React.createElement(
                "div",
                { className: "comments-section" },
                divs
            )
        );
    }
});

ReactDOM.render(React.createElement(Comment, null), document.getElementById("comment_container"));

},{}]},{},[1]);
