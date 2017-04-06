package cn.siwangyin.module;

import javax.servlet.http.HttpSession;

import cn.siwangyin.domainObject.SwyCart;
import cn.siwangyin.domainObject.SwyCommodity;
import cn.siwangyin.domainObject.SwyTag;
import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.Fail;
import org.nutz.mvc.annotation.Ok;

import cn.siwangyin.config.IocConfig;
import cn.siwangyin.service.ShopService;

import cn.siwangyin.domainObject.SwyUserBasic;
import cn.siwangyin.system.SwyQueryResult;
import org.nutz.mvc.annotation.Param;

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
		if (sub != null) {
			swyQueryResult.getMap().put("count", shopService.getCartCount(sub.getId()));
		}else{
			swyQueryResult.getMap().put("count", 0);
		}
		swyQueryResult.setList(shopService.getNavTypeList());
		return swyQueryResult;
	}

	@At
	@Ok("json")
	public String register(HttpSession session, @Param("email") String email, @Param("nickname") String nickname, @Param("password") String password) {
		SwyQueryResult sqr = shopService.register(email, nickname, password);
		if (sqr.getMap().get("msg") != null && sqr.getMap().get("msg").equals("success")) {
			session.setAttribute("user", sqr.getMap().get("user"));
		}
		return (String) sqr.getMap().get("msg");
	}

	@At
	@Ok("json")
	public String login(HttpSession session, @Param("email") String email, @Param("nickname") String nickname, @Param("password") String password) {
		SwyQueryResult sqr = shopService.login(email, password);
		if (sqr.getMap().get("msg") != null && sqr.getMap().get("msg").equals("success")) {
			session.setAttribute("user", sqr.getMap().get("user"));
		}
		return (String) sqr.getMap().get("msg");
	}

	@At
	@Ok("json")
	public SwyQueryResult queryAllCondition(@Param("type") String type){
		SwyQueryResult sqr = new SwyQueryResult();
		List<SwyTag> list = shopService.getAllCondition(type);
		sqr.setList(list);
		return sqr;
	}

	@At
	@Ok("json")
	public SwyQueryResult queryCommodityByCondition(@Param("condition") String condition){
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

	@At
    @Ok("json")
	public SwyQueryResult addToCart(HttpSession session, @Param("commodityId") int commodityId, @Param("amount") int amount) {
        SwyQueryResult sqr = new SwyQueryResult();
        SwyUserBasic sub = (SwyUserBasic) session.getAttribute("user");
        if (sub == null) {
            sqr.getMap().put("msg","login");
        }else{
            int count = shopService.addToCart(sub.getId(), commodityId, amount);
            sqr.getMap().put("msg","success");
            sqr.getMap().put("count", count);
        }
        return sqr;
    }

    @At
    @Ok("json")
    public SwyQueryResult getCommodityById(@Param("id") int id){
	    SwyQueryResult sqr = new SwyQueryResult();
	    sqr.getMap().put("commodity",shopService.getCommodityById(id));
	    return sqr;
    }

    @At
	@Ok("json")
    public SwyQueryResult checkout(HttpSession session, @Param("commodityId") int id) {
    	SwyQueryResult sqr = new SwyQueryResult();
    	SwyUserBasic sub = (SwyUserBasic) session.getAttribute("user");
    	if (sub == null) {
			sqr.getMap().put("msg","login");
		}else{
			SwyCart sc = shopService.getCartByIds(sub.getId(), id);
			if (sc == null) {
				sqr.getMap().put("msg","noCommodities");
			}else{
				sqr.getMap().put("msg","success");
			}
		}
		return sqr;
	}
}
