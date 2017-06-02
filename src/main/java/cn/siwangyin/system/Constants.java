package cn.siwangyin.system;

public class Constants {

	public static final String MAIL_SMTP = "smtp.qq.com";// smtp服务器
	public static final String MAIL_FROM = "pogo@letspogo.com";// 邮件显示名称
	public static final String MAIL_COPYTO = "";//抄送人邮件地址
	public static final String MAIL_CHECKCODESUBJECT = "验证码通知";//邮件标题
	public static final String MAIL_USERNAME = "pogo@letspogo.com";//发件人真实的账户名
	public static final String MAIL_PASSWORD = "Pogo2016";//发件人密码

	public static final String CONFIGPATH = "cn/siwangyin/config/config.js";
	public static final int EMAILCHECKCODELENGTH = 5;
	public static final int TELCHECKCODELENGTH = 6;
	public static final String TELCHECKCODESERVER = "app.cloopen.com";
	public static final String TELCHECKCODEPORT = "8883";
	public static final String ACCOUNTSID = "8a216da854ff8dcc0155012f25370551";
	public static final String ACCOUNTTOKEN = "bf6ea58ff499480dbf43f6c79b5f2d40";
	public static final String SHORTMESSAGEAPPID = "8a216da8555d110e015576e814812588";
	public static final String CHECKCODETEMPLATEID = "95329";
	public static final String FAHUOTEMPLATEID = "95046";
	public static final String ACTIVATIONCODETEMPLATEID = "101865";

	public static final String[] ADMINACCOUNT = {"522381613@qq.com","quhongyu@letspogo.com"};

	public static final String TOKEN = "PogoWechat";
	public static final String APPID = "wxdbd35c288644f940";
	public static final String APPSECRET = "bf944c756b6f6fe1551e9ed00ccde07a";

	public static final String API_KEY = "351b7e631d2f576bd836473e3e8f7394";
	public static final String NOTIFY_URL = "http://www.letspogo.com/letspogo/shop/weixinNotify";
	public static final String MCH_ID = "1360313802";
	public static final String UNIFIED_ORDER = "https://api.mch.weixin.qq.com/pay/unifiedorder";
	public static final String SUCCESS_URL = "http://www.letspogo.com/letspogo/shop";

	public static String JSAPI_TICKET = "";
	public static String ACCESSTOKEN = "";
	public static long JSAPI_TICKET_TIME = 0;
	public static final int VALIDTIME = 6000000;
	public static long ACCESSTOKENBEGIN = 0;

	public static String DEFAULT_HEAD_IMG_PATH = "images/user_default.png";
	public static String ADVISER_EMAIL = "zhengweiyu@letspogo.com";

}
