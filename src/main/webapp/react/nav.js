9/**
 * Create by zwy on 2017/3/24.
 */

var Nav = React.createClass({
	getInitialState:function(){
		return {
			user:null,
			list:[],
			count:0
		};
	},
	componentWillMount:function(){
		$.ajax({
			type:"get",
			url:"service/shop/getSessionUserAndNavType",
			success:function(data){
				this.setState({user:data.map.user, list:data.list, count:data.map.count});
			}.bind(this)
		});
	},
	render:function(){
		var lis = [];
		for (var i = 0; i < this.state.list.length; i++) {
			var type = this.state.list[i];
			if (type.parentId === 0) {
				lis.push(<li><a href={type.href} className="dropdown-header">{type.text}</a></li>);
				for (var j = 0; j < this.state.list.length; j++) {
					var child = this.state.list[j];
					if (child.parentId === type.id) {
						lis.push(<li><a href={child.href}>{child.text}</a></li>);
					}
				}
				lis.push(<li role="separator" className="divider"></li>);
			}
		}
		var login = new Object();
		if (this.state.user == null) {
			login.href = "login.html";
			login.text = 'Login';
		}else{
			login.href = "userCenter.html";
			login.text = this.state.user.nickname;
		}
		return 	<nav className="navbar navbar-inverse navbar-fixed-top">
					<div className="container">
				        <div className="container-fluid">
				            <div className="navbar-header">
				                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
				                    <span className="sr-only">导航</span>
				                    <span className="icon-bar"></span>
				                    <span className="icon-bar"></span>
				                    <span className="icon-bar"></span>
				                </button>
				                <a className="navbar-brand" href="index.html">黑光避難所</a>
				            </div>
				            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				                <ul className="nav navbar-nav">
				                    <li className="dropdown">
				                        <a href="shop.html" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">商城<span className="caret"></span></a>
				                        <ul className="dropdown-menu">
				                            {lis}
				                        </ul>
				                    </li>
				                </ul>
				                <ul className="nav navbar-nav navbar-right">
				                    <li><a href={login.href}>{login.text}</a></li>
				                    <li><a href="cart.html"><span className="glyphicon glyphicon-shopping-cart"></span>&nbsp;&nbsp;<span className="badge" id="cartBadge">{this.state.count}</span></a></li>
				                </ul>
				                <form className="navbar-form navbar-right">
				                    <div className="input-group">
				                        <input type="text" placeholder="查找" className="form-control"/>
				                        <span className="input-group-addon"><span className="glyphicon glyphicon-search"></span></span>
				                    </div>
				                </form>
				            </div>
				        </div>
			        </div>
				</nav>
	}
});
ReactDOM.render(<Nav />, document.getElementById("nav_container"));