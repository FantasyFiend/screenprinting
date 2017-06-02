/**
 * Created by zwy on 2017/6/2.
 */
var Comment = React.createClass({
    getInitialState:function(){
        return {
            commentList:[]
        };
    },
    componentWillMount:function(){
        var articleId = getQueryString("id");
        $.ajax({
            type:"GET",
            url:"service/shop/getCommentsByArticleId",
            data:{articleId:articleId},
            success:function(data){
                console.log(data.list);
                this.setState({commentList:data.list});
            }.bind(this)
        });
    },
    render:function(){
        var divs = [];
        var commentList = this.state.commentList;
        for (var i = 0; i < commentList.length; i++) {
            var comment = commentList[i];
            var commentsDiv = [];
            commentsDiv.push(<div className="comment-main-floor"><span>{comment.commentBy}:{comment.content}</span><span>{comment.time}</span></div>);
            if (comment.children != null) {
                for (var j = 0; j < comment.children.length; j++) {
                    var child = comment.children[j];
                    commentsDiv.push(<div className="comment-sub-floor"><span>{child.commentBy}&nbsp;回复&nbsp;{child.replyTo}:{child.content}</span><span>{child.time}</span></div>);
                }
            }
            divs.push(<div className="comment-floor">{commentsDiv}</div>);
        }
        return  <div className="container comments-total-container">
                    <div className="comments-total-container-title">评论</div>
                    <div className="comments-section">
                        {divs}
                    </div>
                </div>
    }
});

ReactDOM.render(<Comment />, document.getElementById("comment_container"));