/**
 * Created by zwy on 2017/6/5.
 */
var Series = React.createClass({
    getInitialState:function(){
        return {
            series:null,
            list:[]
        };
    },
    componentWillMount:function(){
        var seriesId = getQueryString("id");
        $.ajax({
            type:"GET",
            url:"service/shop/getSeries",
            data:{seriesId:seriesId},
            success:function(data){
                this.setState({list:data.list,series:data.map.series});
            }.bind(this)
        });
    },
    render:function(){
        if (this.state.series == null) {
            return <div>无此系列!</div>;
        }
        var as = [];
        for (var i = 0; i < this.state.list.length; i++) {
            var article = this.state.list[i];
            as.push(<a href={"blog.html?id=" + article.id} className="list-group-item">{article.name}</a>);
        }
        return  <div className="series-container">
                    <div className="series-title">
                        <div className="series-name"><b>{this.state.series.name}</b></div>
                        <div className="series-description">{this.state.series.description}</div>
                    </div>
                    <div className="list-group">{as}</div>
                </div>;

    }
});

ReactDOM.render(<Series />, document.getElementById("series_container"));