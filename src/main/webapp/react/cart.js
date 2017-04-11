/**
 * Created by zwy on 2017/4/6.
 */
var Cart = React.createClass({
    getInitialState:function(){
        return {
            list:null
        };
    },
    componentWillMount:function(){
        $.ajax({
            type:"get",
            url:"service/shop/getCartList",
            success:function(data){
                if (data.map.msg === "login") {
                    setCookie("swyFrom", window.location.href);
                    window.location.href = "login.html";
                }else if(data.map.msg === "success"){
                    _list = data.list;
                    this.setState({list:data.list});
                }
            }.bind(this)
        })
    },
    toCommodityPage:function(event){
        var commodityId = $(event.target).attr("data-commodityId");
        window.location.href = "commodity.html?id=" + commodityId;
    },
    amountChange:function(event){
        var el = event.target;
        var newAmount = $(el).val();
        var commodityId = $(el).attr("data-commodityId");
        $.ajax({
            type:"post",
            url:"service/shop/changeCartAmount",
            data:{amount:newAmount,commodityId:commodityId},
            success:function(data){
                if (data.map.msg === "login"){
                    setCookie("swyFrom",window.location.href);
                    window.location.href = "login.html";
                }else if (data.map.msg === "success") {
                    var newList = [];
                    _.map(this.state.list,function(cart, i){
                        if (cart.commodityId == commodityId) {
                            cart.amount = newAmount;
                        }
                        newList.push(cart);
                    });
                    _list = newList;
                    this.setState({list:newList});
                }
            }.bind(this)
        });
    },
    deleteCommodityInCart:function(event){
        var el = event.target;
        var commodityId = $(el).attr("data-commodityId");
        $.ajax({
            type:"post",
            url:"service/shop/deleteCommodityInCart",
            data:{commodityId:commodityId},
            success:function(data){
                if (data.map.msg === "login"){
                    setCookie("swyFrom",window.location.href);
                    window.location.href = "login.html";
                }else if (data.map.msg === "success") {
                    var newList = [];
                    _.map(this.state.list,function(cart, i){
                        if (cart.commodityId != commodityId) {
                            newList.push(cart);
                        }
                    });
                    _list = newList;
                    this.setState({list:newList});
                }
            }.bind(this)
        });
    },
    render:function(){
        if (this.state.list == null) {
            return <div>购物车空空如也，<a href="index.html">快去选购吧</a></div>;
        }
        var table = [];
        table.push(<tr className="table-title"><td className="table-title-info">商品信息</td><td className="table-title-price">价格</td><td className="table-title-amount">数量</td><td className="table-title-operation"></td></tr>);
        var totalFee = 0;
        _.map(this.state.list,function(cart, i){
            totalFee += cart.price * cart.amount;
            table.push(<tr><td className="table-item-info" data-commodityId={cart.commodityId} onClick={this.toCommodityPage}><img src={cart.imgPath} data-commodityId={cart.commodityId}/><span data-commodityId={cart.commodityId}>{cart.name}</span></td><td className="table-item-price">{cart.price}</td><td className="table-item-amount"><input type="number" min="1" step="1" data-commodityId={cart.commodityId} onChange={this.amountChange} /></td><td className="table-item-operation"><span className="glyphicon glyphicon-trash" data-commodityId={cart.commodityId} onClick={this.deleteCommodityInCart}></span></td></tr>);
        }.bind(this));
        return <div className="cart-div"><table className="cart-table">{table}</table><div className="total-price">总价：{totalFee}元</div></div>;
    }
});
ReactDOM.render(<Cart />, document.getElementById("cart_container"));