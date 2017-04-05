/**
 * 导航管理页面
 * @author zwy
 */
var Nav = React.createClass({
	getInitialState:function(){
		return {
			list:[]
		};
	},
	componentWillMount:function(){
		$.ajax({
			type:"get",
			url:"/screenprinting/action/admin/queryNavTypes",
			success:function(data){
				console.log(data);
			}
		});
	},
	render:function(){
		var trs = [];
		var options = [];
		options.push(<option value = "none" data-id = "0">无</option>);
		for (var i = 0; i < list.length; i++) {
			var type = list[i];
			if (type.parentId = 0) {
				options.push(<option value = {type.name} data-id = {type.id}>type.text</option>)
			}
			trs.push(<tr data-id = {type.id}><td contenteditable="true" data-attr="name">{type.name}</td><td contenteditable="true" data-attr="text">{type.text}</td><td contenteditable="true" data-attr="parentId">{type.parentId}</td></tr>);
		}
		return	<div>
					<table></table>
					<form id="TagForm">
				        <div class="input-group">
				            <input type="text" class="form-control" placeholder="英文名称" id="name" name="name"/>
				        </div>
				        <div class="input-group">
				            <input type="text" class="form-control" placeholder="显示名称" id="text" name="text"/>
				        </div>
				        <div class="input-group">
				            <input type="text" class="form-control" placeholder="跳转路径" id="href" name="href"/>
				        </div>
				        <div class="input-group">
				            <label for="">父级:</label><select id="parent" name="parent">{options}</select>
				        </div>
				        <div class="input-group">
				            <input type="button" class="btn btn-success" value="提交" id="tagAddSubmit"/>
				        </div>
				    </form>;
				</div>;	
				
	}
});
ReactDom.render(<Nav/>, document.getElementById("main_container"));