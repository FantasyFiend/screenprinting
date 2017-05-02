package cn.siwangyin.module;

import javax.servlet.http.HttpSession;

import cn.siwangyin.domainObject.*;
import cn.siwangyin.config.IocConfig;
import cn.siwangyin.service.ShopService;
import cn.siwangyin.system.*;

import org.nutz.json.Json;
import org.nutz.mvc.annotation.*;


import java.io.UnsupportedEncodingException;
import java.util.*;

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
	public SwyQueryResult checkLogin(HttpSession session) {
        SwyQueryResult swyQueryResult = new SwyQueryResult();
        SwyUserBasic sub = (SwyUserBasic) session.getAttribute("user");
        if (sub == null) {
            swyQueryResult.getMap().put("msg","login");
        }else{
            swyQueryResult.getMap().put("msg","success");
            swyQueryResult.getMap().put("user",sub);
        }
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

	@At
    @Ok("json")
	public SwyQueryResult getCartList(HttpSession session){
        SwyQueryResult sqr = new SwyQueryResult();
        SwyUserBasic sub = (SwyUserBasic) session.getAttribute("user");
        if (sub == null) {
            sqr.getMap().put("msg","login");
        }else{
            List<SwyCart> list = shopService.getCartList(sub.getId());
            sqr.setList(list);
            sqr.getMap().put("msg","success");
        }
        return sqr;
    }

    @At
    @Ok("json")
    public SwyQueryResult changeCartAmount(HttpSession session, @Param("amount") int amount, @Param("commodityId") int commodityId){
        SwyQueryResult sqr = new SwyQueryResult();
        SwyUserBasic sub = (SwyUserBasic) session.getAttribute("user");
        if (sub == null) {
            sqr.getMap().put("msg","login");
        }else{
            sqr.getMap().put("msg","success");
            sqr.getMap().put("amount",shopService.changeCartAmount(sub.getId(), commodityId, amount));
        }
        return sqr;
    }

    @At
    @Ok("json")
    public SwyQueryResult deleteCommodityInCart(HttpSession session, @Param("commodityId") int commodityId){
        SwyQueryResult sqr = new SwyQueryResult();
        SwyUserBasic sub = (SwyUserBasic) session.getAttribute("user");
        if (sub == null) {
            sqr.getMap().put("msg","login");
        }else{
            shopService.deleteCommodityInCart(sub.getId(), commodityId);
            sqr.getMap().put("msg","success");
        }
        return sqr;
    }

    @At
	@Ok("json")
    public  SwyQueryResult getAddressList(HttpSession session){
		SwyQueryResult sqr = new SwyQueryResult();
		SwyUserBasic sub = (SwyUserBasic) session.getAttribute("user");
		if (sub == null) {
			sqr.getMap().put("msg","login");
		}else{
			List<SwyAddress> list = shopService.getAddressList(sub.getId());
			sqr.getMap().put("msg","success");
			sqr.setList(list);
		}
		return sqr;
	}

	@At
	@Ok("json")
	public SwyQueryResult selectAddress(HttpSession session, @Param("id") int id, @Param("provinceCityDistrict") String provinceCityDistrict, @Param("addressDetail") String addressDetail, @Param("contactNumber") String contactNumber, @Param("contactMan") String contactMan) {
        SwyQueryResult sqr = new SwyQueryResult();
        SwyUserBasic sub = (SwyUserBasic) session.getAttribute("user");
        if (sub == null) {
            sqr.getMap().put("msg","login");
        }else {
            SwyAddress sa = new SwyAddress();
            sa.setUserId(sub.getId());
            sa.setProvinceCityDistrict(provinceCityDistrict);
            sa.setAddressDetail(addressDetail);
            sa.setContactNumber(contactNumber);
            sa.setContactMan(contactMan);
            sa.setDefaultAddress(true);
            sa.setState('Y');
            if (id == 0){
                sa = shopService.saveNewAddress(sa);
            }else{
                sa.setId(id);
                shopService.updateAddress(sa);
            }
            if (sa.getId() > 0) {
                sqr.getMap().put("msg", "success");
                sqr.getMap().put("address",sa);
            }
        }
        return sqr;
	}

	@At
    @Ok("json")
	public SwyQueryResult submitOrder(HttpSession session, @Param("addressText") String addressText, @Param("totalPrice") float totalPrice, @Param("remark") String remark, @Param("orderList") String orderList) {
        SwyQueryResult sqr = new SwyQueryResult();
        SwyUserBasic sub = (SwyUserBasic) session.getAttribute("user");
        if (sub == null) {
            sqr.getMap().put("msg","login");
        }else{
            SwyOrder swyOrder = new SwyOrder();
            Date date = new Date();
            String orderNumber = SwyUtil.getOrderTime(date) + String.valueOf(sub.getId()) + SwyUtil.generateEmailCheckcode();
            List<SwyCart> list = Json.fromJsonAsList(SwyCart.class, orderList);
            if (list == null || list.size() > 10) {
                sqr.getMap().put("msg","请选择10种以内的商品！");
                return sqr;
            }
            for (int i = 0; i < list.size(); i++) {
                SwyCart sc = list.get(i);
                if (swyOrder.getOrderTitle() != null && swyOrder.getOrderTitle().length() > 50) {
                    swyOrder.setOrderTitle(swyOrder.getOrderTitle() + "......");
                    break;
                }
                if (i == 0) {
                    swyOrder.setOrderTitle(sc.getName() + " x " + sc.getAmount());
                }else{
                    swyOrder.setOrderTitle(sc.getName() + " x " + sc.getAmount());
                }
            }
            swyOrder.setOrderItem(orderList);
            swyOrder.setAddressText(addressText);
            swyOrder.setCreateTime(date);
            swyOrder.setOrderNumber(orderNumber);
            swyOrder.setRemark(remark);
            swyOrder.setState('P');
            swyOrder.setTotalPrice(totalPrice);
            swyOrder.setUserId(sub.getId());
            swyOrder.setShowOrHide('S');
            swyOrder = shopService.submitOrder(swyOrder);
            if (swyOrder.getId() > 0) {
                sqr.getMap().put("msg","success");
                sqr.getMap().put("order",swyOrder);
            }
        }
        return sqr;
    }

    @At
    @Ok("json")
    public SwyQueryResult getOrderList(HttpSession session, @Param("type") char type) {
        SwyQueryResult sqr = new SwyQueryResult();
        SwyUserBasic sub = (SwyUserBasic) session.getAttribute("user");
        if (sub == null) {
            sqr.getMap().put("msg","login");
        }else {
            sqr.getMap().put("msg","success");
            sqr.setList(shopService.getOrderList(sub.getId(), type));
        }
        return sqr;
    }

    @At
    @Ok("json")
    public SwyQueryResult deleteOrder(HttpSession session, @Param("id") int id, @Param("type") char type) {
        SwyQueryResult sqr = new SwyQueryResult();
        SwyUserBasic sub = (SwyUserBasic) session.getAttribute("user");
        if (sub == null) {
            sqr.getMap().put("msg","login");
        }else {
            sqr.getMap().put("msg","success");
            shopService.deleteOrder(id);
            sqr.setList(shopService.getOrderList(sub.getId(), type));
        }
        return sqr;
    }
}
