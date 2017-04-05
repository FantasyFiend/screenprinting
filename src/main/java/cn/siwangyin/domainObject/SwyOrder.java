package cn.siwangyin.domainObject;

import java.util.Date;

import org.nutz.dao.entity.annotation.*;

@Table("swy_order")
public class SwyOrder {

	@Id
	private int id;
	
	@Column("order_number")
	private String orderNumber;
	
	@Column("user_id")
	private int userId;
	
	@Column("order_title")
	private String orderTitle;
	
	@Column("order_item")
	private String orderItem;
	
	@Column("address_text")
	private String addressText;
	
	@Column("total_price")
	private float totalPrice;
	
	@Column("create_time")
	private Date createTime;
	
	@Column("pay_time")
	private Date payTime;
	
	@Column
	private String remark;
	
	@Column("show_or_hide")
	private char showOrHide;
	
	@Column
	private char state;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getOrderNumber() {
		return orderNumber;
	}

	public void setOrderNumber(String orderNumber) {
		this.orderNumber = orderNumber;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getOrderTitle() {
		return orderTitle;
	}

	public void setOrderTitle(String orderTitle) {
		this.orderTitle = orderTitle;
	}

	public String getOrderItem() {
		return orderItem;
	}

	public void setOrderItem(String orderItem) {
		this.orderItem = orderItem;
	}

	public String getAddressText() {
		return addressText;
	}

	public void setAddressText(String addressText) {
		this.addressText = addressText;
	}

	public float getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(float totalPrice) {
		this.totalPrice = totalPrice;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getPayTime() {
		return payTime;
	}

	public void setPayTime(Date payTime) {
		this.payTime = payTime;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public char getShowOrHide() {
		return showOrHide;
	}

	public void setShowOrHide(char showOrHide) {
		this.showOrHide = showOrHide;
	}

	public char getState() {
		return state;
	}

	public void setState(char state) {
		this.state = state;
	}
	
}
