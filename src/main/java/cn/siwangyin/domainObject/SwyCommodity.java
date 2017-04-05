package cn.siwangyin.domainObject;

import org.nutz.dao.entity.annotation.*;

@Table("swy_commodity")
public class SwyCommodity {

	@Id
	private int id;
	
	@Column("order_number")
	private String orderNumber;
	
	@Column
	private String name;
	
	@Column
	private float price;
	
	@Column
	private String description;
	
	@Column("tag_names")
	private String tagNames;
	
	@Column("img_path")
	private String imgPath;
	
	@Column("detail_html")
	private String detailHtml;
	
	@Column("cart_sale")
	private int cartSale;
	
	@Column("order_sale")
	private int orderSale;
	
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public float getPrice() {
		return price;
	}

	public void setPrice(float price) {
		this.price = price;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getTagNames() { return tagNames; }

	public void setTagNames(String tagNames) {
		this.tagNames = tagNames;
	}

	public String getImgPath() {
		return imgPath;
	}

	public void setImgPath(String imgPath) {
		this.imgPath = imgPath;
	}

	public String getDetailHtml() { return detailHtml; }

	public void setDetailHtml(String detailHtml) { this.detailHtml = detailHtml; }

	public int getCartSale() {
		return cartSale;
	}

	public void setCartSale(int cartSale) {
		this.cartSale = cartSale;
	}

	public int getOrderSale() {
		return orderSale;
	}

	public void setOrderSale(int orderSale) { this.orderSale = orderSale; }

	public char getState() {
		return state;
	}

	public void setState(char state) {
		this.state = state;
	}

}
