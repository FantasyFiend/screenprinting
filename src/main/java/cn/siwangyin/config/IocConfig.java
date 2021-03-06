package cn.siwangyin.config;

import cn.siwangyin.system.Constants;
import org.nutz.dao.impl.NutDao;
import org.nutz.ioc.Ioc;
import org.nutz.ioc.impl.NutIoc;
import org.nutz.ioc.loader.json.JsonLoader;

/**
 * Created by Administrator on 2017/4/19.
 */
public class IocConfig {
    private static Ioc ioc;
    private static NutDao nutDao;

    public static Ioc getIoc() {
        if (ioc == null) {
            ioc = new NutIoc(new JsonLoader(Constants.CONFIGPATH));
        }
        return ioc;
    }

    public static NutDao getNutDao() {
        if (nutDao == null) {
            nutDao = getIoc().get(NutDao.class, "dao");
        }
        return nutDao;
    }

}