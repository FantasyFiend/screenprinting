/**
 * Created by zwy on 2017/4/12.
 */
var Order = React.createClass({
    getInitialState:function(){
        return {
            type:"A",
            list:[]
        };
    },
    componentWillMount:function(){
        $.ajax({
            type:"get",
            url:"service/shop/getOrderList",
            data:{type:"A"},
            success:function(data){
                if (data.map.msg === "login"){
                    setCookie("swyFrom",window.location.href);
                    window.location.href = "login.html";
                }else if (data.map.msg === "success"){
                    this.setState({list:data.list})
                }
            }.bind(this)
        })
    },
    switchType:function(event){
        var type = $(event.target).attr("data-type");
        $.ajax({
            type:"get",
            url:"service/shop/getOrderList",
            data:{type:type},
            success:function(data){
                if (data.map.msg === "login"){
                    setCookie("swyFrom",window.location.href);
                    window.location.href = "login.html";
                }else if (data.map.msg === "success"){
                    this.setState({type:type, list:data.list});
                }
            }.bind(this)
        })
    },
    // handlePay: function () {
    //     var ua = navigator.userAgent.toLowerCase();
    //     var method = $("input[name='method_choice']:checked").val();
    //     var order = this.state.order;
    //     if (method == "alipay") {
    //         if (ua.match(/MicroMessenger/i) == "micromessenger") {
    //             alert("微信浏览器不支持支付宝支付，您可以选择微信支付，或者点击右上角\"在浏览器中打开\"在其他浏览器中使用支付宝!");
    //             return false;
    //         }
    //         window.location.href = "/letspogo/alipayapi.jsp?out_trade_no=" + order.orderNumber + "&subject=" + utf16to8(order.orderTitle) + "&total_fee=" + order.totalPrice;
    //     } else if (method == "wechatpay") {
    //         var data = {
    //             body: "Let's Pogo 商城-" + order.orderTitle,
    //             out_trade_no: order.orderNumber,
    //             total_fee: order.totalPrice * 100
    //         };
    //         window.location.href = "http://www.letspogo.com/letspogo/shop/weixinNATIVEPay?info=" + data.body + "|" + data.out_trade_no + "|" + data.total_fee;
    //     }
    // },
    toAlipay:function(event){
        var id = $(event.target).attr("data-id");
        var list = this.state.list;
        for (var i = 0; i < list.length; i++) {
            var order = list[i];
            if (order.id == id) {
                var ua = navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    alert("微信浏览器不支持支付宝支付，您可以选择微信支付，或者点击右上角\"在浏览器中打开\"在其他浏览器中使用支付宝!");
                    return false;
                }
                window.location.href = "alipayapi.jsp?out_trade_no=" + order.orderNumber + "&subject=" + utf16to8(order.orderTitle) + "&total_fee=" + order.totalPrice;
            }
        }
    },
    toWxpay:function(event){
        alert("微信支付尚未开通，请加微信号：siwangyin");
    },
    deleteOrder:function(event){
        var id = $(event.target).attr("data-id");
        $.ajax({
            type:"get",
            url:"service/shop/deleteOrder",
            data:{id:id, type:this.state.type},
            success:function(data){
                if (data.map.msg === "login"){
                    setCookie("swyFrom",window.location.href);
                    window.location.href = "login.html";
                }else if (data.map.msg === "success"){
                    this.setState({list:data.list});
                }
            }.bind(this)
        })
    },
    render:function(){
        var list = this.state.list;
        var divs = [];
        for (var i = 0; i < list.length; i++) {
            var order = list[i];
            if(order.state == "P") {
                var span = <span className="pay-order"><p onClick={this.toAlipay} data-id={order.id}>支付宝付款</p><p onClick={this.toWxpay} data-id={order.id}>微信付款</p></span>;
            }else if (order.state == "C"){
                span = <span className="complete-order">已完成</span>;
            }
            var itemList = JSON.parse(order.orderItem);
            var trs = [];
            console.log(itemList);
            for (var j = 0; j < itemList.length; j++) {
                var item = itemList[j];
                trs.push(<tr><td><img src={item.imgPath}/><span>{item.name}</span></td><td>{item.price}</td><td>{item.amount}</td><td>{item.price * item.amount}</td></tr>);
            }
            divs.push(  <div className="order-div">
                            <table className="order-item-table">
                                <tr><td>商品</td><td>单价</td><td>数量</td><td>小结</td></tr>
                                {trs}
                            </table>
                            <table className="order-info-table">
                                <tr><td className="info-table-title">订单编号：</td><td>{order.orderNumber}</td><td className="info-table-title">下单时间：</td><td>{order.createTime}</td></tr>
                                <tr><td className="info-table-title">订单名称：</td><td>{order.orderTitle}</td><td className="info-table-title">支付时间：</td><td>{order.payTime == null ? "" : order.payTime}</td></tr>
                                <tr><td className="info-table-title">收货地址：</td><td>{order.addressText}</td><td className="info-table-title">订单金额：</td><td>{order.totalPrice}</td></tr>
                                <tr><td className="info-table-title">备注信息：</td><td>{order.remark}</td><td className="info-table-title">订单状态：</td><td>{span}</td></tr>
                                <tr><td colSpan={4} className="delete-button" data-id={order.id} onClick={this.deleteOrder}><span className="glyphicon glyphicon-trash" data-id={order.id}></span></td></tr>
                            </table>
                        </div>);
        }
        var aSpan;
        var pSpan;
        var cSpan;
        switch (this.state.type) {
            case "A":
                aSpan = <span onClick={this.switchType} data-type={"A"} className="active">全部订单</span>;
                pSpan = <span onClick={this.switchType} data-type={"P"}>待支付订单</span>;
                cSpan = <span onClick={this.switchType} data-type={"C"}>已完成订单</span>;
                break;
            case "P":
                aSpan = <span onClick={this.switchType} data-type={"A"}>全部订单</span>;
                pSpan = <span onClick={this.switchType} data-type={"P"} className="active">待支付订单</span>;
                cSpan = <span onClick={this.switchType} data-type={"C"}>已完成订单</span>;
                break;
            case "C":
                aSpan = <span onClick={this.switchType} data-type={"A"}>全部订单</span>;
                pSpan = <span onClick={this.switchType} data-type={"P"}>待支付订单</span>;
                cSpan = <span onClick={this.switchType} data-type={"C"} className="active">已完成订单</span>;
                break;
            default:
                aSpan = <span onClick={this.switchType} data-type={"A"} className="active">全部订单</span>;
                pSpan = <span onClick={this.switchType} data-type={"P"}>待支付订单</span>;
                cSpan = <span onClick={this.switchType} data-type={"C"}>已完成订单</span>;
                break;
        }
        return <div className="container">
                    <div className="switch-order-type">{aSpan}{pSpan}{cSpan}</div>
                    <div className="order-list-div">{divs}</div>
                </div>;
    }
});
ReactDOM.render(<Order />, document.getElementById("main_container"));