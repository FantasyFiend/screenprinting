/**
 * Created by zwy on 2017/6/2.
 */
var Article = React.createClass({
    getInitialState:function(){
        return {
            article:null
        };
    },
    componentWillMount:function(){
        var id = getQueryString("id");
        $.ajax({
            type:"GET",
            url:"service/shop/getArticle",
            data:{id:id},
            success:function(data){
                this.setState({article:data.map.article});
            }.bind(this)
        });
    },
    render:function(){
        var article = this.state.article;
        if (article == null){
            return <div>无相关文章！</div>;
        }
        return  <div className="container">
                    <div className="article-title">
                        <div className="article-name">{article.name}</div>
                        <div className="article-info"><span>{article.author}</span>|<span>{article.time}</span></div>
                    </div>
                    <div className="article-content" dangerouslySetInnerHTML={{__html:article.content}}></div>
                </div>;
    }
});
ReactDOM.render(<Article />, document.getElementById("article_container"));