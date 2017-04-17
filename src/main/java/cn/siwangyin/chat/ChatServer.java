package cn.siwangyin.chat;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;

/**
 * Created by zwy on 2017/4/13.
 */
@ServerEndpoint("/websocket")
public class ChatServer {

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 日期格式化

    private static CopyOnWriteArraySet<ChatServer> webSocketSet = new CopyOnWriteArraySet<ChatServer>();

    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;

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
        System.out.println("来自客户端的消息:" + message);

        //群发消息
        for(ChatServer item: webSocketSet){
            try {
//                if (item.session.getId() == messageObject.toSession()){
//
//                }
                item.sendMessage(message);
            } catch (IOException e) {
                e.printStackTrace();
                continue;
            }
        }
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

}
