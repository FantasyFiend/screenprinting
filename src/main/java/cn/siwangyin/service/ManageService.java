package cn.siwangyin.service;

import cn.siwangyin.domainObject.*;

import java.util.List;

/**
 * Created by zwy on 2017/4/11.
 */
public interface ManageService {
    void updateNavType(SwyNavType swt);

    List<SwyNavType> getNavTypeList();

    List<SwyTag> getTagList();

    void updateTag(SwyTag st);
}
