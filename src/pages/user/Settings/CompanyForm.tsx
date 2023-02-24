import InsRatesC from './InsRatesC';
import { Card, Input, Form, Select, Drawer } from 'antd';
import { useRequest, history, Link } from 'umi';
import { connect } from 'dva';
import {
  ProFormTextArea,
  ProFormText,
} from '@ant-design/pro-form';
import { useState, useEffect } from 'react';
import { getInjuryProportion, getAddress, uploadBusinessLicense, getTelephoneIntervalNumber } from './service';
import { hasVal } from '@/utils/utils';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import PictureUpload from '@/components/PictureUpload';
import Guide from '@/components/Guide';

const { Option } = Select;
const cell_prefix = "+86";

function CompanyForm(props) {
  const [data, setData] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [provinceKey, setProvinceKey] = useState(1);
  const [cityKey, setCityKey] = useState(1);
  const [districtKey, setDistrictKey] = useState(1);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const {
    form,
    authData,
    refreshByCancelCount,
    logoRefreshCount,
    licenseRefreshCount,
    licenseErrorFrame,
    telephone_prefix,
    isPhoneValid,

    setLogoRefreshCount,
    setLicenseRefreshCount,
    setLicenseErrorFrame,
    setTelephone_prefix,
    setIsPhoneValid,
    setIsSaveDisabled,
  } = props;
  const defaultLogo = require("@/img/company-l.png");
  const defaultLicense = require("@/img/setup14_14.png");

  const proportionRes = useRequest(getInjuryProportion, {
    formatResult: res => res,
  });

  useEffect(() => {
    // if (authData && authData.license) {
    if (authData) {
      let phoneAndPrefix = (authData.ctelephone || "").split("-").reverse();
      let _data = {
        ...authData,
        district: authData.district || authData.area,
        ctelephone: phoneAndPrefix[0],
      };
      setData(_data);
      form.setFieldsValue(_data);
      setTelephone_prefix(phoneAndPrefix[1]);
      
      getLocalities("top", null, !!phoneAndPrefix[1]);
    }
  }, [authData, refreshByCancelCount]);


  let logo = form.getFieldValue("logo") || {};
  if (typeof logo !== "string") {
    logo = logo.file || {};
    logo = logo.response || {};
    logo = logo.name && logo.name.key;
    logo = logo || authData.logo;
  }

  let license = form.getFieldValue("license") || {};
  if (typeof license !== "string") {
    license = license.file || {};
    license = license.response || {};
    license = license.name && license.name.key;
    license = license || authData.license;
  }

  const getPhonePrefix = async (city) => {
    let res = await getTelephoneIntervalNumber({city});
    if (res.code == 1) {
      setTelephone_prefix(res.data);
    }
  }

  const getLocalities = async (level, levelObj, keepUserInputPrefix) => {
    // this.state.data.city and such, are the address coming from API and will not have new values before save(). 
    let query = {province_key: 1, city_key: 1};
    if (level === "province") {
      query.province_key = levelObj.key;
    }
    if (level === "city") {
      query.province_key = provinceKey;
      query.city_key = levelObj.key;
    }
    let response = await getAddress(query);

    if (response.code == 0) {
      return;
    }
    if (level === "top") {
      let myProvinces = [];
      let selectedProvinceKey = 1;
      for (let i in response.province) {
        myProvinces.push({key: i, value: response.province[i]});
        /* get the selected province if any */
        if (authData.province === response.province[i]) {
          selectedProvinceKey = i;
        }
      };
      setProvinces(myProvinces);
      setProvinceKey(selectedProvinceKey);
      if (selectedProvinceKey > 1) {
        getLocalities("province", {key: selectedProvinceKey, value: response.province[selectedProvinceKey]}, keepUserInputPrefix);
        return;
      }
    }

    if (level === "top" || level === "province") {
      let myCities = [];
      let selectedCityKey = 1;
      for (let j in response.city) {
        myCities.push({key: j, value: response.city[j]});
        // Only if we are not requesting another city list (!levelObj).
        // If has levelObj, selected key is 1.
        if (authData.city === response.city[j]) {
          selectedCityKey = j;
        }
      };
      setCities(myCities);
      form.setFieldsValue({city: response.city[selectedCityKey]});
      setCityKey(selectedCityKey);
      if (!keepUserInputPrefix) {
        getPhonePrefix(response.city[selectedCityKey]);
      }
      if (selectedCityKey > 1) {
        getLocalities("city", {key: selectedCityKey, value: response.city[selectedCityKey]});
        return;
      }
    }

    // In all cases, SAME AS if (level === "top" || level === "province" || level === "city") :
    let myDistricts = [];
    let selectedDistrictKey = 1;
    for (let k in response.area) {
      myDistricts.push({key: k, value: response.area[k]});
      if (authData.district === response.area[k]) {
        selectedDistrictKey = k;
      }
    };
    setDistricts(myDistricts);
    form.setFieldsValue({district: response.area[selectedDistrictKey]});
    setDistrictKey(selectedDistrictKey);
  }

  if (!hasVal(districtKey) || !proportionRes.data) {
    return <div/>
  }

  const handleLocationChange = (value, choice) => {
    let levelObj = {key: choice.key, value};
    let level = choice.name; // comes from <Option name=
    switch (level) {
      case "province": setProvinceKey(choice.key); getLocalities(level, levelObj); return;
      case "city": setCityKey(choice.key); getLocalities(level, levelObj); getPhonePrefix(choice.value); return;
      case "district": setDistrictKey(choice.key); return;
    }
  }

  const ratio = {
    labelCol: { span: 11 },
    wrapperCol: { span: 13 },
  };

  const renderPrefix = (val, text) => (
    <Select dropdownClassName="employee-options" value={val}>
      <Option value={val}>{text}</Option>
    </Select>
  );

  const handlePrefixChange = ev => {
    if (/^\d{0,6}$/.test(ev.target.value)) {
      setTelephone_prefix(ev.target.value);
    }
  }

  const renderPhonePrefix = () => (
    <Input value={telephone_prefix} onChange={handlePrefixChange}/>
  );

  const selectRate = industry => {
    form.setFieldsValue({industry});
    setIsDrawerVisible(false);
  }

  const validatePhone = (ev) => {
    let phone = ev.target.value.replaceAll(" ", "").replaceAll("-", "");
    if (!phone) {
      setIsSaveDisabled(true);
      return false;
    }
    form.setFieldsValue({phone}); // apply replacements
    let bool = /^1[3456789]\d{9}$/.test(phone);
    setIsPhoneValid(bool);
    setIsSaveDisabled(!bool);
    return bool;
  }


  const topRow = (
    <>
      <div className="top-row">
        <Form form={form}>
          <Form.Item name="logo" noStyle>
            <>
              <PictureUpload
                form={form}
                fieldName="logo"
                picUrl={logo && cloud + logo}
                previewName=" "
                defaultImg={defaultLogo}
                key={logoRefreshCount}
                refreshCount={() => setLogoRefreshCount(logoRefreshCount + 1)}
                showPreviewIcon={false}
              />
              <div className="attic">
                <Link to="/change-password">更改密码</Link>
              </div>
            </>
          </Form.Item>
        </Form>
      </div>

      <div className="top-row2">
        <div className="swapper-instructions">恭喜您，您的企业信息已通过审核！ 对 “ <span className="req">*</span> ”的公司信息更新后，将使得公司资料被重新审核，请谨慎修改！</div>
      </div>
    </>
  )

  const focusNameInput = () => {
    let el = document.querySelector(".guide2-hi input");
    if (el) {
      el.focus();
    }
  }

  return (
    <>
      <Guide close={focusNameInput}/>
      <div className={`company-setup ${props.isInitial ? "is-initial" : ""}`}>
        <div>
          {props.isInitial && props.children}
          <div className="company-setup-inner">
            <div className="company-setup-relative">
              <div className="company-setup-scroll">
                <Drawer
                  title="所属行业"
                  placement="right"
                  onClose={() => {setIsDrawerVisible(false)}}
                  visible={isDrawerVisible}
                  getContainer={false}
                  style={{ position: 'absolute' }}
                  maskStyle={{ cursor: "pointer", background: "rgba(0,0,0,.1)" }}
                  className="ins-drawer"
                  width="100%"
                >
                  <InsRatesC
                    select={selectRate}
                    visible={isDrawerVisible}
                    values={proportionRes.data}
                    selectedValue={form.getFieldValue("industry")}
                    closeChooser={() => {setIsDrawerVisible(false)}}
                  />
                </Drawer>

                <Card className="company-setup-card">
                  
                  {!props.isInitial && topRow}
                  
                  <Form form={form} initialValues={data} colon={false} onFinish={props.save} className="company-form" {...ratio} labelAlign="left">
            
                    <Form.Item name="cname" label="公司名称" rules={[{required: true}]} className="guide2-hi guide2-alpha">
                      <Input autoFocus allowClear/>
                    </Form.Item>

                    <Form.Item label={<><span className="req">*</span>公司地址</>} className="province-select">
                      <Form.Item name="province" label="对应省份" noStyle rules={[{required: true}]}>
                        <Select dropdownClassName="employee-options" onChange={handleLocationChange}>
                          {provinces.map(option => (
                            <Option key={option.key} value={option.value} name="province">{option.value}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item name="city" label="城市" noStyle rules={[{required: true}]}>
                        <Select dropdownClassName="employee-options" onChange={handleLocationChange}>
                          {cities.map(option => (
                            <Option key={option.key} value={option.value} name="city">{option.value}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item name="district" label="区域" noStyle rules={[{required: true}]}>
                        <Select dropdownClassName="employee-options" onChange={handleLocationChange}>
                          {districts.map(option => (
                            <Option key={option.key} value={option.value} name="district">{option.value}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Form.Item>

                    <ProFormText name="address" label="联系地址" rules={[{required: true}]}/>

                    <Form.Item name="ctelephone" label="公司电话" className="has-prefix telephone-prefix" rules={[{required: true}]}>
                      <Input allowClear addonBefore={renderPhonePrefix()}/>
                    </Form.Item>

                    <ProFormText name="linkman" label="联系人" rules={[{required: true}]}/>

                    <Form.Item
                      name="phone"
                      label="手机号码"
                      className="has-prefix"
                      rules={[
                        {required: true},
                      ]}
                      validateStatus={isPhoneValid ? undefined : "error"}
                      help={isPhoneValid ? undefined : "手机号码格式不正确"}
                    >
                      <Input
                        allowClear
                        addonBefore={renderPrefix(cell_prefix, `中国大陆 ${cell_prefix}`)}
                        onBlur={validatePhone}
                        onPressEnter={validatePhone}
                      />
                    </Form.Item>

                    <Form.Item name="license" label="营业执照"
                      rules={[{
                        validator: ((_, value) => {
                          if(value) {
                            return Promise.resolve();
                          } else {
                            setLicenseErrorFrame(true);
                            return Promise.reject(new Error('请上传营业执照'));
                          }
                        })
                      }]}>
                      <>
                        <PictureUpload
                          form={form}
                          fieldName="license"
                          picUrl={license && cloud + license}
                          previewName="营业执照"
                          defaultImg={defaultLicense}
                          key={licenseRefreshCount}
                          refreshCount={() => setLicenseRefreshCount(licenseRefreshCount + 1)}
                          className={licenseErrorFrame ? "error-frame" : ""}
                          onUpload={params => {
                            const res = uploadBusinessLicense(params);
                            if (res.data) { // '' empty value means: false
                              setLicenseErrorFrame(false);
                              form.setFieldsValue({register: res.data});
                            }
                          }}
                        />
                        <div className="license-up-down">
                          <div className="license-up">营业执照的替换，<br/>将使得企业信息重新被审核，<br/>请慎重操作</div>
                          <div className="license-down">图片格式为 <br/>JPG / JPEG / PNG / GIF <br/>大小在 5 MB 内</div>
                        </div>
                      </>
                    </Form.Item>

                    <ProFormText name="email" label="联系邮箱"/>

                    <Form.Item name="postal_code" label="邮政编码">
                      <Input allowClear style={{width: 120}}/>
                    </Form.Item>

                    <Form.Item name="industry" label="所属行业" className="industry-drawer-door" onClick={() => {setIsDrawerVisible(true)}}>
                      <Input readOnly suffix={
                        isDrawerVisible ?
                          <DoubleLeftOutlined/>
                        :
                          <DoubleRightOutlined/>
                      }/>
                    </Form.Item>

                    <ProFormText name="invoice_title" label="发票抬头"/>

                    <ProFormText name="bank_of_deposit" label="开户银行"/>

                    <ProFormText name="bank_account" label="银行账户"/>

                    <ProFormText name="register" label="社会信用代码"/>

                    <ProFormTextArea name="describe" label="企业描述" fieldProps={{allowClear: true, maxLength: 300, autoSize: { minRows: 2 }, showCount: true}}/>

                  </Form>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyForm;