package cn.siwangyin.service.impl;

import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

import cn.siwangyin.domainObject.*;
import cn.siwangyin.system.Constants;
import cn.siwangyin.system.SwyQueryResult;
import org.nutz.dao.*;

import cn.siwangyin.config.IocConfig;
import cn.siwangyin.service.ShopService;
import org.nutz.dao.sql.Sql;
import org.nutz.dao.sql.SqlCallback;
import org.nutz.json.Json;
import org.nutz.lang.Lang;

public class ShopServiceImpl implements ShopService {
	
	private Dao dao = IocConfig.getNutDao();

	@Override
	public List<SwyNavType> getNavTypeList() {
		Condition cnd = Cnd.where("state", "=", 'Y').asc("id");
		List<SwyNavType> list = dao.query(SwyNavType.class, cnd);
		return list;
	}

	@Override
	public SwyQueryResult register(String email, String nickname, String password) {
		SwyQueryResult sqr = new SwyQueryResult();
		SwyUserBasic sub = dao.fetch(SwyUserBasic.class, Cnd.where("email","=",email));
		if (sub != null) {
			sqr.getMap().put("msg", "该用户已存在!");
		}else{
            sub = new SwyUserBasic();
			sub.setEmail(email);
			sub.setNickname(nickname);
			sub.setPassword(password);
			sub.setHeadImgPath(Constants.DEFAULT_HEAD_IMG_PATH);
			sub.setRegisterTime(new Date());
			sub.setState('Y');
			SwyUserBasic newOne = dao.insert(sub);
			if (newOne.getId() > 0) {
				sqr.getMap().put("msg", "success");
				sqr.getMap().put("user", newOne);
			}else{
				sqr.getMap().put("msg", "出现错误，请重试!");
			}
		}
		return sqr;
	}

    @Override
    public SwyQueryResult login(String email, String password) {
        SwyQueryResult sqr = new SwyQueryResult();
        SwyUserBasic sub = dao.fetch(SwyUserBasic.class, Cnd.where("email", "=", email).and("password", "=", password));
        if (sub == null) {
            sqr.getMap().put("msg","用户名或密码错误!");
        }else{
            sqr.getMap().put("msg", "success");
            sqr.getMap().put("user", sub);
        }
        return sqr;
    }

	@Override
	public List<SwyTag> getAllCondition(String type) {
		SwyNavType swt = dao.fetch(SwyNavType.class, Cnd.where("name","=", type).and("state", "=", 'Y'));
		String tagIds = swt.getTagIds();
		Integer[] tagIdArray = Json.fromJsonAsArray(Integer.class, tagIds);
		List<SwyTag> list = dao.query(SwyTag.class, Cnd.where("id","in",tagIdArray).or("parentId","in",tagIdArray).asc("parentId"));
		return list;
	}

	@Override
	public List<SwyCommodity> queryCommodityByCondition(String[] array) throws UnsupportedEncodingException {
		List<SwyCommodity> commodityList = dao.query(SwyCommodity.class, Cnd.where("state", "=", 'Y'));
		List<SwyCommodity> list = new ArrayList<>();
		if (commodityList != null) {
			for (int i = 0; i < commodityList.size(); i++) {
				SwyCommodity sc = commodityList.get(i);
				String[] commodityTagNameArray = sc.getTagNames().split("-");
				if (Arrays.asList(commodityTagNameArray).containsAll(Arrays.asList(array))) {
				    sc.setDetailHtml("");
					list.add(sc);
				}
			}
		}
		return list;
	}

	@Override
	public int getCartCount(int userId) {
		Condition cnd = Cnd.where("state","=",'Y').and("userId","=",userId);
        List<SwyCart> list = dao.query(SwyCart.class, cnd);
        int count = 0;
        for (int i = 0; i < list.size(); i++) {
            SwyCart sc = list.get(i);
            count += sc.getAmount();
        }
		return count;
	}

    @Override
    public int addToCart(int userId, int commodityId, int amount) {
        Condition cnd = Cnd.where("userId", "=", userId).and("commodityId", "=", commodityId).and("state","=",'Y');
        SwyCart sc = dao.fetch(SwyCart.class, cnd);
        if (sc != null) {
            sc.setAmount(sc.getAmount() + amount);
            dao.update(sc);
        }else{
            sc = new SwyCart();
            sc.setDate(new Date());
            sc.setState('Y');
            sc.setUserId(userId);
            sc.setCommodityId(commodityId);
            sc.setAmount(amount);
            dao.insert(sc);
        }
        int count = getCartCount(userId);
        return count;
    }

    @Override
    public SwyCommodity getCommodityById(int id) {
        return dao.fetch(SwyCommodity.class, id);
    }

	@Override
	public SwyCart getCartByIds(int userId, int commodityId) {
		return dao.fetchx(SwyCart.class, userId, commodityId);
	}

	@Override
	public List<SwyCart> getCartList(int userId) {
		Condition cnd = Cnd.where("userId","=",userId);
		List<SwyCart> list = dao.query(SwyCart.class, cnd);
		if (list == null || list.size() == 0) {
			return null;
		}
		int[] commodityIdArray = new int[list.size()];
		for (int i = 0; i < list.size(); i++) {
		    commodityIdArray[i] = list.get(i).getCommodityId();
        }
        cnd = Cnd.where("id","in",commodityIdArray);
		List<SwyCommodity> commodityList = dao.query(SwyCommodity.class, cnd);
		Map<Integer, SwyCommodity> map = (Map<Integer, SwyCommodity>) Lang.collection2map(HashMap.class, commodityList, "id");
        for (int i = 0; i < list.size(); i++) {
            SwyCart sc = list.get(i);
            SwyCommodity commodity = map.get(sc.getCommodityId());
            if (commodity != null) {
                String[] array = commodity.getImgPath().split("\\|");
                sc.setImgPath(array[0]);
                sc.setName(commodity.getName());
                sc.setPrice(commodity.getPrice());
            }
        }
        return list;
	}

    @Override
    public int changeCartAmount(int userId, int commodityId, int amount) {
	    SwyCart sc = dao.fetchx(SwyCart.class, userId, commodityId);
	    if (sc != null) {
	        sc.setAmount(amount);
	        dao.update(sc);
        }
        return amount;
    }

    @Override
    public void deleteCommodityInCart(int userId, int commodityId) {
        dao.deletex(SwyCart.class, userId, commodityId);
    }

	@Override
	public List<SwyAddress> getAddressList(int userId) {
		return dao.query(SwyAddress.class, Cnd.where("userId", "=", userId));
	}

	@Override
	public SwyAddress saveNewAddress(SwyAddress sa) {
		int userId = sa.getUserId();
		Chain chain = Chain.make("defaultAddress",false);
		dao.update(SwyAddress.class, chain, Cnd.where("userId","=",userId));
		return dao.insert(sa);
	}

    @Override
    public void updateAddress(SwyAddress sa) {
        Chain chain = Chain.make("defaultAddress",false);
        dao.update(SwyAddress.class, chain, Cnd.where("userId","=",sa.getUserId()));
        dao.update(sa);
    }

    @Override
    public SwyOrder submitOrder(SwyOrder swyOrder) {
	    SwyOrder so = dao.insert(swyOrder);
	    dao.clear(SwyCart.class, Cnd.where("userId", "=", swyOrder.getUserId()));
        return so;
    }

	@Override
	public List<SwyOrder> getOrderList(int userId, char type) {
		Condition cnd;
		if (type == 'A') {
			cnd = Cnd.where("showOrHide","=",'S').and("userId","=",userId);
		}else{
			cnd = Cnd.where("showOrHide","=",'S').and("userId","=",userId).and("state","=",type);
		}
		return dao.query(SwyOrder.class, cnd);
	}

    @Override
    public void deleteOrder(int id) {
        Condition cnd = Cnd.where("id", "=", id);
        Chain chain = Chain.make("showOrHide", 'H');
        dao.update(SwyOrder.class, chain, cnd);
    }

	@Override
	public SwyArticle getArticle(int id) {
		return dao.fetch(SwyArticle.class, id);
	}

	@Override
	public List<SwyComment> getCommentsByArticleId(int articleId) {
		Condition cnd = Cnd.where("articleId", "=", articleId).and("state", "=", 'Y').asc("floor").asc("time");
		List<SwyComment> list = dao.query(SwyComment.class, cnd);
		List<SwyComment> returnList = new ArrayList<>();
		//把所有顶级楼层加入list
		for (int i = 0; i < list.size(); i++) {
		    SwyComment comment = list.get(i);
		    if (comment.isFloorComment()) {
		        comment.setChildren(new ArrayList<>());
		        returnList.add(comment);
            }
        }
        //为每个顶级楼层添加子评论
        for (int i = 0; i < returnList.size(); i++) {
		    SwyComment comment = returnList.get(i);
		    int floor = comment.getFloor();
		    List<SwyComment> children = comment.getChildren();
		    for (int j = 0; j < list.size(); j++) {
		        if (list.get(j).getFloor() == floor && list.get(j).getId() != comment.getId()) {
		            children.add(list.get(j));
                }
                if (list.get(j).getFloor() > floor) {
		            break;
                }
            }
        }
		return returnList;
	}

	@Override
	public List<SwyComment> addMainComment(int articleId, String content, String commentBy) {
        Sql sql = Sqls.create("select max(floor) from swy_comment where article_id = " + articleId);
        sql.setCallback((conn, rs, sql1) -> {
            int floor = 0;
            while (rs.next())
                floor = rs.getInt("max(floor)");
            return floor;
        });
        dao.execute(sql);
        int floor = sql.getInt();
		SwyComment comment = new SwyComment();
		comment.setArticleId(articleId);
		comment.setContent(content);
		comment.setCommentBy(commentBy);
		comment.setFloorComment(true);
		comment.setTime(new Date());
		comment.setFloor(++floor);
		comment.setState('Y');
		dao.insert(comment);
		return getCommentsByArticleId(articleId);
	}

	@Override
	public List<SwyNewsType> getNewsTypeList() {
		Condition cnd = Cnd.where("state", "=", 'Y').asc("id");
		List<SwyNewsType> list = dao.query(SwyNewsType.class, cnd);
		return list;
	}

	@Override
	public SwyArticleSeries getSeries(int seriesId) {
		return dao.fetch(SwyArticleSeries.class, seriesId);
	}

	@Override
	public List<SwyArticle> getArticleBySeriesId(int seriesId) {
		Condition cnd = Cnd.where("state", "=", 'Y').and("seriesId","=",seriesId).asc("id");
		List<SwyArticle> list = dao.query(SwyArticle.class, cnd);
		for (int i = 0; i < list.size(); i++) {
			SwyArticle article = list.get(i);
			article.setContent("");
		}
		return list;
	}

}
