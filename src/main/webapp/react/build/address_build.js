(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by zwy on 2017/4/6.
 */
var Address = React.createClass({
    displayName: "Address",

    getInitialState: function () {
        return {
            list: null
        };
    },
    componentWillMount: function () {
        $.ajax({
            type: "get",
            url: "service/shop/getAddressList",
            success: function (data) {
                if (data.map.msg === "login") {
                    setCookie("swyFrom", window.location.href);
                    window.location.href = "login.html";
                } else if (data.map.msg === "success") {
                    if (data.list != null && data.list.length > 0) {
                        _.map(data.list, function (address, i) {
                            if (address.defaultAddress) {
                                _selectedAddress = address;
                            }
                        }.bind(this));
                        this.setState({ list: data.list });
                    }
                }
            }.bind(this)
        });
    },
    selectAddress: function (event) {
        var el = event.target;
        var parent = $(el).parent().parent();
        var provinceCityDistrict = $(parent).find(".province-city-district").text();
        var addressDetail = $(parent).find(".address-detail").text();
        var contactNumber = $(parent).find(".contact-number").text();
        var contactMan = $(parent).find(".contact-man").text();
        var id = $(el).attr("data-id");
        $.ajax({
            type: "post",
            url: "service/shop/selectAddress",
            data: { id: id, provinceCityDistrict: provinceCityDistrict, addressDetail: addressDetail, contactNumber: contactNumber, contactMan: contactMan },
            success: function (data) {
                if (data.map.msg === "login") {
                    setCookie("swyFrom", window.location.href);
                    window.location.href = "login.html";
                } else if (data.map.msg === "success") {
                    if (data.map.address != null) {
                        var newList = [];
                        newList.push(data.map.address);
                        _.map(this.state.list, function (address, i) {
                            if (address.id !== data.map.address.id) {
                                address.defaultAddress = false;
                                newList.push(address);
                            }
                        }.bind(this));
                        _selectedAddress = data.map.address;
                        this.setState({ list: newList });
                    }
                }
            }.bind(this)
        });
    },
    render: function () {
        var divs = [];
        if (this.state.list != null && this.state.list.length > 0) {
            _.map(this.state.list, function (address, i) {
                divs.push(React.createElement(
                    "div",
                    { className: "col-xs-12 col-sm-6 col-md-4 address-div" },
                    React.createElement(
                        "div",
                        { className: address.defaultAddress ? "default-address" : "" },
                        React.createElement(
                            "span",
                            { className: "address-item" },
                            "\u7701\u5E02\u533A\uFF1A",
                            React.createElement(
                                "span",
                                { className: "province-city-district", contentEditable: "true" },
                                address.provinceCityDistrict
                            )
                        ),
                        React.createElement(
                            "span",
                            { className: "address-item" },
                            "\u5730\u5740\uFF1A",
                            React.createElement(
                                "span",
                                { className: "address-detail", contentEditable: "true" },
                                address.addressDetail
                            )
                        ),
                        React.createElement(
                            "span",
                            { className: "address-item" },
                            "\u8054\u7CFB\u7535\u8BDD\uFF1A",
                            React.createElement(
                                "span",
                                { className: "contact-number", contentEditable: "true" },
                                address.contactNumber
                            )
                        ),
                        React.createElement(
                            "span",
                            { className: "address-item" },
                            "\u8054\u7CFB\u4EBA\uFF1A",
                            React.createElement(
                                "span",
                                { className: "contact-man", contentEditable: "true" },
                                address.contactMan
                            )
                        ),
                        React.createElement(
                            "span",
                            { className: "address-item select-address", "data-id": address.id },
                            React.createElement(
                                "p",
                                { "data-id": address.id, onClick: this.selectAddress },
                                "\u4FDD\u5B58\u5E76\u542F\u7528"
                            )
                        )
                    )
                ));
            }.bind(this));
        }
        divs.push(React.createElement(
            "div",
            { className: "col-xs-12 col-sm-6 col-md-4 address-div" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "span",
                    { className: "address-item" },
                    "\u7701\u5E02\u533A\uFF1A",
                    React.createElement("span", { className: "province-city-district", contentEditable: "true" })
                ),
                React.createElement(
                    "span",
                    { className: "address-item" },
                    "\u5730\u5740\uFF1A",
                    React.createElement("span", { className: "address-detail", contentEditable: "true" })
                ),
                React.createElement(
                    "span",
                    { className: "address-item" },
                    "\u8054\u7CFB\u7535\u8BDD\uFF1A",
                    React.createElement("span", { className: "contact-number", contentEditable: "true" })
                ),
                React.createElement(
                    "span",
                    { className: "address-item" },
                    "\u8054\u7CFB\u4EBA\uFF1A",
                    React.createElement("span", { className: "contact-man", contentEditable: "true" })
                ),
                React.createElement(
                    "span",
                    { className: "address-item select-address", "data-id": "0" },
                    React.createElement(
                        "p",
                        { "data-id": "0", onClick: this.selectAddress },
                        "\u4FDD\u5B58\u5E76\u542F\u7528"
                    )
                )
            )
        ));
        return React.createElement(
            "div",
            { className: "address-group" },
            divs
        );
    }
});
ReactDOM.render(React.createElement(Address, null), document.getElementById("address_container"));

},{}]},{},[1]);
