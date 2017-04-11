/**
 * Created by zwy on 2017/4/10.
 */

var NavList = React.createClass({
    getInitialState:function(){
        return {
            config:{
                key:"id",
                parentKey:"parentId",
                rootRule:"0",
                floor:2,
                attrs:[{name:"id", text:"id", width:"50"},
                    {name:"name", text:"英文名", width:"100"},
                    {name:"text", text:"中文名", width:"150"},
                    {name:"href", text:"跳转路径", width:"600"},
                    {name:"tagIds", text:"所包含查询条件的id", width:"150"},
                    {name:"parentId", text:"父级id", width:"50"},
                    {name:"state", text:"启用状态", width:"50"}
                ]
            },
            list:[],
            selectedArray:[]
        };
    },
    componentWillMount:function(){
        $.ajax({
            type:"get",
            url:"service/manage/queryNavList",
            success:function(data){
                if (data.map.msg === "login"){
                    setCookie("swyFrom",window.location.href);
                    window.location.href = "login.html";
                }else if (data.map.msg === "success"){
                    this.setState({list:data.list})
                }
            }.bind(this)
        });
    },
    save:function(event) {
        var el = event.target;
        var key = $(el).attr("data-key");
        var tds = $(el).parent().parent().find("td");
        var id = $(tds[0]).text();
        var name = $(tds[1]).text();
        var text = $(tds[2]).text();
        var href = $(tds[3]).text();
        var tagIds = $(tds[4]).text();
        var parentId = $(tds[5]).text();
        var state = $(tds[6]).text();
        $.ajax({
            type:"post",
            url:"service/manage/updateNavType",
            data:{id:id,name:name,text:text,href:href,tagIds:tagIds,parentId:parentId,state:state},
            success:function (data) {
                if (data.map.msg === "login"){
                    setCookie("swyFrom",window.location.href);
                    window.location.href = "login.html";
                }else if (data.map.msg === "success"){
                    this.setState({list:data.list})
                }
            }.bind(this)
        });
    },
    select:function (event) {
        var el = event.target;
        var key = $(el).attr("data-key");
        var selectedArray = this.state.selectedArray;
        var newArray;
        if (_.indexOf(selectedArray, key.toString()) > -1) {
            newArray = _.without(selectedArray, key);
        }else{
            newArray = new Array();
            _.map(selectedArray, function(obj, i){
                newArray.push(obj);
            });
            newArray.push(key);
        }
        _selectedNav = newArray;
        this.setState({selectedArray:newArray});
    },
    render:function(){
        var list = this.state.list;
        var selectedArray = this.state.selectedArray;
        var key = this.state.config.key;
        var attrs = this.state.config.attrs;
        for (var i in list) {
            var obj = list[i];
            obj["selected"] = false;
            for(var j in selectedArray) {
                if (selectedArray[j] == obj[key]) {
                    obj["selected"] = true;
                }
            }
        }
        var treeData = listDataToTreeData(list, key, this.state.config.parentKey, this.state.config.rootRule);
        var trs = new Array();
        var tds = new Array();
        for (var i in attrs) {
            var attr = attrs[i];
            var width = attr.width;
            if (width.indexOf("%") < 0) {
                if (width.indexOf("px") > -1) {
                    width = width.substring(0, width.indexOf("px"));
                }
                if (i === 0) {
                    width = this.state.floor * 15 + parseInt(attr.width);
                }else{
                    width = parseInt(attr.width);
                }
            }
            var tdStyle = {
                "width":width + "px"
            };
            tds.push(<td style={tdStyle}>{attr.text}</td>)
        }
        trs.push(<tr>{tds}</tr>);
        for (var i in treeData) {
            var obj = treeData[i];
            tds = new Array();
            for (var j in attrs) {
                tds.push(<td contentEditable={j == 0 ? false : true} data-key={obj[key]}>{obj[attrs[j].name]}</td>);
            }
            tds.push(<td style={{"width":"200px"}}><button data-key={obj[key]} onClick={this.select}>选择</button><button data-key={obj[key]} onClick={this.save}>保存</button></td>);
            trs.push(<tr className={obj.selected ? "selected":"parent"}>{tds}</tr>);
            for (var j in obj.children) {
                tds = new Array();
                var child = obj.children[j];
                for (var k in attrs) {
                    tds.push(<td contentEditable={k == 0 ? false : true} data-key={child[key]}>{child[attrs[k].name]}</td>);
                }
                tds.push(<td style={{"width":"200px"}}><button data-key={child[key]} onClick={this.select}>选择</button><button data-key={child[key]} onClick={this.save}>保存</button></td>);
                trs.push(<tr className={child.selected ? "selected":""}>{tds}</tr>);
            }
        }
        return <div className="tree-table"><table>{trs}</table></div>;
    }
});
ReactDOM.render(<NavList />, document.getElementById("nav_config_container"));