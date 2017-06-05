(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by zwy on 2017/6/2.
 */
var Comment = React.createClass({
    displayName: "Comment",

    getInitialState: function () {
        return {
            commentList: [],
            articleId: 0,
            user: null,
            cookieText: ""
        };
    },
    componentWillMount: function () {
        $.ajax({
            type: "get",
            url: "service/shop/checkLogin",
            success: function (data) {
                if (data.map.msg === "success") {
                    this.setState({ user: data.map.user });
                }
            }.bind(this)
        });
        var articleId = getQueryString("id");
        $.ajax({
            type: "GET",
            url: "service/shop/getCommentsByArticleId",
            data: { articleId: articleId },
            success: function (data) {
                this.setState({ commentList: data.list, articleId: articleId });
            }.bind(this)
        });
        var cookieText = getCookie("swyCommentContent");
        delCookie("swyCommentContent");
        this.setState({ cookieText: cookieText });
    },
    publish: function (event) {
        var text = $(event.target).parent().find("textarea").val();
        if (text.length > 2000) {
            alert("留言不能超过2000个字符。");
            return false;
        }
        if (this.state.user == null) {
            if (confirm("请先登录后再发表评论。")) {
                setCookie("swyFrom", window.location.href);
                setCookie("swyCommentContent", text);
                window.location.href = "login.html";
            }
            return false;
        }
        $.ajax({
            type: "POST",
            url: "service/shop/addMainComment",
            data: { articleId: this.state.articleId, content: text, nickname: this.state.user.nickname },
            success: function (data) {
                console.log(data);
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
                    { className: "floor-content-span" },
                    React.createElement(
                        "b",
                        null,
                        comment.floor,
                        "#"
                    ),
                    "\xA0\xA0",
                    React.createElement(
                        "b",
                        null,
                        comment.commentBy
                    ),
                    "\uFF1A",
                    comment.content
                ),
                React.createElement(
                    "span",
                    { className: "floor-time-span" },
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
                            { className: "floor-content-span" },
                            React.createElement(
                                "b",
                                null,
                                child.commentBy
                            ),
                            "\xA0\u56DE\u590D\xA0",
                            React.createElement(
                                "b",
                                null,
                                child.replyTo
                            ),
                            "\uFF1A",
                            child.content
                        ),
                        React.createElement(
                            "span",
                            { className: "floor-time-span" },
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
            ),
            React.createElement(
                "div",
                { className: "publish-section" },
                React.createElement(
                    "textarea",
                    { placeholder: "\u8BF7\u5148\u767B\u5F55\uFF0C\u518D\u53D1\u8868\u8BC4\u8BBA" },
                    this.state.cookieText
                ),
                React.createElement(
                    "button",
                    { onClick: this.publish },
                    "\u53D1\u8868"
                )
            )
        );
    }
});

ReactDOM.render(React.createElement(Comment, null), document.getElementById("comment_container"));

},{}]},{},[1]);
