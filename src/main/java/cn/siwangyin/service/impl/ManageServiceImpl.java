package cn.siwangyin.service.impl;

import cn.siwangyin.config.IocConfig;
import cn.siwangyin.domainObject.SwyArticle;
import cn.siwangyin.domainObject.SwyCommodity;
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

    @Override
    public void addNewNav() {
        SwyNavType snt = new SwyNavType();
        snt.setState('Y');
        snt.setParentId(0);
        dao.insert(snt);
    }

    @Override
    public void addNewTag() {
        SwyTag st = new SwyTag();
        st.setState('Y');
        st.setParentId(0);
        dao.insert(st);
    }

    @Override
    public SwyCommodity addCommodity(SwyCommodity sc) {
        return dao.insert(sc);
    }

    @Override
    public SwyArticle addArticle(SwyArticle sa) {
        return dao.insert(sa);
    }
}