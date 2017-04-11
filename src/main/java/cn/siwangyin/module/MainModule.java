package cn.siwangyin.module;

import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.Modules;

@At("service")
@Modules({ShopModule.class, ManageModule.class})
public class MainModule {

}