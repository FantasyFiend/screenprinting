package cn.siwangyin.module;

import javax.servlet.http.HttpSession;

import cn.siwangyin.domainObject.SwyCommodity;
import cn.siwangyin.domainObject.SwyTag;
import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.Fail;
import org.nutz.mvc.annotation.Ok;

import cn.siwangyin.config.IocConfig;
import cn.siwangyin.service.ShopService;

import cn.siwangyin.domainObject.SwyUserBasic;
import cn.siwangyin.system.SwyQueryResult;

import java.io.UnsupportedEncodingException;
import java.util.List;

@At("/shop")
@Fail("http:500")
public class ShopModule {

	private ShopService shopService = IocConfig.getIoc().get(ShopService.class);
	
	@At
	@Ok("json")
	public SwyQueryResult getSessionUserAndNavType(HttpSession session){
		SwyQueryResult swyQueryResult = new SwyQueryResult();
		SwyUserBasic sub = (SwyUserBasic) session.getAttribute("user");
		swyQueryResult.getMap().put("user", sub);
		swyQueryResult.setList(shopService.getNavTypeList());
		return swyQueryResult;
	}

	@At
	@Ok("json")
	public String register(HttpSession session, String email, String nickname, String password) {
		SwyQueryResult sqr = shopService.register(email, nickname, password);
		if (sqr.getMap().get("msg") != null && sqr.getMap().get("msg").equals("success")) {
			session.setAttribute("user", sqr.getMap().get("user"));
		}
		return (String) sqr.getMap().get("msg");
	}

	@At
	@Ok("json")
	public String login(HttpSession session, String email, String nickname, String password) {
		SwyQueryResult sqr = shopService.login(email, password);
		if (sqr.getMap().get("msg") != null && sqr.getMap().get("msg").equals("success")) {
			session.setAttribute("user", sqr.getMap().get("user"));
		}
		return (String) sqr.getMap().get("msg");
	}

	@At
	@Ok("json")
	public SwyQueryResult queryAllCondition(String type){
		SwyQueryResult sqr = new SwyQueryResult();
		List<SwyTag> list = shopService.getAllCondition(type);
		sqr.setList(list);
		return sqr;
	}

	@At
	@Ok("json")
	public SwyQueryResult queryCommodityByCondition(String condition){
		SwyQueryResult sqr = new SwyQueryResult();
		String[] array;
		if (condition != null) {
			array = condition.split("-");
		}else{
			array = new String[0];
		}
		List<SwyCommodity> list = null;
		try {
			list = shopService.queryCommodityByCondition(array);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		sqr.setList(list);
		return sqr;
	}

}
