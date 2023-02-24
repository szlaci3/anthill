import { useState, useEffect, useRef } from 'react';
import { Upload, Modal, message } from 'antd';
import { connect } from 'dva';
import { getUploadToken } from '@/services/globalServices';
import { hasVal } from '@/utils/utils';
import Slider from '@/components/Slider';

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function PictureMultiUpload(props) {
  const {
    isEdit,
    form,
    fieldName,
    className,
    files,
    previewName,
    defaultImg,
    showPreviewIcon = true,
    multiple = true,
    maxCount,
    is_must,
    is_diy,

    uploadToken,
  } = props;

  const parsedFiles = files.map((file, i) => ({
    uid: i,
    name: previewName,
    status: 'done',
    filename: file.filename,
    url: cloud + file.filename,
    idx: i,
    id: file.id,
  }));
  const [fileList, setFileList] = useState(parsedFiles);
  const [carouselVisible, setCarouselVisible] = useState(false);
  const sliderRef = useRef();

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

  const onLoadError = (idx) => {
    message.error(`图片${idx + 1}读取失败`);
  }

  const handleChange = async (info) => {
    let allFinished = true;
    for (let i=0; i<info.fileList.length; i++) {
      let item = info.fileList[i];
      if (item.status === "uploading") {
        allFinished = false;
        break;
      }
    }
    if (allFinished) {
      let names = [];
      let objects = [];
      for (let i=0; i<info.fileList.length; i++) {
        let item = info.fileList[i];
        if (item.response) {
          if (item.response.success) {
            let newName = {
              filename: item.response.name?.key,
              name: previewName,
              is_must: is_must,
              is_diy: is_diy,
            };
            if (hasVal(item.id)) {
              newName.id = item.id;
            }
            names.push(newName);
            objects.push(Object.assign({}, item, {
              idx: i,
              preview: await getBase64(item.originFileObj),
              thumbUrl: item.thumbUrl || item.preview,
            }));
          } else {
            const isLt5M = item.size / 1024 / 1024 < 5;
            if (!isLt5M) {
              message.error(`${item.name}: 很抱歉，文件大小不能超过5MB哦`);
            } else {
              message.error(`${item.name}: 导入失败`);
            }
          }
        } else if (item.url) {
          let newName2 = {
            filename: item.filename,
            name: previewName,
            is_must: is_must,
            is_diy: is_diy,
          };
          if (hasVal(item.id)) {
            newName2.id = item.id;
          }
          names.push(newName2);
          objects.push(Object.assign({}, item, {
            idx: i,
          }));
        }
      }
      form.setFieldsValue({[fieldName]: names});
      setFileList(objects);
    } else {
      setFileList(info.fileList);
    }
  }

  const openImage = async (file) => {
    setCarouselVisible(true);

    if (sliderRef.current) {
      sliderRef.current.goTo(file.idx, true);
    } else {
      window.setTimeout(() => sliderRef.current.goTo(file.idx, true), 50);
    }
  }

  const eachCarouselImg = (box, i) => {
    return <div key={i}>
      <img className="carousel-image" src={box.url || box.preview}/>
    </div>
  }

  const onRemove = (item) => {
    props.onRemovePicture({
      id: item.id,
      name: item.name,
      is_deleted: 1,
    });
    return true;
  }

  return (
    <>
      <Upload
        disabled={!isEdit}
        className={`face _${fieldName} ${className || ""}`}
        accept=".png,.jpg,.jpeg,.gif"
        action={qiniuUploadUrl}
        data={{token: uploadToken}}
        listType="picture-card"
        fileList={fileList}
        onPreview={openImage}
        onChange={handleChange}
        maxCount={maxCount}
        multiple={multiple}
        onRemove={onRemove}
      >
        {fileList.length >= maxCount || !isEdit ? null : <img src={defaultImg} className="default-picture-upload" alt=""/>}
      </Upload>
      {fileList[0] && fileList[0].url && <img src={fileList[0].url} onError={onLoadError.bind(null, 0)} className="display-none"/>}
      {fileList[1] && fileList[1].url && <img src={fileList[1].url} onError={onLoadError.bind(null, 1)} className="display-none"/>}
      {fileList[2] && fileList[2].url && <img src={fileList[2].url} onError={onLoadError.bind(null, 2)} className="display-none"/>}
      
      {fileList.length === 0 && !isEdit && <span className="no-pictures"></span>}
      
      <Modal
        maskClosable={false}
        title={previewName}
        visible={carouselVisible}
        onCancel={() => setCarouselVisible(false)}
        footer={null}
        className="carousel-popup max-height-modal"
        width="90vw"
        closeIcon={<span className="close-x">&times;</span>}
        >

        <Slider sliderRef={sliderRef}>
          {fileList.map(eachCarouselImg)}
        </Slider>
      </Modal>
    </>
  );
}

export default connect(state => {
  return {
    uploadToken: state.global.uploadToken,
  };
})(PictureMultiUpload);