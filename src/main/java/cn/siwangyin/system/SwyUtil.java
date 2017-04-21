package cn.siwangyin.system;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.SortedMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.nutz.lang.random.R;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.event.IIOWriteProgressListener;
import javax.imageio.stream.FileImageOutputStream;

public class SwyUtil {

	private static String emailCheckcode = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	private static String telCheckcode = "0123456789";

	private static String orderTimeFormat = "yyyyMMddHHmmss";

	// \b 是单词边界(连着的两个(字母字符 与 非字母字符) 之间的逻辑上的间隔),  
	// 字符串在编译时会被转码一次,所以是 "\\b"  
	// \B 是单词内部逻辑间隔(连着的两个字母字符之间的逻辑上的间隔)  
	private static String phoneReg = "\\b(ip(hone|od)|android|opera m(ob|in)i" 
			+"|windows (phone|ce)|blackberry" 
			+"|s(ymbian|eries60|amsung)|p(laybook|alm|rofile/midp"
			+"|laystation portable)|nokia|fennec|htc[-_]"
			+"|mobile|up.browser|[1-4][0-9]{2}x[1-4][0-9]{2})\\b";

	private static String tableReg = "\\b(ipad|tablet|(Nexus 7)|up.browser"
			+"|[1-4][0-9]{2}x[1-4][0-9]{2})\\b";

	//移动设备正则匹配：手机端、平板
	private static Pattern phonePat = Pattern.compile(phoneReg, Pattern.CASE_INSENSITIVE);
	private static Pattern tablePat = Pattern.compile(tableReg, Pattern.CASE_INSENSITIVE);

	/**
	 * 检测是否是移动设备访问
	 * 
	 * @Title: check
	 * @Date : 2014-7-7 下午01:29:07
	 * @param userAgent 浏览器标识
	 * @return true:移动设备接入，false:pc端接入
	 */
	public static boolean isMobileDevice(String userAgent){  
		if(null == userAgent){  
			userAgent = "";  
		}  
		// 匹配  
		Matcher matcherPhone = phonePat.matcher(userAgent);  
		Matcher matcherTable = tablePat.matcher(userAgent);  
		if(matcherPhone.find() || matcherTable.find()){  
			return true;  
		} else {  
			return false;  
		}  
	}

	public static String generateEmailCheckcode() {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < Constants.EMAILCHECKCODELENGTH; i++) {
			int p = R.random(0, emailCheckcode.length() - 1);
			sb.append(emailCheckcode.charAt(p));
		}
		return sb.toString();
	}
	
	public static String generateCheckcode(int length) {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < length; i++) {
			int p = R.random(0, emailCheckcode.length() - 1);
			sb.append(emailCheckcode.charAt(p));
		}
		return sb.toString();
	}

	public static String generateTelCheckcode() {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < Constants.TELCHECKCODELENGTH; i++) {
			int p = R.random(0, telCheckcode.length() - 1);
			sb.append(telCheckcode.charAt(p));
		}
		return sb.toString();
	}

	public static String getMD5Code(String normalCode){
		byte[] buf = normalCode.getBytes();
		StringBuilder sb = new StringBuilder();
		try {
			MessageDigest md5 = MessageDigest.getInstance("MD5");
			md5.update(buf);
			byte[] tmp = md5.digest();
			for (byte b:tmp) {
				sb.append(Integer.toHexString(b&0xff));
			}
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		return sb.toString();
	}

	public static String getOrderTime(Date date){
		return getFormatTime(date, orderTimeFormat);
	}

	public static String getFormatTime(Date date, String format) {
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		return sdf.format(date);
	}

	public static String getVisitorMac() {
		return null;
	}

	public static String generateNickname(String username) {
		if (username == null || username.length() < 5) {
			return "****";
		}
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < username.length(); i++) {
			if (i < 4) {
				sb.append(username.charAt(i));
			}else {
				sb.append("*");
			}
		}
		return sb.toString();
	}
	
	public static String createNoncestr() {
		return generateCheckcode(16);
	}


	@SuppressWarnings("rawtypes")
	public static String getRequestXml(SortedMap<Object, Object> parameters) {
		StringBuffer sb = new StringBuffer();
        sb.append("<xml>");
        Set es = parameters.entrySet();
        Iterator it = es.iterator();
        while(it.hasNext()) {
            Map.Entry entry = (Map.Entry)it.next();
            String k = (String)entry.getKey();
            String v = (String)entry.getValue();
            if ("detail".equalsIgnoreCase(k)||"attach".equalsIgnoreCase(k)||"body".equalsIgnoreCase(k)||"sign".equalsIgnoreCase(k)) {
                sb.append("<"+k+">"+"<![CDATA["+v+"]]></"+k+">");
            }else {
                sb.append("<"+k+">"+v+"</"+k+">");
            }
        }
        sb.append("</xml>");
        return sb.toString();
	}

    public static String setXML(String return_code, String return_msg) {
        return "<xml><return_code><![CDATA[" + return_code
                + "]]></return_code><return_msg><![CDATA[" + return_msg
                + "]]></return_msg></xml>";
    }

    /**
     *
     * @param newFile
     * @param sourceImageFile
     * @param quality
     * @throws IOException
     */
	public static void writeJPEG(File newFile, File sourceImageFile, int quality) throws IOException {
        BufferedImage image = ImageIO.read(new FileInputStream(sourceImageFile));
        Iterator it = ImageIO.getImageWritersBySuffix("jpg");
		if (it.hasNext()) {
			FileImageOutputStream fileImageOutputStream = new FileImageOutputStream(newFile);
			ImageWriter iw = (ImageWriter) it.next();
			ImageWriteParam iwp = iw.getDefaultWriteParam();
			iwp.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
			iwp.setCompressionQuality((float) quality / 100f);
			iw.setOutput(fileImageOutputStream);
			iw.write(null, new IIOImage(image, null, null), iwp);
			iw.dispose();
			fileImageOutputStream.flush();
			fileImageOutputStream.close();
		}
	}

}
