import { useModel, history } from 'umi';
import { Spin, Button, Card } from 'antd';
import { hasVal } from '@/utils/utils';

const License = (props) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  let { authStatus, authMsg } = currentUser;

  let buttonText;
  switch (authStatus) {
    case 1:
      buttonText = "进入平台"; break;
    case 2:
      buttonText = "前往企业认证"; break;
    default: //0, -1, "loading"(undefined)
      buttonText = "返回上传资料";
  }

  const goToIndex = () => {
    history.push("/");
  }

  return <div>
    {props.children}

    <Card className="company-setup-card">

      {hasVal(authStatus) ? (
        <img className="status-image" src={require(`@/img/setupstatus${authStatus}.png`)} alt=""/>
      ) : (
        <Spin className="spin1"/>
      )}
      <div className="status-message">{authMsg}</div>

      <Button type="primary" className="status-btn" onClick={authStatus == 1 ? goToIndex : () => {props.setIsIconView(false)}} style={{margin: "2em"}}>
        {buttonText}
      </Button>
    </Card>
  </div>

}

export default License;