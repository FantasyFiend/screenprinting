package cn.siwangyin.domainObject;

import org.nutz.dao.entity.annotation.*;

@Table("swy_nav_type")
public class SwyNavType {

	@Id
	private int id;
	
	@Column
	private String name;
	
	@Column
	private String text;
	
	@Column
	private String href;
	
	@Column("tag_ids")
	private String tagIds;
	
	@Column("parent_id")
	private int parentId;
	
	@Column
	private char state;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getHref() {
		return href;
	}

	public void setHref(String href) {
		this.href = href;
	}

	public String getTagIds() {
		return tagIds;
	}

	public void setTagIds(String tagIds) {
		this.tagIds = tagIds;
	}

	public int getParentId() {
		return parentId;
	}

	public void setParentId(int parentId) {
		this.parentId = parentId;
	}

	public char getState() {
		return state;
	}

	public void setState(char state) {
		this.state = state;
	}
	
}
