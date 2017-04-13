package cn.siwangyin.service;

import java.io.UnsupportedEncodingException;
import java.util.List;

import cn.siwangyin.domainObject.*;
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

    SwyCart getCartByIds(int userId, int commodityId);

    List<SwyCart> getCartList(int userId);

    int changeCartAmount(int userId, int commodityId, int amount);

    void deleteCommodityInCart(int userId, int commodityId);

    List<SwyAddress> getAddressList(int userId);

    SwyAddress saveNewAddress(SwyAddress sa);

    void updateAddress(SwyAddress sa);

    SwyOrder submitOrder(SwyOrder swyOrder);

    List<SwyOrder> getOrderList(int userId, char type);

    void deleteOrder(int id);
}
