package cn.siwangyin.service.impl;

import cn.siwangyin.config.IocConfig;
import cn.siwangyin.domainObject.SwyNavType;
import cn.siwangyin.domainObject.SwyTag;
import cn.siwangyin.service.ManageService;
import org.nutz.dao.*;

import java.util.List;

/**
 * Created by Administrator on 2017/4/11.
 */
public class ManageServiceImpl implements ManageService{

    private Dao dao = IocConfig.getNutDao();

    @Override
    public void updateNavType(SwyNavType swt) {
        dao.update(swt);
    }

    @Override
    public List<SwyNavType> getNavTypeList() {
        Condition cnd = Cnd.where("1", "=", '1').asc("id");
        List<SwyNavType> list = dao.query(SwyNavType.class, cnd);
        return list;
    }

    @Override
    public List<SwyTag> getTagList() {
        Condition cnd = Cnd.where("1", "=", '1').asc("id");
        List<SwyTag> list = dao.query(SwyTag.class, cnd);
        return list;
    }

    @Override
    public void updateTag(SwyTag st) {
        dao.update(st);
    }
}