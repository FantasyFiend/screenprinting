package cn.siwangyin.service.impl;

import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import cn.siwangyin.domainObject.SwyCommodity;
import cn.siwangyin.domainObject.SwyTag;
import cn.siwangyin.domainObject.SwyUserBasic;
import cn.siwangyin.system.SwyQueryResult;
import org.nutz.dao.Cnd;
import org.nutz.dao.Condition;
import org.nutz.dao.Dao;

import cn.siwangyin.config.IocConfig;
import cn.siwangyin.domainObject.SwyNavType;
import cn.siwangyin.service.ShopService;
import org.nutz.json.Json;

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
					list.add(sc);
				}
			}
		}
		return list;
	}

}
