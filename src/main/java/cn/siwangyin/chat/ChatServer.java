package cn.siwangyin.chat;

import cn.siwangyin.config.IocConfig;
import cn.siwangyin.domainObject.ChatMessage;
import cn.siwangyin.system.Constants;
import org.nutz.dao.Cnd;
import org.nutz.dao.Condition;
import org.nutz.dao.Dao;
import org.nutz.json.Json;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;

/**
 * Created by zwy on 2017/4/13.
 */
@ServerEndpoint("/websocket")
public class ChatServer {

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 日期格式化

    private static CopyOnWriteArraySet<ChatServer> webSocketSet = new CopyOnWriteArraySet<>();

    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;

    private Dao dao = IocConfig.getNutDao();

    @OnOpen
    public void onOpen(Session session){
        this.session = session;
        webSocketSet.add(this);     //加入set中
        System.out.println("有新连接加入！sessionId为:" + session.getId());
    }
    @OnClose
    public void onClose(){
        System.out.println("有一连接关闭！sessionId为:" + this.session.getId());
        webSocketSet.remove(this);  //从set中删除
    }
    /**
     * 接受客户端的消息，并把消息发送给所有连接的会话
     * @param message 客户端发来的消息
     * @param session 客户端的会话
     */
    @OnMessage
    public void onMessage(String message, Session session) {
        ChatMessage cm = Json.fromJson(ChatMessage.class, message);
        if (cm == null) {
            sendErrorMessage(cm, "信息发送失败，请重新尝试！");
            return;
        }
        //初始化用户信息
        Map<String, Object> map = session.getUserProperties();
        if (map.get("user") == null || map.get("user").equals("")) {
            map.put("user", cm.getFrom());
        }
        //获取未收到消息
        if (cm.getTo() == null || cm.getTo().equals("")) {
            Condition cnd = Cnd.where("to", "=", cm.getFrom()).and("successState", "=", "sending").asc("date");
            List<ChatMessage> list = dao.query(ChatMessage.class, cnd);
            try {
                sendMessage(Json.toJson(list));
            } catch (IOException e) {
                e.printStackTrace();
            }
            return;
        }

        //发消息给用户
        if (cm.getTo().equals("adviser")) {
            cm.setTo(Constants.ADVISER_EMAIL);
        }
        cm.setDate(new Date());
        cm.setSuccessState("sending");
        for(ChatServer item: webSocketSet){
            String user = (String) item.session.getUserProperties().get("user");
            if (user != null && user.equals(cm.getTo())) {
                cm.setSuccessState("success");
                cm.setErrorMessage("");
                item.sendMessage(cm);
            }
        }
        dao.insert(cm);
        sendMessage(cm);
    }
    /**
     * 发送消息
     * @param message
     * @throws IOException
     */
    public void sendMessage(String message) throws IOException{
        this.session.getBasicRemote().sendText(message);
        //this.session.getAsyncRemote().sendText(message);
    }
    @OnError
    public void error(Throwable t) {
        // 添加处理错误的操作
    }

    private void sendErrorMessage(ChatMessage cm, String errorMessage) {
        if (cm == null) {
            cm = new ChatMessage();
        }
        cm.setSuccessState("error");
        cm.setErrorMessage(errorMessage);
        sendMessage(cm);
    }

    public void sendMessage(ChatMessage cm){
        if (cm == null) {
            cm = new ChatMessage();
            cm.setSuccessState("error");
            cm.setErrorMessage("信息发送失败，请重新尝试！");
            sendMessage(cm);
            return;
        }
        try {
            this.sendMessage(Json.toJson(cm));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}