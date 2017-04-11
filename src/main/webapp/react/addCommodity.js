/**
 * Created by Administrator on 2017/4/10.
 */
var addCommodity = React.createClass({
    getInitialState:function(){
        return {
            navList:[],
            tagList:[],
            selectedNavList:[],
            selectedTagList:[]
        };
    },
    componentWillMount:function(){
        $.ajax({
            type:"get",
            url:"service/shop/queryNavAndTagList",
            success:function (data) {
                var navList = data.map.navList;
                var tagList = data.map.tagList;
                this.setState({navList:navList, tagList:tagList});
            }.bind(this)
        });
    },
    render:function(){
        var navDiv = [];
        for (var i = 0; i < this.state.navList.length; i++) {
            var nav = this.state.navList[i];
        }

    }
});