package cn.siwangyin.module;

import cn.siwangyin.config.IocConfig;
import cn.siwangyin.domainObject.*;
import cn.siwangyin.service.ManageService;
import cn.siwangyin.system.*;
import org.nutz.http.Http;
import org.nutz.mvc.annotation.*;

import javax.servlet.http.HttpSession;

/**
 * Created by zwy on 2017/4/11.
 */
@At("/manage")
@Fail("http:500")
public class ManageModule {

    private ManageService manageService = IocConfig.getIoc().get(ManageService.class);

    public boolean checkLogin(HttpSession session){
        SwyUserBasic sub = (SwyUserBasic) session.getAttribute("user");
        if (sub != null) {
            String email = sub.getEmail();
            for (int i = 0; i < Constants.ADMINACCOUNT.length; i++) {
                String account = Constants.ADMINACCOUNT[i];
                if(account != null && account.equals(email)) {
                    return true;
                }
            }
        }
        return false;
    }

    @At
    @Ok("json")
    public SwyQueryResult queryNavList(HttpSession session) {
        SwyQueryResult sqr = new SwyQueryResult();
        if (checkLogin(session)) {
            sqr.setList(manageService.getNavTypeList());
            sqr.getMap().put("msg","success");
        }else{
            sqr.getMap().put("msg","login");
        }
        return sqr;
    }

    @At
    @Ok("json")
    public SwyQueryResult updateNavType(HttpSession session, @Param("id") int id, @Param("name") String name, @Param("text") String text, @Param("href") String href, @Param("tagIds") String tagIds, @Param("parentId") int parentId, @Param("state") char state) {
        SwyQueryResult sqr = new SwyQueryResult();
        if (checkLogin(session)) {
            SwyNavType swt = new SwyNavType();
            swt.setId(id);
            swt.setName(name);
            swt.setText(text);
            swt.setHref(href);
            swt.setTagIds(tagIds);
            swt.setParentId(parentId);
            swt.setState(state);
            manageService.updateNavType(swt);
            sqr.setList(manageService.getNavTypeList());
            sqr.getMap().put("msg","success");
        }else{
            sqr.getMap().put("msg","login");
        }
        return sqr;
    }

    @At
    @Ok("json")
    public SwyQueryResult queryTagList(HttpSession session) {
        SwyQueryResult sqr = new SwyQueryResult();
        if (checkLogin(session)) {
            sqr.setList(manageService.getTagList());
            sqr.getMap().put("msg","success");
        }else{
            sqr.getMap().put("msg","login");
        }
        return sqr;
    }

    @At
    @Ok("json")
    public SwyQueryResult updateTag(HttpSession session, @Param("id") int id, @Param("name") String name, @Param("text") String text, @Param("parentId") int parentId, @Param("state") char state) {
        SwyQueryResult sqr = new SwyQueryResult();
        if (checkLogin(session)) {
            SwyTag st = new SwyTag();
            st.setId(id);
            st.setName(name);
            st.setText(text);
            st.setParentId(parentId);
            st.setState(state);
            manageService.updateTag(st);
            sqr.setList(manageService.getTagList());
            sqr.getMap().put("msg","success");
        }else{
            sqr.getMap().put("msg","login");
        }
        return sqr;
    }

    @At
    @Ok("json")
    public SwyQueryResult addNewNav(HttpSession session) {
        SwyQueryResult sqr = new SwyQueryResult();
        if (checkLogin(session)) {
            manageService.addNewNav();
            sqr.setList(manageService.getNavTypeList());
            sqr.getMap().put("msg","success");
        }else{
            sqr.getMap().put("msg","login");
        }
        return sqr;
    }

    @At
    @Ok("json")
    public SwyQueryResult addNewTag(HttpSession session) {
        SwyQueryResult sqr = new SwyQueryResult();
        if (checkLogin(session)) {
            manageService.addNewTag();
            sqr.setList(manageService.getTagList());
            sqr.getMap().put("msg","success");
        }else{
            sqr.getMap().put("msg","login");
        }
        return sqr;
    }
}
