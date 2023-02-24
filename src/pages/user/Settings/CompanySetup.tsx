import SettingsTabs from './SettingsTabs';
import { Card, Input, Form, Spin, Button, message } from 'antd';
import { useRequest, useModel, history } from 'umi';
import { useState, useEffect } from 'react';
import CompanyForm from './CompanyForm';
import License from './License';
import { authenticationAdd } from './service';


function CompanySetup() {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser = {} } = initialState;
  const { authData = {} } = currentUser;
  const [form] = Form.useForm();
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [isIconView, setIsIconView] = useState(currentUser.authStatus != 1);// will change by buttons to false, then (if isInitial) to true
  const [refreshByCancelCount, setRefreshByCancelCount] = useState(0);
  const [logoRefreshCount, setLogoRefreshCount] = useState(0);
  const [licenseRefreshCount, setLicenseRefreshCount] = useState(0);
  const [licenseErrorFrame, setLicenseErrorFrame] = useState(false);
  const [telephone_prefix, setTelephone_prefix] = useState();
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  const isInitial = currentUser.authStatus != 1;// will change from API when License approved
  
  const save = async values => {
    let logo = values.logo;
    if (typeof logo === "object") {
      logo = logo.file || {};
      logo = logo.response || {};
      logo = logo.name && logo.name.key;
    }

    let license = values.license;
    if (typeof license === "object") {
      license = license.file || {};
      license = license.response || {};
      license = license.name && license.name.key;
    }

    let params = {
      ...values,
      id: authData.id,
      cid: authData.cid,
      license,
      logo,
      ctelephone: `${telephone_prefix}-${values.ctelephone}`,
    }

    if (!isSaveDisabled) {
      setIsSaveLoading(true);
      setIsSaveDisabled(true);

      const res = await authenticationAdd(params);
      setIsSaveLoading(false);
      if (res.code != 0) {
        if (isInitial) {
          setIsIconView(true);
        }
        setInitialState({
          ...initialState,
          currentUser: {
            ...initialState.currentUser,
            authData: params,
          },
        });
        setLogoRefreshCount(logoRefreshCount + 1);// reverts pictures if upload error.
        setLicenseRefreshCount(licenseRefreshCount + 1);
        setLicenseErrorFrame(false);
        message.success('保存成功！');
      }
      window.setTimeout(() => {
        setIsSaveDisabled(false);
      }, 3000);
    }
  }

  const cancelEdit = () => {
    setRefreshByCancelCount(refreshByCancelCount + 1);
    setLogoRefreshCount(logoRefreshCount + 1);
    setLicenseRefreshCount(licenseRefreshCount + 1);
    setLicenseErrorFrame(false);
    setIsPhoneValid(true);
  }

  const editBtns = <div className="edit-btns">
    <Form form={form} onFinish={save}>
      <Button className="tall oper-1 btn-negative" onClick={cancelEdit}>
        取消
      </Button>
      <Button type="primary" className="tall oper-1" htmlType="submit" loading={isSaveLoading}>
        保存
      </Button>
    </Form>
  </div>

  const topHead = (
    <div className="top-head">
      <Card className="top-section">
        <div className="t1">企业认证</div>
        <span className="recessive">（请上传营业执照，已完善企业信息）</span>
      </Card>

      <div className="steps">
        <img src={require("@/img/setup03.png")} alt="" />
        <div className="text">
          <div>第一步：</div>
          <div className="name hi">上传您的资料文件</div>
        </div>
        <span className="separ"/>
        <img src={require("@/img/setup06.png")} alt="" />
        <div className="text">
          <div>第二步：</div>
          <div className={"name" + (currentUser.authStatus < 2 ? " hi" : "")}>正在认证中...</div>
        </div>
        <span className="separ"/>
        <img src={require("@/img/setup08.png")} alt="" />
        <div className="text">
          <div>第三步：</div>
          <div className={"name" + (currentUser.authStatus == 1 || currentUser.authStatus == -1 ? " hi" : "")}>认证结果</div>
        </div>
      </div>
    </div>
  )

  const companyForm = <CompanyForm form={form} authData={authData} save={save} isInitial={isInitial}  refreshByCancelCount={refreshByCancelCount} logoRefreshCount={logoRefreshCount} licenseRefreshCount={licenseRefreshCount} setLogoRefreshCount={setLogoRefreshCount} setLicenseRefreshCount={setLicenseRefreshCount} licenseErrorFrame={licenseErrorFrame} setLicenseErrorFrame={setLicenseErrorFrame} telephone_prefix={telephone_prefix} setTelephone_prefix={setTelephone_prefix} isSaveDisabled={isSaveDisabled} setIsSaveDisabled={setIsSaveDisabled} isPhoneValid={isPhoneValid} setIsPhoneValid={setIsPhoneValid}>
      {topHead}
    </CompanyForm>

  if (isIconView) {
    if (isInitial) {
      return <License setIsIconView={setIsIconView}>
        {topHead}
      </License>
    } else {
      return <SettingsTabs>
        <License setIsIconView={setIsIconView}>
          {topHead}
        </License>
      </SettingsTabs>
    }
  } else if (isInitial) {
    return companyForm
  } else {
    return <SettingsTabs editBtns={editBtns}>
      {companyForm}
    </SettingsTabs>
  }

}

export default CompanySetup;