/**
 * Created by zwy on 2017/3/15.
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
function getCookie(c_name){
    if (document.cookie.length>0){
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1){
            c_start=c_start + c_name.length+1;
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return ""
}
function setCookie(c_name, value, expiredays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie=c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}
function delCookie(name){
    var date = new Date();
    date.setTime(date.getTime() - 10000);
    document.cookie = name + "=a; expires=" + date.toGMTString();
}
function arrayToString(array){
    if (array == undefined || array.length == 0) {
        return "";
    }
    if (array.legnth == 1) {
        return array[0];
    }
    var str = "";
    for (var i = 0; i < array.length; i++) {
        if (i < array.length - 1) {
            str += array[i] + "|";
        }else {
            str += array[i];
        }
    }
    return str;
}
function isEmail(str){
    var result=str.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
    if(result==null) return false;
    return true;
}
function utf16to8(str) {
    var out, i, len, c;

    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        }
    }
    return out;
}
var stringSpace = "0123456789abcdefghijklmnopqrstuvwxyz";
function randomString(length) {
    var str = "";
    for (var i = 0; i < length; i++) {
        str += stringSpace.charAt(_.random(0, stringSpace.length - 1));
    }
    return str;
}
function getTelephone(str){
    return str.split(" ")[1];
}
function test(){
    randomString(10);
}
function checkRegisterForm(email, nickname, password1, password2){
    if (email == null || email == "" || !isEmail(email)) {
        alert("请输入正确的邮箱地址");
        return false;
    }
    if (nickname == null || nickname == "" || nickname.length > 40) {
        alert("请输入40个字符以内的昵称");
        return false;
    }
    if (password1 == null || password1.length > 20 || password1.length < 6) {
        alert("请输入6-20位密码");
        return false;
    }
    if (password1 !== password2) {
        alert("两次密码不一致");
        return false;
    }
    return true;
}
function formatTags(tags) {
    var map = new Object();
    if (typeof (tags) === "object" && tags.length > 0) {
        for (var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            if (tag.parentId === 0) {
                map[tag.id]= tag;
                map[tag.id].children = new Array();
            }
        }
        for (var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            if (tag.parent !== 0) {
                var parent = map[tag.parentId];
                if (parent != null) {
                    parent["children"].push(tag);
                }
            }
        }
    }
    return map;
}