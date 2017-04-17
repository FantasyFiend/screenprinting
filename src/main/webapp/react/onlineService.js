/**
 * Created by zwy on 2017/4/14.
 */
var OnlineService = React.createClass({
    getInitialState:function(){
        return {
            socketServer:_socketServer,
            contentArray:[],
            socket:null,
            user:null
        };
    },
    componentWillMount:function(){
        var websocket = new WebSocket(this.state.socketServer);
        websocket.onopen = function (event) {

        };
        websocket.onclose = function (event) {

        };
        websocket.onmessage = function (event) {

        };
        websocket.onerror = function (event) {
            alert(event.message);
        };
        this.setState({socket:websocket});
    },
    textSubmit:function(text){

    },
    render:function () {
        return <div className="online-service-div">
                    <ContentBoard content={this.state.contentArray}/>
                    <EditBoard textSubmit={this.textSubmit} socket={this.state.socket}/>
                </div>;
    }
});

var ContentBoard = React.createClass({
    getInitialState:function(){
        return {
            contentArray:props.content
        };
    },
    render:function(){
        var spans = [];
        var array = this.state.contentArray;
        for (var i = 0; i < array.length; i++) {
            var message = array[i];
            spans.push(<span><img src=""/></span>);
        }
    }
});

var EditBoard = React.createClass({
    getInitialState:function(){

    },
    sendMessage:function () {
        var text = $("#textarea").val();
        this.props.textSubmit(text);
    },
    render:function(){
        return <div><textarea id="textarea"></textarea><button onClick={this.sendMessage}>发送</button></div>;
    }
});
ReactDOM.render(<OnlineService />, document.getElementById("main_container"));