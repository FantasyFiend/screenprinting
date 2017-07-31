/**
 * Created by zwy on 2017/6/19.
 */
var Nav = React.createClass({
    getInitialState:function(){
        return  {
            pageName:_pageName,
            list:[],
            blogList:[]
        };
    },
    componentWillMount:function(){
        $.ajax({
            type:"get",
            url:"service/shop/getSessionUserAndNavType",
            success:function(data){
                this.setState({list:data.list, blogList:data.map.blogList});
            }.bind(this)
        });
    },
    componentDidMount:function(){
        var array = $(".nav-item");
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if ($(item).attr("data-name") === this.state.pageName) {
                $(item).addClass("active");
            }else{
                $(item).removeClass("active");
            }
        }
    },
    render:function(){
        var lis = [];
        var blogLis = [];
        for (var i = 0; i < this.state.list.length; i++) {
            var type = this.state.list[i];
            if (type.parentId === 0) {
                lis.push(<li><a href={type.href} className="dropdown-header">{type.text}</a></li>);
                for (var j = 0; j < this.state.list.length; j++) {
                    var child = this.state.list[j];
                    if (child.parentId === type.id) {
                        lis.push(<li><a href={child.href}>{child.text}</a></li>);
                    }
                }
                lis.push(<li className="divider"></li>);
            }
        }
        for (var i = 0; i < this.state.blogList.length; i++) {
            var type = this.state.blogList[i];
            if (type.parentId === 0) {
                blogLis.push(<li><a href={type.href} className="dropdown-header">{type.text}</a></li>);
                for (var j = 0; j < this.state.blogList.length; j++) {
                    var child = this.state.blogList[j];
                    if (child.parentId === type.id) {
                        blogLis.push(<li><a href={child.href}>{child.text}</a></li>);
                    }
                }
                blogLis.push(<li className="divider"></li>);
            }
        }
        lis.pop();
        blogLis.pop();
        return  <nav className="index-nav">
                    <span data-name="index" className="nav-item"><a href="index.html"><span className="icon-blacklightlogo"></span></a></span>
                    <span data-name="print" className="nav-item"><a href="print.html"><span className="icon-hei"></span><span className="icon-gaung"></span><span className="icon-yin"></span><span className="icon-zao"></span></a></span>
                    <span data-name="shop" className="nav-item">
                        <span className="icon-hei"></span><span className="icon-gaung"></span><span className="icon-shang"></span><span className="icon-dian"></span><ul>{lis}</ul>
                    </span>
                    <span data-name="blog" className="nav-item">
                        <span className="icon-hei"></span><span className="icon-gaung"></span><span className="icon-tu"></span><span className="icon-shu"></span><span className="icon-guan"></span><ul>{blogLis}</ul>
                    </span>
                    {/*<span data-name="cooperation" className="nav-item"><a href="cooperation.html"><span className="icon-pin"></span><span className="icon-pai"></span><span className="icon-he"></span><span className="icon-zuo"></span></a></span>*/}
                    <span data-name="contact" className="nav-item"><a href="contact.html"><span className="icon-lian"></span><span className="icon-xi"></span><span className="icon-wo"></span><span className="icon-men"></span></a></span>
                    {/*<span className="nav-item">Logo</span>*/}
                </nav>;
    }
});
ReactDOM.render(<Nav />, document.getElementById("nav_container"));