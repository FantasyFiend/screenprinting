package cn.siwangyin.module;

import cn.siwangyin.config.IocConfig;
import cn.siwangyin.domainObject.*;
import cn.siwangyin.service.ManageService;
import cn.siwangyin.system.*;
import org.nutz.lang.Files;
import org.nutz.mvc.Mvcs;
import org.nutz.mvc.annotation.*;
import org.nutz.mvc.upload.TempFile;
import org.nutz.mvc.upload.UploadAdaptor;

import javax.imageio.event.IIOWriteProgressListener;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.util.Date;

/**
 * Created by zwy on 2017/4/11.
 */
@At("/manage")
@Fail("http:500")
public class ManageModule {

    private ManageService manageService = IocConfig.getIoc().get(ManageService.class);

    private static String currentImgPath = "";

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



    @At
    @Ok("json")
    @AdaptBy(type = UploadAdaptor.class, args = { "${app.root}/WEB-INF/tmp" })
    public SwyQueryResult uploadImage(HttpSession session, @Param("file-zh[]") TempFile tempFile){
        SwyQueryResult sqr = new SwyQueryResult();
        if (checkLogin(session)) {
            String path = Mvcs.getNutConfig().getAppRoot();
            String time = SwyUtil.getOrderTime(new Date());
            String fileName = time + "_" + tempFile.getMeta().getFileLocalName();
            if (currentImgPath == null || currentImgPath.equals("")) {
                currentImgPath = "upload/" + fileName;
            }else{
                currentImgPath += "|upload/" + fileName;
            }
            System.out.println(currentImgPath);
            try{
                SwyUtil.writeJPEG(new File(path + "/upload/" + fileName), tempFile.getFile(), 40);
            }catch (Exception e) {
                e.printStackTrace();
            }
        }else{
            sqr.getMap().put("msg","login");
        }
        return sqr;
    }

    @At
    @Ok("json")
    public SwyQueryResult addCommodity(HttpSession session, @Param("commodityNumber") String commodityNumber, @Param("name") String name, @Param("price") float price, @Param("description") String description, @Param("stock") int stock, @Param("tagNames") String tagNames, @Param("html") String html) {
        SwyQueryResult sqr = new SwyQueryResult();
        if (!checkLogin(session)) {
            sqr.getMap().put("msg","login");
        }else if (currentImgPath == null || currentImgPath.equals("")) {
            sqr.getMap().put("msg","请先上传图片!");
        }else{
            SwyCommodity sc = new SwyCommodity();
            sc.setCommodityNumber(commodityNumber);
            sc.setName(name);
            sc.setPrice(price);
            sc.setDescription(description);
            sc.setStock(stock);
            sc.setTagNames(tagNames);
            sc.setImgPath(currentImgPath);
            sc.setDetailHtml(html);
            sc.setOrderSale(0);
            sc.setState('Y');
            sc = manageService.addCommodity(sc);
            if (sc.getId() > 0) {
                currentImgPath = "";
            }
            sqr.getMap().put("msg","success");
            sqr.getMap().put("commodity",sc);
        }
        return sqr;
    }
}
