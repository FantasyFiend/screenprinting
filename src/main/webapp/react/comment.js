/**
 * Created by zwy on 2017/6/2.
 */
var Comment = React.createClass({
    getInitialState:function(){
        return {
            commentList:[],
            articleId:0,
            user:null,
            cookieText:""
        };
    },
    componentWillMount:function(){
        $.ajax({
            type:"get",
            url:"service/shop/checkLogin",
            success:function(data){
                if (data.map.msg === "success") {
                    this.setState({user:data.map.user});
                }
            }.bind(this)
        })
        var articleId = getQueryString("id");
        $.ajax({
            type:"GET",
            url:"service/shop/getCommentsByArticleId",
            data:{articleId:articleId},
            success:function(data){
                this.setState({commentList:data.list,articleId:articleId});
            }.bind(this)
        });
        var cookieText = getCookie("swyCommentContent");
        delCookie("swyCommentContent");
        this.setState({cookieText:cookieText});
    },
    publish:function(event){
        var text = $(event.target).parent().find("textarea").val();
        if (text.length > 2000) {
            alert("留言不能超过2000个字符。");
            return false;
        }
        if (this.state.user == null) {
            if(confirm("请先登录后再发表评论。")) {
                setCookie("swyFrom", window.location.href);
                setCookie("swyCommentContent",text);
                window.location.href = "login.html";
            }
            return false
        }
        $.ajax({
            type:"POST",
            url:"service/shop/addMainComment",
            data:{articleId:this.state.articleId, content:text, nickname:this.state.user.nickname},
            success:function(data){
                console.log(data);
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
            commentsDiv.push(<div className="comment-main-floor"><span className="floor-content-span"><b>{comment.floor}#</b>&nbsp;&nbsp;<b>{comment.commentBy}</b>：{comment.content}</span><span className="floor-time-span">{comment.time}</span></div>);
            if (comment.children != null) {
                for (var j = 0; j < comment.children.length; j++) {
                    var child = comment.children[j];
                    commentsDiv.push(<div className="comment-sub-floor"><span className="floor-content-span"><b>{child.commentBy}</b>&nbsp;回复&nbsp;<b>{child.replyTo}</b>：{child.content}</span><span className="floor-time-span">{child.time}</span></div>);
                }
            }
            divs.push(<div className="comment-floor">{commentsDiv}</div>);
        }
        return  <div className="container comments-total-container">
                    <div className="comments-total-container-title">评论</div>
                    <div className="comments-section">
                        {divs}
                    </div>
                    <div className="publish-section"><textarea placeholder="请先登录，再发表评论">{this.state.cookieText}</textarea><button onClick={this.publish}>发表</button></div>
                </div>
    }
});

ReactDOM.render(<Comment />, document.getElementById("comment_container"));