package cn.siwangyin.system;

import java.util.HashMap;
import java.util.Map;

import org.nutz.dao.QueryResult;

public class SwyQueryResult extends QueryResult{

	private static final long serialVersionUID = -1629019264003524239L;
	
	private Map<String,Object> map = new HashMap<String, Object>();

	public Map<String, Object> getMap() {
		return map;
	}

	public void setMap(Map<String, Object> map) {
		this.map = map;
	}
	
}