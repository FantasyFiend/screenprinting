/**
 * Created by zwy on 2017/6/19.
 */
var Carousel = React.createClass({
    getInitialState:function(){
        return  {
            list:_list,
            time:_time,
            width:0,
            height:0,
            timer:null,
            index:0
        };
    },
    setContainerHeight:function(event){
        if (parseInt($(event.target).attr("data-index")) === 0) {
            var container = $(".carousel-img-container");
            var width = $(container).width();
            var height = $(container).find("img").height();
            var index = this.state.index;
            this.setState({width:width, height:height}, function () {
                $(container).css("height", height + "px");
                var imgs = $(container).find("img");
                for (var i = 0; i < imgs.length; i++) {
                    var img = $(imgs[i]);
                    $(img).css("left", this.state.width * (i - this.state.index) + "px");
                }
            });
            var timer = setInterval(function(){
                this.setState({index:++index % 3});
            }.bind(this), this.state.time);
            this.setState({timer:timer});
        }
    },
    changeIndex:function(event){
        var ele = event.target;
        var index = parseInt($(ele).attr("data-index"));
        clearInterval(this.state.timer);
        this.setState({index:index, timer:null});
        var timer = setInterval(function(){
            this.setState({index:++index % 3});
        }.bind(this), this.state.time);
        this.setState({timer:timer});
    },
    render:function(){
        var list = this.state.list;
        var imgs = [];
        var spans = [];
        list.forEach(function (item, i) {
            var style = {left:0};
            var spanStyle = {display:"inline-block", width:this.state.width / list.length + "px", height:"5px", backgroundColor:"#333", cursor:"pointer"};
            if (i > 0) {
                style = {left:"9999px"};
            }
            if (this.state.timer) {
                var style = {left:this.state.width * (i - this.state.index) + "px"};
            }
            if (i === this.state.index) {
                spanStyle.backgroundColor = "#01df32";
            }
            imgs.push(<img data-index={i} src={item.imgPath} alt={item.alt} style={style} onLoad={this.setContainerHeight}/>);
            spans.push(<span data-index={i} style={spanStyle} onClick={this.changeIndex}></span>);
        }.bind(this));
        return  <section className="carousel">
                    <div className="carousel-img-container">{imgs}</div>
                    <div className="carousel-span-container">{spans}</div>
                </section>;
    }
})
ReactDOM.render(<Carousel />, document.getElementById("carousel_container"));