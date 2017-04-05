package cn.siwangyin.service;

import java.io.UnsupportedEncodingException;
import java.util.List;

import cn.siwangyin.domainObject.SwyCommodity;
import cn.siwangyin.domainObject.SwyNavType;
import cn.siwangyin.domainObject.SwyTag;
import cn.siwangyin.system.SwyQueryResult;
import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.Ok;

public interface ShopService {

	List<SwyNavType> getNavTypeList();

    SwyQueryResult register(String email, String nickname, String password);

    SwyQueryResult login(String email, String password);

    List<SwyTag> getAllCondition(String type);

    List<SwyCommodity> queryCommodityByCondition(String[] array) throws UnsupportedEncodingException;

    int getCartCount(int userId);

    int addToCart(int userId, int commodityId, int amount);

    SwyCommodity getCommodityById(int id);
}
