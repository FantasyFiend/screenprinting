/**
 * Created by zwy on 2017/4/6.
 */
var Address = React.createClass({
    getInitialState:function () {
        return {
            list:null
        }
    },
    componentWillMount:function(){
        $.ajax({
            type:"get",
            url:"service/shop/getAddressList",
            success:function(data){
                if (data.map.msg === "login"){
                    setCookie("swyFrom",window.location.href);
                    window.location.href = "login.html";
                }else if(data.map.msg === "success"){
                    if (data.list != null && data.list.length > 0) {
                           _.map(data.list, function (address, i) {
                               if (address.defaultAddress) {
                                   _selectedAddress=address;
                               }
                           }.bind(this));
                           this.setState({list: data.list});
                    }
                }
            }.bind(this)
        });
    },
    selectAddress:function(event){
        var el = event.target;
        var parent = $(el).parent().parent();
        var provinceCityDistrict = $(parent).find(".province-city-district").text();
        var addressDetail = $(parent).find(".address-detail").text();
        var contactNumber = $(parent).find(".contact-number").text();
        var contactMan = $(parent).find(".contact-man").text();
        var id = $(el).attr("data-id");
        $.ajax({
            type:"post",
            url:"service/shop/selectAddress",
            data:{id:id, provinceCityDistrict:provinceCityDistrict, addressDetail:addressDetail, contactNumber:contactNumber, contactMan:contactMan},
            success:function(data){
                if (data.map.msg === "login"){
                    setCookie("swyFrom",window.location.href);
                    window.location.href = "login.html";
                }else if(data.map.msg === "success"){
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
                        this.setState({list:newList});
                    }
                }
            }.bind(this)
        });
    },
    render:function(){
        var divs = [];
        if (this.state.list != null && this.state.list.length > 0) {
            _.map(this.state.list,function (address, i) {
                divs.push(<div className="col-xs-12 col-sm-6 col-md-4 address-div"><div className={address.defaultAddress ? "default-address":""}>
                    <span className="address-item">省市区：<span className="province-city-district" contentEditable="true">{address.provinceCityDistrict}</span></span>
                    <span className="address-item">地址：<span className="address-detail" contentEditable="true">{address.addressDetail}</span></span>
                    <span className="address-item">联系电话：<span className="contact-number" contentEditable="true">{address.contactNumber}</span></span>
                    <span className="address-item">联系人：<span className="contact-man" contentEditable="true">{address.contactMan}</span></span>
                    <span className="address-item select-address" data-id={address.id}><p data-id={address.id} onClick={this.selectAddress}>保存并启用</p></span></div>
                </div>);
            }.bind(this));
        }
        divs.push(<div className="col-xs-12 col-sm-6 col-md-4 address-div"><div>
            <span className="address-item">省市区：<span className="province-city-district" contentEditable="true"></span></span>
            <span className="address-item">地址：<span className="address-detail" contentEditable="true"></span></span>
            <span className="address-item">联系电话：<span className="contact-number" contentEditable="true"></span></span>
            <span className="address-item">联系人：<span className="contact-man" contentEditable="true"></span></span>
            <span className="address-item select-address" data-id="0"><p data-id="0" onClick={this.selectAddress}>保存并启用</p></span></div>
        </div>);
        return <div className="address-group">{divs}</div>;
    }
});
ReactDOM.render(<Address />, document.getElementById("address_container"));