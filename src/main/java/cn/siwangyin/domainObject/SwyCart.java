package cn.siwangyin.domainObject;

import java.util.Date;

import org.nutz.dao.entity.annotation.*;

@Table("swy_cart")
public class SwyCart {

	@Column("user_id")
	private int userId;
	
	@Column("commodity_id")
	private int commodityId;
	
	@Column
	private int amount;
	
	@Column
	private Date date;
	
	@Column
	private char state;

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public int getCommodityId() {
		return commodityId;
	}

	public void setCommodityId(int commodityId) {
		this.commodityId = commodityId;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public char getState() {
		return state;
	}

	public void setState(char state) {
		this.state = state;
	}
	
}
