(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
9; /**
   * Create by zwy on 2017/3/24.
   */

var Nav = React.createClass({
	displayName: "Nav",

	getInitialState: function () {
		return {
			user: null,
			list: [],
			count: 0
		};
	},
	componentWillMount: function () {
		$.ajax({
			type: "get",
			url: "service/shop/getSessionUserAndNavType",
			success: function (data) {
				this.setState({ user: data.map.user, list: data.list, count: data.map.count });
			}.bind(this)
		});
	},
	render: function () {
		var lis = [];
		for (var i = 0; i < this.state.list.length; i++) {
			var type = this.state.list[i];
			if (type.parentId === 0) {
				lis.push(React.createElement(
					"li",
					null,
					React.createElement(
						"a",
						{ href: type.href, className: "dropdown-header" },
						type.text
					)
				));
				for (var j = 0; j < this.state.list.length; j++) {
					var child = this.state.list[j];
					if (child.parentId === type.id) {
						lis.push(React.createElement(
							"li",
							null,
							React.createElement(
								"a",
								{ href: child.href },
								child.text
							)
						));
					}
				}
				lis.push(React.createElement("li", { role: "separator", className: "divider" }));
			}
		}
		var login = new Object();
		if (this.state.user == null) {
			login.href = "login.html";
			login.text = 'Login';
		} else {
			login.href = "userCenter.html";
			login.text = this.state.user.nickname;
		}
		return React.createElement(
			"nav",
			{ className: "navbar navbar-inverse navbar-fixed-top" },
			React.createElement(
				"div",
				{ className: "container" },
				React.createElement(
					"div",
					{ className: "container-fluid" },
					React.createElement(
						"div",
						{ className: "navbar-header" },
						React.createElement(
							"button",
							{ type: "button", className: "navbar-toggle collapsed", "data-toggle": "collapse", "data-target": "#bs-example-navbar-collapse-1", "aria-expanded": "false" },
							React.createElement(
								"span",
								{ className: "sr-only" },
								"\u5BFC\u822A"
							),
							React.createElement("span", { className: "icon-bar" }),
							React.createElement("span", { className: "icon-bar" }),
							React.createElement("span", { className: "icon-bar" })
						),
						React.createElement(
							"a",
							{ className: "navbar-brand", href: "index.html" },
							"\u9ED1\u5149\u907F\u96E3\u6240"
						)
					),
					React.createElement(
						"div",
						{ className: "collapse navbar-collapse", id: "bs-example-navbar-collapse-1" },
						React.createElement(
							"ul",
							{ className: "nav navbar-nav" },
							React.createElement(
								"li",
								{ className: "dropdown" },
								React.createElement(
									"a",
									{ href: "shop.html", className: "dropdown-toggle", "data-toggle": "dropdown", role: "button", "aria-haspopup": "true", "aria-expanded": "false" },
									"\u5546\u57CE",
									React.createElement("span", { className: "caret" })
								),
								React.createElement(
									"ul",
									{ className: "dropdown-menu" },
									lis
								)
							)
						),
						React.createElement(
							"ul",
							{ className: "nav navbar-nav navbar-right" },
							React.createElement(
								"li",
								null,
								React.createElement(
									"a",
									{ href: login.href },
									login.text
								)
							),
							React.createElement(
								"li",
								null,
								React.createElement(
									"a",
									{ href: "cart.html" },
									React.createElement("span", { className: "glyphicon glyphicon-shopping-cart" }),
									"\xA0\xA0",
									React.createElement(
										"span",
										{ className: "badge", id: "cartBadge" },
										this.state.count
									)
								)
							)
						),
						React.createElement(
							"form",
							{ className: "navbar-form navbar-right" },
							React.createElement(
								"div",
								{ className: "input-group" },
								React.createElement("input", { type: "text", placeholder: "\u67E5\u627E", className: "form-control" }),
								React.createElement(
									"span",
									{ className: "input-group-addon" },
									React.createElement("span", { className: "glyphicon glyphicon-search" })
								)
							)
						)
					)
				)
			)
		);
	}
});
ReactDOM.render(React.createElement(Nav, null), document.getElementById("nav_container"));

},{}]},{},[1]);
