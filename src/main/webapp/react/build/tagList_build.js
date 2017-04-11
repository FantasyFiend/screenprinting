(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by zwy on 2017/4/11.
 */
/**
 * Created by zwy on 2017/4/10.
 */
var TagList = React.createClass({
    displayName: "TagList",

    getInitialState: function () {
        return {
            config: {
                key: "id",
                parentKey: "parentId",
                rootRule: "0",
                floor: 2,
                attrs: [{ name: "id", text: "id", width: "50" }, { name: "name", text: "英文名", width: "100" }, { name: "text", text: "中文名", width: "150" }, { name: "parentId", text: "父级id", width: "50" }, { name: "state", text: "启用状态", width: "50" }]
            },
            list: [],
            selectedArray: []
        };
    },
    componentWillMount: function () {
        $.ajax({
            type: "get",
            url: "service/manage/queryTagList",
            success: function (data) {
                if (data.map.msg === "login") {
                    setCookie("swyFrom", window.location.href);
                    window.location.href = "login.html";
                } else if (data.map.msg === "success") {
                    this.setState({ list: data.list });
                }
            }.bind(this)
        });
    },
    save: function (event) {
        var el = event.target;
        var key = $(el).attr("data-key");
        var tds = $(el).parent().parent().find("td");
        var id = $(tds[0]).text();
        var name = $(tds[1]).text();
        var text = $(tds[2]).text();
        var parentId = $(tds[3]).text();
        var state = $(tds[4]).text();
        $.ajax({
            type: "post",
            url: "service/manage/updateTag",
            data: { id: id, name: name, text: text, parentId: parentId, state: state },
            success: function (data) {
                if (data.map.msg === "login") {
                    setCookie("swyFrom", window.location.href);
                    window.location.href = "login.html";
                } else if (data.map.msg === "success") {
                    this.setState({ list: data.list });
                }
            }.bind(this)
        });
    },
    select: function (event) {
        var el = event.target;
        var key = $(el).attr("data-key");
        var selectedArray = this.state.selectedArray;
        var newArray;
        if (_.indexOf(selectedArray, key.toString()) > -1) {
            newArray = _.without(selectedArray, key);
        } else {
            newArray = new Array();
            _.map(selectedArray, function (obj, i) {
                newArray.push(obj);
            });
            newArray.push(key);
        }
        _selectedTag = newArray;
        this.setState({ selectedArray: newArray });
    },
    render: function () {
        var list = this.state.list;
        var selectedArray = this.state.selectedArray;
        var key = this.state.config.key;
        var attrs = this.state.config.attrs;
        for (var i in list) {
            var obj = list[i];
            obj["selected"] = false;
            for (var j in selectedArray) {
                if (selectedArray[j] == obj[key]) {
                    obj["selected"] = true;
                }
            }
        }
        var treeData = listDataToTreeData(list, key, this.state.config.parentKey, this.state.config.rootRule);
        var trs = new Array();
        var tds = new Array();
        for (var i in attrs) {
            var attr = attrs[i];
            var width = attr.width;
            if (width.indexOf("%") < 0) {
                if (width.indexOf("px") > -1) {
                    width = width.substring(0, width.indexOf("px"));
                }
                if (i === 0) {
                    width = this.state.floor * 15 + parseInt(attr.width);
                } else {
                    width = parseInt(attr.width);
                }
            }
            var tdStyle = {
                "width": width + "px"
            };
            tds.push(React.createElement(
                "td",
                { style: tdStyle },
                attr.text
            ));
        }
        trs.push(React.createElement(
            "tr",
            null,
            tds
        ));
        for (var i in treeData) {
            var obj = treeData[i];
            tds = new Array();
            for (var j in attrs) {
                tds.push(React.createElement(
                    "td",
                    { contentEditable: j == 0 ? false : true, "data-key": obj[key] },
                    obj[attrs[j].name]
                ));
            }
            tds.push(React.createElement(
                "td",
                { style: { "width": "200px" } },
                React.createElement(
                    "button",
                    { "data-key": obj[key], onClick: this.select },
                    "\u9009\u62E9"
                ),
                React.createElement(
                    "button",
                    { "data-key": obj[key], onClick: this.save },
                    "\u4FDD\u5B58"
                )
            ));
            trs.push(React.createElement(
                "tr",
                { className: obj.selected ? "selected" : "parent" },
                tds
            ));
            for (var j in obj.children) {
                tds = new Array();
                var child = obj.children[j];
                for (var k in attrs) {
                    tds.push(React.createElement(
                        "td",
                        { contentEditable: k == 0 ? false : true, "data-key": child[key] },
                        child[attrs[k].name]
                    ));
                }
                tds.push(React.createElement(
                    "td",
                    { style: { "width": "200px" } },
                    React.createElement(
                        "button",
                        { "data-key": child[key], onClick: this.select },
                        "\u9009\u62E9"
                    ),
                    React.createElement(
                        "button",
                        { "data-key": child[key], onClick: this.save },
                        "\u4FDD\u5B58"
                    )
                ));
                trs.push(React.createElement(
                    "tr",
                    { className: child.selected ? "selected" : "" },
                    tds
                ));
            }
        }
        return React.createElement(
            "div",
            { className: "tree-table" },
            React.createElement(
                "table",
                null,
                trs
            )
        );
    }
});
ReactDOM.render(React.createElement(TagList, null), document.getElementById("tag_config_container"));

},{}]},{},[1]);
