/**
 * Created by zwy on 2017/4/26.
 */
var onlineServiceAdmin = React.createClass({
    getInitialState:function(){
        return {
            customerList:[],
            socketServer:_socket,
            socket:null,
            user:null,
            contentArray:[]
        }
    },
    render:function () {
        var contentArray = [];
        return  <div className="online-service-admin-container">
                    <CustomerList customerList={this.state.customerList}/>
                    <MainBoard user={this.state.user} contentArray={contentArray}/>
                </div>
    }
});