import { useState, useEffect } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { getUploadToken } from '@/services/globalServices';

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function PictureUpload(props) {
  const {
    form,
    fieldName,
    picUrl,
    previewName,
    defaultImg,
    showPreviewIcon = true,
    className,

    uploadToken,
  } = props;

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([
    {
      uid: '1',
      name: previewName,
      status: 'done',
      url: picUrl,
    },
  ]);

  useEffect(async () => {
    if (!uploadToken) {
      let res = await getUploadToken();
      if (res.code == 1) {
        const {dispatch} = props;
        dispatch({
          type: "global/setUploadToken",
          payload: res.data.data,
        });
      }
    }
  }, [])

  const beforeUpload = file => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('很抱歉，文件大小不能超过5MB哦');
      setFileList([]);
      form.setFieldsValue({[fieldName]: ''});
      props.refreshCount();
    }
    return isLt5M;
  }

  const onLoadError = () => {
    message.error(`图片读取失败`);
    setFileList([]);
    form.setFieldsValue({[fieldName]: ''});
  }

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = (info) => {
    if (info.fileList.length > 0) {
      setFileList([info.fileList[info.fileList.length - 1]]);
    }
    if (info.file.response) {
      if (info.file.response.success) {
        let photo = info.file.response && info.file.response.name && info.file.response.name.key;
        form.setFieldsValue({[fieldName]: photo});
        message.success(`${info.file.name} 导入成功`);
        props.onUpload && props.onUpload({type: 1, license: cloud + photo});
      } else {
        message.error(`${info.file.name} 导入失败`);
      }
    }
  } 

  const replace = () => {
    let el = document.querySelector(`.${fieldName} > .ant-upload-list > .ant-upload input`);
    el && el.click();
  } 


  return (
    <>
      <Upload
        className={`face ${className} ${fieldName}`}
        accept=".png,.jpg,.jpeg,.gif"
        beforeUpload={beforeUpload}
        action={qiniuUploadUrl}
        data={{token: uploadToken}}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={replace}
        maxCount={1}
        showUploadList={{
          showPreviewIcon: showPreviewIcon,
          removeIcon: <img className="replace-picture-icon" src={require("@/img/setup14.png")}/>
        }}
      >
        {fileList.length >= 1 ? null : <img src={defaultImg} className="default-picture-upload" alt=""/>}
      </Upload>
      {fileList[0] && <img src={fileList[0].url} onError={onLoadError} className="display-none"/>}
      <Modal
        maskClosable={false}
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        closeIcon={<span className="close-x">&times;</span>}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
}

export default connect(state => {
  return {
    uploadToken: state.global.uploadToken,
  };
})(PictureUpload);