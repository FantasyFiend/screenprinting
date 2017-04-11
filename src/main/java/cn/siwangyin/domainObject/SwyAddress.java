package cn.siwangyin.domainObject;

import org.nutz.dao.entity.annotation.*;

/**
 * Created by zwy on 2017/4/6.
 */
@Table("swy_address")
public class SwyAddress {
    @Id
    private int id;

    @Column("user_id")
    private int userId;

    @Column("province_city_district")
    private String provinceCityDistrict;

    @Column("address_detail")
    private String addressDetail;

    @Column("contact_number")
    private String contactNumber;

    @Column("contact_man")
    private String contactMan;

    @Column("default_address")
    private boolean defaultAddress;

    @Column
    private char state;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getProvinceCityDistrict() {
        return provinceCityDistrict;
    }

    public void setProvinceCityDistrict(String provinceCityDistrict) {
        this.provinceCityDistrict = provinceCityDistrict;
    }

    public String getAddressDetail() {
        return addressDetail;
    }

    public void setAddressDetail(String addressDetail) {
        this.addressDetail = addressDetail;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getContactMan() {
        return contactMan;
    }

    public void setContactMan(String contactMan) {
        this.contactMan = contactMan;
    }

    public boolean isDefaultAddress() {
        return defaultAddress;
    }

    public void setDefaultAddress(boolean defaultAddress) {
        this.defaultAddress = defaultAddress;
    }

    public char getState() {
        return state;
    }

    public void setState(char state) {
        this.state = state;
    }
}
