/**
 * Created by zwy on 2017/4/5.
 */
var Commodity = React.createClass({
    getInitialState:function(){
        return {
            commodity:null,
            imgIndex:0
        };
    },
    componentWillMount:function(){
        var id = getQueryString("id");
        $.ajax({
            type:"get",
            url:"service/shop/getCommodityById",
            data:{id:id},
            success:function(data){
                if (data.map.commodity != null) {
                    this.setState({commodity:data.map.commodity});
                }
            }.bind(this)
        });
    },
    changeImgIndex:function(event){
        var index = parseInt($(event.target).attr("data-index"));
        this.setState({imgIndex:index});
    },
    addToCart:function(event){
        var commodityId = $(event.target).attr("data-id");
        $.ajax({
            type:"post",
            url:"service/shop/addToCart",
            data:{commodityId:commodityId, amount:$("#amount").val()},
            success:function(data){
                if (data.map.msg === "success") {
                    $("#cartBadge").text(data.map.count);
                }else if (data.map.msg === "login"){
                    setCookie("swyFrom",window.location.href);
                    window.location.href = "login.html";
                }
            }
        });
    },
    checkout:function(){
        $.ajax({
            type:"get",
            url:"service/shop/checkout",
            data:{commodityId:this.state.commodity.id},
            success:function(data){
                switch (data.map.msg) {
                    case "success":
                        window.location.href = "cart.html";
                        break;
                    case "login":
                        setCookie("swyFrom", window.location.href);
                        window.location.href = "login.html";
                        break;
                    case "noCommodities":
                        if (confirm("您尚未添加此商品到购物车，是否依旧前往结账页面？")) {
                            window.location.href = "cart.html";
                        }
                        break;
                }
            }
        });
    },
    render:function(){
        if (this.state.commodity == null) {
            return <div className="no-commodity">未查到此商品!</div>;
        }
        var commodity = this.state.commodity;
        var imgPathArray = commodity.imgPath.split("|");
        console.log(imgPathArray);
        var index = this.state.imgIndex;
        var imgs = [];
        for (var i = 0; i < imgPathArray.length; i++) {
            imgs.push(<img className={i === this.state.imgIndex ? "active":"opacity"} src={imgPathArray[i]} data-index={i} onClick={this.changeImgIndex}/>);
        }
        return <div className="commodity_container">
                    <div className="container info-container">
                        <div className="col-sm-12 col-md-6 info-img-container">
                            <div className="main-img"><img src={imgPathArray[index]}/></div>
                            <div className="little-img">{imgs}</div>
                        </div>
                        <div className="col-sm-12 col-md-6 info-text-container">
                            <div className="info-title">{commodity.name}</div>
                            <div className="info-description">{commodity.description}</div>
                            <div className="info-price">价格：<span className="price-number">{commodity.price}</span>元</div>
                            <div className="info-amount">数量：<input type="number" min="1" step="1" id="amount"/></div>
                            <div className="info-button-group"><span className="add-to-cart" onClick={this.addToCart} data-id={commodity.id}>加入购物车</span></div>
                            <div className="info-button-group"><span className="checkout" onClick={this.checkout}>结账</span></div>
                        </div>
                    </div>
                    <div className="container separator-div"><span>商品详情</span></div>
                    <div className="container detail-container" dangerouslySetInnerHTML={{__html:commodity.detailHtml}}></div>
                </div>;
    }
});
ReactDOM.render(<Commodity />, document.getElementById("main_container"));