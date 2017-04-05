/**
 * Created by zwy on 2017/3/19.
 */

var Condition = React.createClass({
    getInitialState:function(){
        return {
            allCondition:[],
            condition:null
        };
    },
    componentWillMount:function(){
        $.ajax({
           type:"get",
           url:"service/shop/queryAllCondition",
           data:{type:getQueryString("type")},
           success:function(msg){
               this.setState({allCondition:msg.list});
           }.bind(this)
        });
    },
    conditionClick:function(event){
        var conditionName = $(event.target).attr("data-tag");
        alert(conditionName);
    },
    render:function(){
        var map = formatTags(this.state.allCondition);
        var conditionMap = arrayToMap(this.state.condition, name);
        for (var i in map) {
            var con = map[i];
            if (con.children) {
                for (var j = 0; j < con.children.length; j++) {
                    var tag = con.children[j];
                    if (conditionMap[tag.name] != null) {
                        tag.active = true;
                    }else{
                        tag.active = false;
                    }
                }
            }
        }
        var divs= [];
        for (var i in map) {
            var con = map[i];
            var uls = [];
            if (con.children) {
                for (var j = 0; j < con.children.length; j++) {
                    var tag = con.children[j];
                    uls.push(<li onClick={this.conditionClick} data-tag={tag.name}><p data-name={tag.name} data-tag={tag.name}>{tag.text}</p></li>);
                }
            }
            divs.push(<div className="dropdown"><p className="dropdown-toggle" id={"dropdown_" + con.name} data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" data-name={con.name}>{con.text}
                <span class="caret"></span><ul className="dropdown-menu" aria-labelledby={"dropdown_" + con.name}>{uls}</ul></p></div>);
        }
        return <div className="col-xs-12 col-sm-4 col-md-3 col-lg-2 condition-div">{divs}</div>;
    }
});

var List = React.createClass({
    getInitialState:function(){
       return {
           list:this.props.list
       };
    },
    addToCart:function(event){
        var commodityNumber = $(event.target).attr("data-commodity");
        alert(commodityNumber);
    },
    render:function(){
        var divs = [];
        for (var i = 0; i < this.state.list.length; i++) {
            var commodity = this.state.list[i];
            divs.push(<div className="col-xs-6 col-sm-6 col-md-4 col-lg-4">
                        <div className="thumbnail">
                            <a href={"/commodity?commodityNumber=" + commodity.commodityNumber}><img src={commodity.imgPath} alt={commodity.name}/></a>
                            <div className="caption">
                                <h6>{commodity.name}</h6>
                                <p>{"￥" + commodity.price}</p>
                                <p>
                                    <span className="btn btn-default" role="button" data-commodity={commodity.commodityNumber} onClick={this.addToCart}>
                                        <span className="glyphicon glyphicon-plus-sign"></span>&nbsp;<span className="glyphicon glyphicon-shopping-cart"></span>
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>);
        }
        return <div className="col-xs-12 col-sm-8 col-md-9 col-lg-10">{divs}</div>;
    }
});

var Shop = React.createClass({
    getInitialState:function(){
        return {
            condition:null,
            list:[]
        };
    },
    componentWillMount:function(){
        var condition = getQueryString("keywords");
        // this.setState({condition:condition});
        $.ajax({
           type:"post",
           url:"service/shop/queryCommodityByCondition",
           data:{condition:condition},
           success:function(data){
               console.log(data);
               this.setState({condition:condition, list:data.list});
           }.bind(this)
        });
    },
    render:function(){
        return <div className="shop_main_container">
                    <Condition condition = {this.state.condition}/>
                    <List list = {this.state.list}/>
                </div>;
    }
});
ReactDOM.render(<Shop />, document.getElementById("main_container"));