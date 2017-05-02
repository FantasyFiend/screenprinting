package cn.siwangyin.domainObject;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

import java.util.Date;

/**
 * Created by zwy on 2017/4/23.
 */
@Table("chat_message")
public class ChatMessage {

    @Id
    private int id;

    @Column("from_user_email")
    private String from;

    @Column("to_user_email")
    private String to;

    @Column
    private String message;

    @Column("success_state")
    private String successState;

    @Column("error_message")
    private String errorMessage;

    @Column
    private Date date;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


    public String getSuccessState() {
        return successState;
    }

    public void setSuccessState(String successState) {
        this.successState = successState;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
