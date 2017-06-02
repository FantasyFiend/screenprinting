package cn.siwangyin.domainObject;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

import java.util.Date;
import java.util.List;

/**
 * Created by zwy on 2017/6/2.
 */
@Table("swy_comment")
public class SwyComment {

    @Id
    private int id;

    @Column("article_id")
    private int articleId;

    @Column
    private int floor;

    @Column("floor_comment")
    private boolean floorComment;

    @Column("comment_by")
    private String commentBy;

    @Column("reply_to")
    private String replyTo;

    @Column
    private Date time;

    @Column
    private String content;

    @Column
    private char state;

    private List<SwyComment> children;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getArticleId() {
        return articleId;
    }

    public void setArticleId(int articleId) {
        this.articleId = articleId;
    }

    public int getFloor() {
        return floor;
    }

    public void setFloor(int floor) {
        this.floor = floor;
    }

    public boolean isFloorComment() {
        return floorComment;
    }

    public void setFloorComment(boolean floorComment) {
        this.floorComment = floorComment;
    }

    public String getCommentBy() {
        return commentBy;
    }

    public void setCommentBy(String commentBy) {
        this.commentBy = commentBy;
    }

    public String getReplyTo() {
        return replyTo;
    }

    public void setReplyTo(String replyTo) {
        this.replyTo = replyTo;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public char getState() {
        return state;
    }

    public void setState(char state) {
        this.state = state;
    }

    public List<SwyComment> getChildren() {
        return children;
    }

    public void setChildren(List<SwyComment> children) {
        this.children = children;
    }
}
