(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var screenHeight = window.screen.height;
var _selectedAddress = null;
var CartCommodityList = React.createClass({
	displayName: "CartCommodityList",

	getInitialState: function () {
		return {
			cartList: _cartList
		};
	},
	componentDidMount: function () {
		var amounts = $(".item_amount").find("input");
		_.map(this.state.cartList, function (cart, i) {
			var key = "amount" + cart.commodityInfoId;
			var el = this.refs[key];
			$(el).val(cart.amount);
		}.bind(this));
	},
	handleAmountChange: function (event) {
		var el = event.target;
		var newAmount = $(el).val();
		var commodityInfoId = $(el).attr("data-id");
		$.ajax({
			type: "POST",
			url: "/letspogo/shop/changeCartAmount",
			data: { "amount": newAmount, "commodityInfoId": commodityInfoId },
			success: function (msg) {
				var obj = msg;
				if (obj == "login") {
					$("#login_container").css({ "bottom": "0" });
					return false;
				}
				if (obj == "success") {
					var newList = [];
					_.map(this.state.cartList, function (cart, i) {
						if (cart.commodityInfoId == commodityInfoId) {
							cart.amount = newAmount;
						}
						newList.push(cart);
					});
					_cartList = newList;
					this.setState({ cartList: newList });
				}
			}.bind(this)
		});
	},
	handleRemoveCart: function (event) {
		var el = event.target;
		var commodityInfoId = $(el).attr("data-id");
		$.ajax({
			type: "POST",
			url: "/letspogo/shop/deleteCommodityInCart",
			data: { "commodityInfoId": commodityInfoId },
			success: function (msg) {
				var obj = msg;
				if (obj == "login") {
					$("#login_container").css({ "bottom": "0" });
					return false;
				}
				if (obj == "success") {
					var newList = [];
					_.map(this.state.cartList, function (cart, i) {
						if (cart.commodityInfoId != commodityInfoId) {
							newList.push(cart);
						}
					});
					_cartList = newList;
					this.setState({ cartList: newList });
				}
			}.bind(this)
		});
	},
	handleToCommodity: function (event) {
		var el = event.target;
		var id = $(el).attr("data-id");
		window.open("/letspogo/commodity?id=" + id);
	},
	render: function () {
		if (this.state.cartList.length == 0) {
			return React.createElement(
				"div",
				{ className: "empty_cart" },
				React.createElement(
					"span",
					null,
					"尚未选购商品!"
				)
			);
		} else {
			var commodities = [];
			var total = 0;
			var express = 0;
			var promotion = null;
			_.map(this.state.cartList, function (cart, i) {
				commodities.push(React.createElement(
					"div",
					{ className: "cart_item", key: i },
					React.createElement(
						"span",
						{ className: "item_img", onClick: this.handleToCommodity, "data-id": cart.commodityId },
						React.createElement("img", { src: cart.imgPath, "data-id": cart.commodityId })
					),
					React.createElement(
						"span",
						{ className: "item_info" },
						React.createElement(
							"span",
							{ className: "item_description", onClick: this.handleToCommodity, "data-id": cart.commodityId },
							cart.description
						),
						React.createElement(
							"span",
							{ className: "item_style" },
							"颜色：" + cart.styleName
						),
						React.createElement(
							"span",
							{ className: "item_size" },
							"尺寸：" + cart.sizeName
						)
					),
					React.createElement(
						"span",
						{ className: "item_price" },
						"￥" + cart.price
					),
					React.createElement(
						"span",
						{ className: "item_amount" },
						React.createElement("input", { "data-id": cart.commodityInfoId, onChange: this.handleAmountChange, ref: "amount" + cart.commodityInfoId, type: "number", min: "1", max: "99999" })
					),
					React.createElement(
						"span",
						{ className: "item_total" },
						"￥" + cart.price * cart.amount
					),
					React.createElement(
						"span",
						{ className: "item_delete", "data-id": cart.commodityInfoId, onClick: this.handleRemoveCart },
						React.createElement(
							"i",
							{ "data-id": cart.commodityInfoId, className: "icon iconfont" },
							""
						)
					)
				));
				total += cart.price * cart.amount;
			}.bind(this));
			if (_selectedAddress == null) {
				express = 0;
			} else {
				express = getExpressPrice(_selectedAddress.provinceCoide, _cartList);
			}
			_.map(_promotionList, function (pro, i) {
				if (pro.condition <= total) {
					if (promotion == null) {
						promotion = pro;
					} else if (pro.discount > promotion.discount) {
						promotion = pro;
					}
				}
			});
			if (promotion == null) {
				promotion = new Object();
				promotion.name = "无优惠";
				promotion.discount = 0;
			}
			var final_total = total - promotion.discount + express;
			return React.createElement(
				"div",
				{ className: "cart_div" },
				React.createElement(
					"div",
					{ className: "cart_title" },
					React.createElement(
						"span",
						null,
						"购物列表"
					)
				),
				React.createElement(
					"div",
					{ className: "cart_item_name" },
					React.createElement(
						"span",
						{ className: "name_commodity_info" },
						"商品信息"
					),
					React.createElement(
						"span",
						{ className: "name_price" },
						"单价"
					),
					React.createElement(
						"span",
						{ className: "name_amount" },
						"数量"
					),
					React.createElement(
						"span",
						{ className: "name_total" },
						"小计"
					)
				),
				commodities,
				React.createElement(
					"div",
					{ className: "order_total" },
					React.createElement(
						"span",
						null,
						"合计：￥" + total
					)
				),
				React.createElement(
					"div",
					{ className: "order_total" },
					React.createElement(
						"span",
						{ className: "express_fee" },
						"邮费：￥" + express
					)
				),
				React.createElement(
					"div",
					{ className: "final_total" },
					React.createElement(
						"span",
						{ className: "final_total_span" },
						"实付：￥" + final_total
					),
					React.createElement(
						"span",
						{ className: "promotion" },
						"优惠活动：" + promotion.name
					)
				)
			);
		}
	}
});
var AddressList = React.createClass({
	displayName: "AddressList",

	getInitialState: function () {
		return {
			addressList: _addressList,
			selectedAddress: null
		};
	},
	componentWillMount: function () {
		_.map(this.state.addressList, function (address, i) {
			if (address.defaultAddress == true) {
				_selectedAddress = address;
				var totalPrice = 0;
				_.map(_cartList, function (cart, i) {
					totalPrice += cart.price * cart.amount;
				});
				var discount = 0;
				_.map(_promotionList, function (pro, i) {
					if (pro.condition <= totalPrice && discount < pro.discount) {
						discount = pro.discount;
					}
				});
				var express = getExpressPrice(_selectedAddress.provinceCode, _cartList);
				totalPrice = totalPrice - discount + express;
				$(".express_fee").text("邮费：￥" + express);
				$(".final_total_span").text("实付：￥" + totalPrice);
				this.setState({ selectedAddress: address });
			}
		}.bind(this));
	},
	handleUpdateAddress: function (event) {
		event.stopPropagation();
		var el = event.target;
		var id = $(el).attr("data-id");
		var selectedAddress = null;
		_.map(this.state.addressList, function (address, i) {
			if (address.defaultAddress == true) {
				address.defaultAddress = false;
			}
			if (address.id == id) {
				address.defaultAddress = true;
				selectedAddress = address;
			}
		}.bind(this));
		_selectedAddress = selectedAddress;
		var totalPrice = 0;
		_.map(_cartList, function (cart, i) {
			totalPrice += cart.price * cart.amount;
		});
		var discount = 0;
		_.map(_promotionList, function (pro, i) {
			if (pro.condition <= totalPrice && discount < pro.discount) {
				discount = pro.discount;
			}
		});
		var express = getExpressPrice(_selectedAddress.provinceCode, _cartList);
		totalPrice = totalPrice - discount + express;
		$(".express_fee").text("邮费：￥" + express);
		$(".final_total_span").text("实付：￥" + totalPrice);
		alert("邮费可能已经发生变化，请您确认后再提交订单！");
		this.setState({ addressList: this.state.addressList, selectedAddress: selectedAddress });
		var node = this.refs.addressForm.refs.mask;
		$(node).css("bottom", 0);
	},
	handleShowAddressForm: function () {
		var node = this.refs.addressForm.refs.mask;
		$(node).css("bottom", 0);
		this.setState({ selectedAddress: null });
	},
	handleChangeDefaultAddress: function (event) {
		event.stopPropagation();
		var el = event.target;
		var id = $(el).attr("data-id");
		for (var i = 0; i < this.state.addressList.length; i++) {
			var address = this.state.addressList[i];
			if (address.id == id && address.defaultAddress == true) {
				var totalPrice = 0;
				_.map(_cartList, function (cart, i) {
					totalPrice += cart.price * cart.amount;
				});
				var discount = 0;
				_.map(_promotionList, function (pro, i) {
					if (pro.condition <= totalPrice && discount < pro.discount) {
						discount = pro.discount;
					}
				});
				var express = getExpressPrice(_selectedAddress.provinceCode, _cartList);
				totalPrice = totalPrice - discount + express;
				$(".express_fee").text("邮费：￥" + express);
				$(".final_total_span").text("实付：￥" + totalPrice);
				alert("邮费可能已经发生变化，请您确认后再提交订单！");
				return;
			}
		}
		$.ajax({
			type: "POST",
			url: "/letspogo/shop/changeDefaultAddress",
			data: { "id": id },
			success: function (msg) {
				var obj = msg;
				if (obj == "login") {
					$("#login_container").css({ "bottom": "0" });
					return false;
				}
				if (obj == "success") {
					var newList = [];
					_.map(this.state.addressList, function (address, i) {
						if (address.defaultAddress == true) {
							address.defaultAddress = false;
						}
						if (address.id == id) {
							address.defaultAddress = true;
							var totalPrice = 0;
							_.map(_cartList, function (cart, i) {
								totalPrice += cart.price * cart.amount;
							});
							var discount = 0;
							_.map(_promotionList, function (pro, i) {
								if (pro.condition <= totalPrice && discount < pro.discount) {
									discount = pro.discount;
								}
							});
							_selectedAddress = address;
							var express = getExpressPrice(_selectedAddress.provinceCode, _cartList);
							totalPrice = totalPrice - discount + express;
							$(".express_fee").text("邮费：￥" + express);
							$(".final_total_span").text("实付：￥" + totalPrice);
							alert("邮费可能已经发生变化，请您确认后再提交订单！");
						}
						newList.push(address);
					});
					this.setState({ addressList: newList });
				}
			}.bind(this)
		});
	},
	handleAddressChange: function (newAddress) {
		var isNew = true;
		_.map(this.state.addressList, function (address, i) {
			address.defaultAddress = false;
			if (address.id == newAddress.id) {
				jQuery.extend(true, address, newAddress);
				isNew = false;
			}
		});
		var list = this.state.addressList;
		if (isNew) {
			list.push(newAddress);
		}
		_selectedAddress = newAddress;
		var totalPrice = 0;
		_.map(_cartList, function (cart, i) {
			totalPrice += cart.price * cart.amount;
		});
		var discount = 0;
		_.map(_promotionList, function (pro, i) {
			if (pro.condition <= totalPrice && discount < pro.discount) {
				discount = pro.discount;
			}
		});
		var express = getExpressPrice(_selectedAddress.provinceCode, _cartList);
		totalPrice = totalPrice - discount + express;
		$(".express_fee").text("邮费：￥" + express);
		$(".final_total_span").text("实付：￥" + totalPrice);
		alert("邮费可能已经发生变化，请您确认后再提交订单！");
		this.setState({ addressList: list, selectedAddress: newAddress });
	},
	render: function () {
		var spans = [];
		_.map(this.state.addressList, function (address, i) {
			var scr = getAddress(address.provinceCode, address.cityCode, address.districtCode);
			spans.push(React.createElement(
				"span",
				{ key: i, "data-id": address.id, onClick: this.handleChangeDefaultAddress, className: address.defaultAddress == true ? "active_address_span address_span" : "address_span" },
				React.createElement(
					"p",
					{ "data-id": address.id },
					"收件人：" + address.contactMan
				),
				React.createElement(
					"p",
					{ "data-id": address.id },
					"联系方式：" + address.contactNumber
				),
				React.createElement(
					"p",
					{ "data-id": address.id },
					"收件地址：" + scr + " " + address.addressDetail
				),
				React.createElement(
					"span",
					{ "data-id": address.id, className: "update_address_button", onClick: this.handleUpdateAddress },
					"修改"
				)
			));
		}.bind(this));
		return React.createElement(
			"div",
			{ className: "address_list" },
			React.createElement(
				"div",
				{ className: "address_title" },
				React.createElement(
					"span",
					null,
					"收货地址"
				)
			),
			spans,
			React.createElement(
				"span",
				{ className: "add_address_span address_span", onClick: this.handleShowAddressForm },
				"+"
			),
			React.createElement(AddressForm, { ref: "addressForm", selectedAddress: this.state.selectedAddress, addressChange: this.handleAddressChange })
		);
	}
});
var AddressForm = React.createClass({
	displayName: "AddressForm",

	getInitialState: function () {
		return {
			selectedAddress: this.props.selectedAddress
		};
	},
	componentWillReceiveProps: function (props) {
		this.setState({ selectedAddress: props.selectedAddress });
	},
	componentDidUpdate: function () {
		var locS = this.refs.locS;
		var locC = this.refs.locC;
		var locR = this.refs.locR;
		var target_obj = { 'S': $(locS), 'C': $(locC), 'R': $(locR) };
		var value_obj;
		if (this.state.selectedAddress == null) {
			value_obj = { 'S': -1, 'C': -1, 'R': -1 };
		} else {
			value_obj = { 'S': this.state.selectedAddress.provinceCode, 'C': this.state.selectedAddress.cityCode, 'R': this.state.selectedAddress.districtCode };
		}
		allLoad(target_obj, value_obj);
		$("input[name='contactMan']").val(this.state.selectedAddress == null ? "" : this.state.selectedAddress.contactMan);
		$("input[name='contactNumber']").val(this.state.selectedAddress == null ? "" : this.state.selectedAddress.contactNumber);
		$("textarea").val(this.state.selectedAddress == null ? "" : this.state.selectedAddress.addressDetail);
	},
	handleCloseAddressForm: function () {
		var node = this.refs.mask;
		$(node).css({ "bottom": screenHeight + "px" });
	},
	handleSubmitAddress: function () {
		var id = $("input[name='id']").val();
		var contactMan = $("input[name='contactMan']").val();
		var contactNumber = $("input[name='contactNumber']").val();
		var addressDetail = $("textarea").val();
		var provinceCode = $("select[name='provinceCode']").val();
		var cityCode = $("select[name='cityCode']").val();
		var districtCode = $("select[name='districtCode']").val();
		if (contactMan == undefined || contactMan == "" || contactNumber == undefined || contactNumber == "" || addressDetail == undefined || addressDetail == "" || provinceCode < 0 || cityCode < 0) {
			alert("请确认信息已填写完整!");
			return false;
		}
		$.ajax({
			type: "post",
			url: "/letspogo/shop/saveAddress",
			data: { "id": id, "contactMan": contactMan, "contactNumber": contactNumber, "addressDetail": addressDetail, "provinceCode": provinceCode, "cityCode": cityCode, "districtCode": districtCode },
			success: function (msg) {
				var obj = $.parseJSON(msg);
				var node = this.refs.mask;
				$(node).css({ "bottom": screenHeight + "px" });
				this.props.addressChange(obj);
			}.bind(this)
		});
	},
	handleSelectChange: function (event) {
		var el = event.target;
		var id = $(el).attr("id");
		var locS = this.refs.locS;
		var locC = this.refs.locC;
		var locR = this.refs.locR;
		var target_obj = { 'S': $(locS), 'C': $(locC), 'R': $(locR) };
		var value_obj;
		var value = $(el).val();
		if (id == "locS") {
			value_obj = { 'S': value, 'C': -1, 'R': -1 };
		} else if (id == "locC") {
			value_obj = { 'S': $(locS).val(), 'C': value, 'R': -1 };
		} else if (id == "locR") {
			value_obj = { 'S': $(locS).val(), 'C': $(locC).val(), 'R': value };
		}
		allLoad(target_obj, value_obj);
	},
	handleIdChange: function (event) {},
	render: function () {
		if (this.state.selectedAddress == null) {
			return React.createElement(
				"div",
				{ ref: "mask", className: "address_form_div" },
				React.createElement(
					"div",
					{ className: "address_form" },
					React.createElement(
						"div",
						{ className: "close_button", onClick: this.handleCloseAddressForm },
						React.createElement(
							"i",
							{ className: "icon iconfont" },
							""
						)
					),
					React.createElement(
						"table",
						null,
						React.createElement(
							"tbody",
							null,
							React.createElement(
								"tr",
								null,
								React.createElement(
									"td",
									{ className: "address_form_title" },
									"* 收件人："
								),
								React.createElement(
									"td",
									{ className: "address_form_input" },
									React.createElement("input", { type: "hidden", value: "0", name: "id", onChange: this.handleIdChange }),
									React.createElement("input", { type: "text", name: "contactMan" })
								)
							),
							React.createElement(
								"tr",
								null,
								React.createElement(
									"td",
									{ className: "address_form_title" },
									"* 联系电话："
								),
								React.createElement(
									"td",
									{ className: "address_form_input" },
									React.createElement("input", { type: "text", name: "contactNumber" })
								)
							),
							React.createElement(
								"tr",
								null,
								React.createElement(
									"td",
									{ className: "address_form_title" },
									"* 省/市/区："
								),
								React.createElement(
									"td",
									{ className: "select_td" },
									React.createElement(
										"select",
										{ id: "locS", ref: "locS", className: "address_select", name: "provinceCode", onChange: this.handleSelectChange },
										React.createElement(
											"option",
											{ value: "-1" },
											"--省级--"
										)
									),
									React.createElement(
										"select",
										{ id: "locC", ref: "locC", className: "address_select", name: "cityCode", onChange: this.handleSelectChange },
										React.createElement(
											"option",
											{ value: "-1" },
											"--市级--"
										)
									),
									React.createElement(
										"select",
										{ id: "locR", ref: "locR", className: "address_select", name: "districtCode", onChange: this.handleSelectChange },
										React.createElement(
											"option",
											{ value: "-1" },
											"--区级--"
										)
									)
								)
							),
							React.createElement(
								"tr",
								null,
								React.createElement(
									"td",
									{ className: "address_form_title detail_address_title" },
									"* 详细地址："
								),
								React.createElement(
									"td",
									{ className: "detail_textarea" },
									React.createElement("textarea", { cols: "40", rows: "5" })
								)
							)
						)
					),
					React.createElement(
						"div",
						{ className: "submit_button" },
						React.createElement(
							"span",
							{ className: "cancel", onClick: this.handleCloseAddressForm },
							"取消"
						),
						React.createElement(
							"span",
							{ className: "save", onClick: this.handleSubmitAddress },
							"保存"
						)
					)
				)
			);
		}
		return React.createElement(
			"div",
			{ ref: "mask", className: "address_form_div" },
			React.createElement(
				"div",
				{ className: "address_form" },
				React.createElement(
					"div",
					{ className: "close_button", onClick: this.handleCloseAddressForm },
					React.createElement(
						"i",
						{ className: "icon iconfont" },
						""
					)
				),
				React.createElement(
					"table",
					null,
					React.createElement(
						"tbody",
						null,
						React.createElement(
							"tr",
							null,
							React.createElement(
								"td",
								{ className: "address_form_title" },
								"* 收件人："
							),
							React.createElement(
								"td",
								{ className: "address_form_input" },
								React.createElement("input", { type: "hidden", value: this.state.selectedAddress.id, name: "id", onChange: this.handleIdChange }),
								React.createElement("input", { type: "text", name: "contactMan" })
							)
						),
						React.createElement(
							"tr",
							null,
							React.createElement(
								"td",
								{ className: "address_form_title" },
								"* 联系电话："
							),
							React.createElement(
								"td",
								{ className: "address_form_input" },
								React.createElement("input", { type: "text", name: "contactNumber" })
							)
						),
						React.createElement(
							"tr",
							null,
							React.createElement(
								"td",
								{ className: "address_form_title" },
								"* 省/市/区："
							),
							React.createElement(
								"td",
								{ className: "select_td" },
								React.createElement(
									"select",
									{ id: "locS", ref: "locS", className: "address_select", name: "provinceCode", onChange: this.handleSelectChange },
									React.createElement(
										"option",
										{ value: "-1" },
										"--省级--"
									)
								),
								React.createElement(
									"select",
									{ id: "locC", ref: "locC", className: "address_select", name: "cityCode", onChange: this.handleSelectChange },
									React.createElement(
										"option",
										{ value: "-1" },
										"--市级--"
									)
								),
								React.createElement(
									"select",
									{ id: "locR", ref: "locR", className: "address_select", name: "districtCode", onChange: this.handleSelectChange },
									React.createElement(
										"option",
										{ value: "-1" },
										"--区级--"
									)
								)
							)
						),
						React.createElement(
							"tr",
							null,
							React.createElement(
								"td",
								{ className: "address_form_title detail_address_title" },
								"* 详细地址："
							),
							React.createElement(
								"td",
								{ className: "detail_textarea" },
								React.createElement("textarea", { cols: "40", rows: "5" })
							)
						)
					)
				),
				React.createElement(
					"div",
					{ className: "submit_button" },
					React.createElement(
						"span",
						{ className: "cancel", onClick: this.handleCloseAddressForm },
						"取消"
					),
					React.createElement(
						"span",
						{ className: "save", onClick: this.handleSubmitAddress },
						"保存"
					)
				)
			)
		);
	}
});
var PayMethod = React.createClass({
	displayName: "PayMethod",

	getInitialState: function () {
		return {
			method: null
		};
	},
	handleCheckDiscount:function() {
		var id = parseInt($(this.refs.discountId).val());
		var code = $(this.refs.discountCode).val();
		$.ajax({
			type: "GET",
			url: "/letspogo/shop/checkActivationCode",
			data: { "id": id, "code": code},
			success: function (msg) {
				if (msg.map.pogoActivationCode == undefined) {
					$("#discount_text").text("优惠码错误，如有疑问请联系客服！");
				}else {
					_pogoActivationCode = msg.map.pogoActivationCode;
					if (_pogoActivationCode.state == "N"){
						$("#discount_text").text("优惠码已经使用！");
					} else if (_pogoActivationCode.discountType == "special") {
						$("#discount_text").text("请联系客服领取奖励！");
					} else if (_pogoActivationCode.discountType == "multiply") {
						$("#discount_text").text("您获得全单" + _pogoActivationCode.discount*10 + "折优惠，直接提交订单即可。");
					} else if (_pogoActivationCode.discountType == "subtract") {
						$("#discount_text").text("您获得立减" + _pogoActivationCode.discount + "优惠，直接提交订单即可。");
					}
				}
			}
		});
	},
	handleSubmitOrder: function () {
		if (_cartList == null || _cartList.length == 0) {
			alert('请选购商品!');
			return false;
		}
		var totalPrice = 0;
		_.map(_cartList, function (cart, i) {
			totalPrice += cart.price * cart.amount;
		});
		var discount = 0;
		_.map(_promotionList, function (pro, i) {
			if (pro.condition <= totalPrice && discount < pro.discount) {
				discount = pro.discount;
			}
		});
		if (_pogoActivationCode != null && _pogoActivationCode.state == 'Y') {
			var type = _pogoActivationCode.discountType;
			if (type == "multiply") {
				totalPrice = totalPrice * _pogoActivationCode.discount;
			}
			if (type == "subtract") {
				totalPrice = totalPrice - _pogoActivationCode.discount;
			}
		}
		var express = getExpressPrice(_selectedAddress.provinceCode, _cartList);
		totalPrice = totalPrice - discount + express;
		var scr = getAddress(_selectedAddress.provinceCode, _selectedAddress.cityCode, _selectedAddress.districtCode);
		var addressText = _selectedAddress.contactMan + " " + _selectedAddress.contactNumber + " " + scr + _selectedAddress.addressDetail;
		var remark = $(this.refs.remark).val();
		var payMethod = $(".pay_method_choice").find("input[type='radio']:checked").val();
		var orderList = JSON.stringify(_cartList);
		$.ajax({
			type: "post",
			url: "/letspogo/shop/generateOrder",
			data: { "addressText": addressText, "totalPrice": totalPrice, "remark": remark, "orderList": orderList, "codeId": _pogoActivationCode == null ? 0 : _pogoActivationCode.id},
			success: function (msg) {
				var obj = jQuery.parseJSON(msg);
				if (obj == "login") {
					$("#login_container").css({ "bottom": "0" });
					return false;
				}
				window.location.href = "/letspogo/order";
			}
		});
	},
	render: function () {
		return React.createElement(
			"div",
			{ className: "pay_method" },
			React.createElement(
				"div",
				{ className: "address_title" },
				React.createElement(
					"span",
					null,
					"优惠码"
				)
			),
			React.createElement(
				"div",
				{ className: "discount_div" },
				"优惠序号：",
				React.createElement("input", { type: "text", id: "discount_id", ref: "discountId" }),
				"优惠码：",
				React.createElement("input", { type: "text", id: "discount_code", ref: "discountCode" }),
				React.createElement("span", { id: "discount_check_button", ref: "discount_check_button",onClick: this.handleCheckDiscount },"验证优惠码"),
				React.createElement("span", { id: "discount_text", ref: "discount_text" },"")
			),
			React.createElement(
				"div",
				{ className: "address_title" },
				React.createElement(
					"span",
					null,
					"备注信息"
				)
			),
			React.createElement(
				"div",
				{ className: "remark_div" },
				"备注信息：",
				React.createElement("input", { type: "text", id: "remark", ref: "remark" })
			),
			React.createElement(
				"div",
				{ className: "submit_order_div" },
				React.createElement(
					"span",
					{ onClick: this.handleSubmitOrder },
					"提交订单"
				)
			)
		);
	}
});
ReactDOM.render(React.createElement(CartCommodityList, null), document.getElementById('commodity_container'));
ReactDOM.render(React.createElement(AddressList, null), document.getElementById('address_container'));
ReactDOM.render(React.createElement(PayMethod, null), document.getElementById('pay_method_container'));

},{}]},{},[1]);
