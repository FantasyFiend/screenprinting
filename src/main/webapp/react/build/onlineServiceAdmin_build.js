(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by zwy on 2017/4/26.
 */
var OnlineServiceAdmin = React.createClass({
    displayName: "OnlineServiceAdmin",

    getInitialState: function () {
        return {
            customerList: this.props.customerList,
            activeCustomer: this.props.activeCustomer,
            socketServer: _socket,
            socket: null,
            user: this.props.user,
            contentArray: this.props.contentArray
        };
    },
    componentWillMount: function () {
        // $.ajax({
        //     type:"get",
        //     url:"service/shop/checkLoginAdmin",
        //     success:function (data) {
        //         if (data.map.msg === "login"){
        //             alert("登陆管理员账户后即可使用在线客服功能！");
        //             setCookie("swyFrom",window.location.href);
        //             window.location.href = "login.html";
        //         }else if(data.map.msg === "success"){
        //             var websocket = new WebSocket(this.state.socketServer);
        //             websocket.onopen = function (event) {
        //                 var message = {from:data.map.user.email, to:"", message:"", successState:"", errorMessage:"", date:""};
        //                 if (websocket.readyState == websocket.OPEN) {
        //                     websocket.send(JSON.stringify(message));
        //                 }
        //                 this.setState({socket:websocket, user:data.map.user});
        //             }.bind(this);
        //             websocket.onclose = function (event) {
        //
        //             };
        //             websocket.onmessage = function (event) {
        //                 var message = JSON.parse(event.data);
        //                 var array = new Array();
        //                 for (var i = 0; i < this.state.contentArray.length; i++) {
        //                     array.push(this.state.contentArray[i]);
        //                 }
        //                 if (typeof (message) == "object" && message.length > 0) {
        //                     for(var i = 0; i < message.length; i++) {
        //                         array.push(message[i]);
        //                     }
        //                 }else{
        //                     array.push(message);
        //                 }
        //                 this.setState({contentArray:array});
        //             }.bind(this);
        //             websocket.onerror = function (event) {
        //
        //             };
        //         }
        //     }.bind(this)
        // });
    },
    selectCustomer: function (newList, email) {
        this.setState({ customerList: newList, activeCustomer: email });
    },
    textSubmit: function (text) {
        var from = this.state.user.email;
        var to = this.state.activeCustomer;
        var socket = this.state.socket;
        var message = {
            from: from,
            to: to,
            message: text
        };
        if (socket.readyState == socket.OPEN) {
            socket.send(JSON.stringify(message));
        } else {
            alert("尚未取得链接！");
        }
    },
    render: function () {
        var customer = this.state.activeCustomer;
        if (customer == null) {
            customer = this.state.customerList[0].email;
        }
        var newArray = [];
        console.log(this.state.contentArray);
        for (var i = 0; i < this.state.contentArray.length; i++) {
            var content = this.state.contentArray[i];
            if (content.from === customer || content.to === customer) {
                newArray.push(content);
            }
        }
        return React.createElement(
            "div",
            { className: "online-service-admin-container" },
            React.createElement(CustomerList, { selectCustomer: this.selectCustomer, customerList: this.state.customerList, activeCustomer: customer }),
            React.createElement(MessageBoard, { contentArray: newArray, user: this.state.user, textSubmit: this.textSubmit })
        );
    }
});

var CustomerList = React.createClass({
    displayName: "CustomerList",

    getInitialState: function () {
        return {
            customerList: this.props.customerList,
            activeCustomer: this.props.activeCustomer
        };
    },
    componentWillMount: function () {
        var list = this.state.customerList;
        var email = this.state.activeCustomer;
        var newList = [];
        for (var i = 0; i < list.length; i++) {
            var customer = list[i];
            if (customer.email === email) {
                customer.messageCount = 0;
            }
            newList.push(customer);
        }
        this.setState({ customerList: newList });
    },
    selectCustomer: function (event) {
        var email = $(event.target).attr("data-email");
        if (!email) {
            email = $(event.target).parent().attr("data-email");
        }
        var list = this.state.customerList;
        var newList = [];
        for (var i = 0; i < list.length; i++) {
            var customer = list[i];
            if (customer.email === email) {
                customer.messageCount = 0;
            }
            newList.push(customer);
        }
        this.props.selectCustomer(newList, email);
    },
    componentWillReceiveProps(props) {
        this.setState({ customerList: props.customerList, activeCustomer: props.activeCustomer });
    },
    render: function () {
        var divs = [];
        for (var i = 0; i < this.state.customerList.length; i++) {
            var customer = this.state.customerList[i];
            if (customer.email === this.state.activeCustomer) {
                divs.push(React.createElement(
                    "div",
                    { className: "customer-container active", "data-email": customer.email, onClick: this.selectCustomer },
                    React.createElement(
                        "span",
                        { className: "nickname" },
                        customer.nickname
                    )
                ));
            } else {
                var count = customer.messageCount == 0 ? "" : React.createElement(
                    "span",
                    { className: "badge" },
                    customer.messageCount
                );
                divs.push(React.createElement(
                    "div",
                    { className: "customer-container", "data-email": customer.email, onClick: this.selectCustomer },
                    React.createElement(
                        "span",
                        { className: "nickname" },
                        customer.nickname
                    ),
                    count
                ));
            }
        }
        return React.createElement(
            "div",
            { className: "customer-list-container" },
            divs
        );
    }
});

var MessageBoard = React.createClass({
    displayName: "MessageBoard",

    getInitialState: function () {
        return {
            user: this.props.user,
            contentArray: this.props.contentArray
        };
    },
    componentWillReceiveProps(props) {
        this.setState({ user: props.user, contentArray: props.contentArray });
    },
    textSubmit: function (text) {
        this.props.textSubmit(text);
    },
    render: function () {
        return React.createElement(
            "div",
            { className: "online-service-div" },
            React.createElement(ContentBoard, { content: this.state.contentArray, user: this.state.user }),
            React.createElement(EditBoard, { textSubmit: this.textSubmit })
        );
    }
});
var ContentBoard = React.createClass({
    displayName: "ContentBoard",

    getInitialState: function () {
        return {
            user: this.props.user,
            contentArray: this.props.content
        };
    },
    componentWillReceiveProps(props) {
        this.setState({ user: props.user, contentArray: props.content });
    },
    render: function () {
        var divs = [];
        var array = this.state.contentArray;
        var user = this.state.user;
        for (var i = 0; i < array.length; i++) {
            var message = array[i];
            if (message.from == user.email) {
                divs.push(React.createElement(
                    "div",
                    { className: "self" },
                    React.createElement("img", { src: user.headImgPath }),
                    React.createElement(
                        "span",
                        { className: "content-dialog" },
                        React.createElement("span", { className: "left-arrow" }),
                        React.createElement(
                            "span",
                            { className: "time" },
                            message.date
                        ),
                        React.createElement(
                            "span",
                            null,
                            message.message
                        )
                    )
                ));
            } else {
                divs.push(React.createElement(
                    "div",
                    { className: "other" },
                    React.createElement("img", { src: "images/user_default.png" }),
                    React.createElement(
                        "span",
                        { className: "content-dialog" },
                        React.createElement("span", { className: "left-arrow" }),
                        React.createElement(
                            "span",
                            { className: "time" },
                            message.date
                        ),
                        React.createElement(
                            "span",
                            null,
                            message.message
                        )
                    )
                ));
            }
        }
        return React.createElement(
            "div",
            { className: "content-container" },
            divs
        );
    }
});

var EditBoard = React.createClass({
    displayName: "EditBoard",

    sendMessage: function (event) {
        var text = $("#textarea").val();
        this.props.textSubmit(text);
        $("#textarea").val("");
    },
    handleKeyDown: function (event) {
        event.stopPropagation();
        if (event.keyCode == 13 && event.ctrlKey) {
            this.sendMessage();
        }
    },
    render: function () {
        return React.createElement(
            "div",
            { className: "input-container" },
            React.createElement("textarea", { id: "textarea", placeholder: "Ctrl+Enter\u952E\u53D1\u9001\uFF0CEnter\u952E\u6362\u884C", onKeyDown: this.handleKeyDown }),
            React.createElement(
                "button",
                { onClick: this.sendMessage, id: "send" },
                "\u53D1\u9001"
            )
        );
    }
});
var _list = [{
    email: "522381611@qq.com",
    nickname: "Z_Fiend1",
    headImgPath: "images/user_default.png",
    messageCount: 1
}, {
    email: "522381612@qq.com",
    nickname: "Z_Fiend2",
    headImgPath: "images/user_default.png",
    messageCount: 0
}, {
    email: "522381613@qq.com",
    nickname: "Z_Fiend",
    headImgPath: "images/user_default.png",
    messageCount: 2
}];
var _activeCustomer = "522381612@qq.com";
var _user = {
    email: "quhongyu@letspogo.com",
    nickname: "Z_Fiend",
    headImgPath: "images/user_admin.jpg"
};
var _content = [{ from: "522381613@qq.com", to: "quhongyu@letspogo.com", message: "text1", successState: "success", errorMessage: "", date: "2017-04-24 11:18:32" }, { from: "quhongyu@letspogo.com", to: "522381613@qq.com", message: "text2", successState: "success", errorMessage: "", date: "2017-04-24 11:18:32" }, { from: "522381613@qq.com", to: "quhongyu@letspogo.com", message: "text3", successState: "success", errorMessage: "", date: "2017-04-24 11:18:32" }, { from: "522381613@qq.com", to: "quhongyu@letspogo.com", message: "text4", successState: "success", errorMessage: "", date: "2017-04-24 11:18:32" }, { from: "522381613@qq.com", to: "quhongyu@letspogo.com", message: "text5", successState: "success", errorMessage: "", date: "2017-04-24 11:18:32" }, { from: "quhongyu@letspogo.com", to: "522381613@qq.com", message: "text6", successState: "success", errorMessage: "", date: "2017-04-24 11:18:32" }, { from: "522381613@qq.com", to: "quhongyu@letspogo.com", message: "text7", successState: "success", errorMessage: "", date: "2017-04-24 11:18:32" }];
ReactDOM.render(React.createElement(OnlineServiceAdmin, { contentArray: _content, user: _user, activeCustomer: _activeCustomer, customerList: _list }), document.getElementById("body"));

},{}]},{},[1]);
