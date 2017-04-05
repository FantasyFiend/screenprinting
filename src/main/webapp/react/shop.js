/**
 * Created by zwy on 2017/3/19.
 */

var Condition = React.createClass({
    getInitialState:function(){
        return {
            allCondition:[],
            condition:this.props.condition
        };
    },
    componentWillMount:function(){
        $.ajax({
           type:"get",
           url:"service/shop/queryAllCondition",
           data:{type:getQueryString("type")},
           success:function(data){
               this.setState({allCondition:data.list});
           }.bind(this)
        });
    },
    componentWillReceiveProps:function(props){
        this.setState({condition:props.condition});
    },
    conditionClick:function(event){
        var name = $(event.target).attr("data-tag");
        var condition = this.state.condition;
        if (_.indexOf(condition, name) > -1) {
            var newCondition = _.without(condition, name);
        }else{
            newCondition = new Array();
            newCondition.push(name);
            newCondition = newCondition.concat(condition);
        }
        this.props.conditionChange(newCondition);
    },
    changeFoldState:function(event){
        var tagId = $(event.target).attr("data-tag");
        var condition = this.state.allCondition;
        for (var i = 0; i < condition.length; i++) {
            var con = condition[i];
            if (con.id == tagId) {
                con["unfolded"] = !con["unfolded"];
            }
        }
        this.setState({allCondition:condition});
    },
    render:function(){
        var map = formatTags(this.state.allCondition);
        var conditionMap = new Object();
        for (var i = 0; i < this.state.condition.length; i++) {
            var con = this.state.condition[i];
            conditionMap[con] = con;
        }
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
            var spans = [];
            if (con.children) {
                spans.push(<span className="condition-title" data-tag={con.id} onClick={this.changeFoldState}>{con.text}<p data-tag={con.id}><span className={con["unfolded"] ? "glyphicon glyphicon-minus" : "glyphicon glyphicon-plus"} data-tag={con.id}></span></p></span>);
                for (var j = 0; j < con.children.length; j++) {
                    var tag = con.children[j];
                    spans.push(<span onClick={this.conditionClick} data-tag={tag.name} className={tag.active ? "condition-item active" : "condition-item"}><p data-tag={tag.name}>{tag.text}</p></span>);
                }
                var divStyle;
                var height = 35;
                if (con["unfolded"]) {
                    height += con.children.length * 40;
                }
                divStyle = {
                    height:height + "px"
                };
                divs.push(<div style={divStyle} className={con["unfolded"] ? "condition-group unfolded" : "condition-group"}>{spans}</div>);
            }
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
        var id = $(event.target).attr("data-commodity");
        $.ajax({
            type:"post",
            url:"service/shop/addToCart",
            data:{commodity:id, amount:1},
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
    componentWillReceiveProps:function(props){
        this.setState({list:props.list});
    },
    render:function(){
        var divs = [];
        for (var i = 0; i < this.state.list.length; i++) {
            var commodity = this.state.list[i];
            divs.push(<div className="col-xs-6 col-sm-6 col-md-4 col-lg-4">
                        <div className="thumbnail">
                            <a href={"/commodity.html?id=" + commodity.id}><img src={commodity.imgPath} alt={commodity.name}/></a>
                            <div className="caption">
                                <h6>{commodity.name}</h6>
                                <p>{"￥" + commodity.price}</p>
                                <p>
                                    <span className="btn btn-default" role="button" data-commodity={commodity.id} onClick={this.addToCart}>
                                        <span className="glyphicon glyphicon-plus-sign" data-commodity={commodity.id}></span>&nbsp;<span className="glyphicon glyphicon-shopping-cart" data-commodity={commodity.id}></span>
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
            condition:[],
            list:[]
        };
    },
    componentWillMount:function(){
        var condition = getQueryString("keywords");
        var array = condition.split("-");
        $.ajax({
           type:"post",
           url:"service/shop/queryCommodityByCondition",
           data:{condition:condition},
           success:function(data){
               this.setState({condition:array, list:data.list});
           }.bind(this)
        });
    },
    handleConditionChange:function (newCondition) {
        if (window.history.replaceState) {
            var href = window.location.href;
            var newHref = href.substring(0, href.indexOf("keywords="));
            newHref = newHref + "keywords=" + newCondition.join("-");
            window.history.replaceState(null, "", newHref);
        }
        $.ajax({
            type:"post",
            url:"service/shop/queryCommodityByCondition",
            data:{condition:newCondition.join("-")},
            success:function(data){
                this.setState({condition:newCondition, list:data.list});
            }.bind(this)
        });
    },
    render:function(){
        return <div className="shop_main_container">
                    <Condition condition={this.state.condition} conditionChange={this.handleConditionChange}/>
                    <List list={this.state.list}/>
                </div>;
    }
});
ReactDOM.render(<Shop />, document.getElementById("main_container"));