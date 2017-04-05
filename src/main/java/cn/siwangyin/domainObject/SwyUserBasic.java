package cn.siwangyin.domainObject;

import java.util.Date;

import org.nutz.dao.entity.annotation.*;

@Table("swy_user_basic")
public class SwyUserBasic {

	@Id
	private int id;
	
	@Column
	private String email;
	
	@Column
	private String password;
	
	@Column
	private String nickname;
	
	@Column("register_time")
	private Date registerTime;
	
	@Column
	private char state;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public Date getRegisterTime() {
		return registerTime;
	}

	public void setRegisterTime(Date registerTime) {
		this.registerTime = registerTime;
	}

	public char getState() {
		return state;
	}

	public void setState(char state) {
		this.state = state;
	}
}
