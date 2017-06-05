/**
 * Created by zwy on 2017/4/14.
 */
var OnlineService = React.createClass({
    getInitialState:function(){
        return {
            socketServer:_socket,
            socket:null,
            user:null,
            contentArray:[]
        };
    },
    componentWillMount:function(){
        $.ajax({
            type:"get",
            url:"service/shop/checkLogin",
            success:function (data) {
                if (data.map.msg === "login"){
                    alert("登陆后即可使用在线客服功能！");
                    setCookie("swyFrom",window.location.href);
                    window.location.href = "login.html";
                }else if(data.map.msg === "success"){
                    var websocket = new WebSocket(this.state.socketServer);
                    websocket.onopen = function (event) {
                        var message = {from:data.map.user.email, fromNickname:data.map.user.nickname, to:"", message:"", successState:"", errorMessage:"", date:""};
                        if (websocket.readyState == websocket.OPEN) {
                            websocket.send(JSON.stringify(message));
                        }
                        this.setState({socket:websocket, user:data.map.user});
                    }.bind(this);
                    websocket.onclose = function (event) {

                    };
                    websocket.onmessage = function (event) {
                        var message = JSON.parse(event.data);
                        console.log(message);
                        var array = new Array();
                        for (var i = 0; i < this.state.contentArray.length; i++) {
                            array.push(this.state.contentArray[i]);
                        }
                        if (typeof (message[0]) === "object") {
                            for(var i = 0; i < message.length; i++) {
                                array.push(message[i]);
                            }
                        }else if (message.from){
                            array.push(message);
                        }
                        this.setState({contentArray:array});
                    }.bind(this);
                    websocket.onerror = function (event) {

                    };
                }
            }.bind(this)
        });
    },
    textSubmit:function(text){
        var from = this.state.user.email;
        var fromNickname = this.state.user.nickname;
        var to = "quhongyu@letspogo.com";
        var socket = this.state.socket;
        var message = {
            from:from,
            fromNickname:fromNickname,
            to:to,
            message:text
        };
        if (socket.readyState == socket.OPEN) {
            socket.send(JSON.stringify(message));
        } else {
            alert("尚未取得链接！");
        }
    },
    render:function () {
        return  <div className="online-service-div">
                    <ContentBoard content={this.state.contentArray} user={this.state.user}/>
                    <EditBoard textSubmit={this.textSubmit} socket={this.state.socket}/>
                </div>;
    }
});

var ContentBoard = React.createClass({
    getInitialState:function(){
        return {
            user:this.props.user,
            contentArray:this.props.content
        };
    },
    componentWillReceiveProps(props) {
        this.setState({user:props.user, contentArray: props.content});
    },
    componentDidUpdate(){
        document.getElementById('content-container').scrollTop = document.getElementById('content-container').scrollHeight;
    },
    render:function(){
        var divs = [];
        var array = this.state.contentArray;
        var user = this.state.user;
        for (var i = 0; i < array.length; i++) {
            var message = array[i];
            if (message.from == user.email) {
                divs.push(<div className="self"><img src="images/user_default.png"/><span className="content-dialog"><span className="left-arrow"></span><span className="time">{message.date}</span><span>{message.message}</span></span></div>);
            }else{
                divs.push(<div className="other"><img src="images/user_admin.jpg"/><span className="content-dialog"><span className="left-arrow"></span><span className="time">{message.date}</span><span>{message.message}</span></span></div>);
            }
        }
        return <div className="content-container" id="content-container">{divs}</div>;
    }
});

var EditBoard = React.createClass({
    sendMessage:function (event) {
        var text = $("#textarea").val();
        this.props.textSubmit(text);
        $("#textarea").val("");
    },
    handleKeyDown:function(event) {
        event.stopPropagation();
        if(event.keyCode == 13 && event.ctrlKey) {
            this.sendMessage();
        }
    },
    render:function(){
        return <div className="input-container"><textarea id="textarea" placeholder="Ctrl+Enter键发送，Enter键换行" onKeyDown={this.handleKeyDown}></textarea><button onClick={this.sendMessage} id="send">发送</button></div>;
    }
});

ReactDOM.render(<OnlineService />, document.getElementById("body"));