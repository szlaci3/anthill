import { useState, useEffect } from 'react';
import { Modal, Input, Form, Select } from 'antd';
import { useRequest, useModel } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';

let map;
let circle;

function SignPosition(props) {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [delayPassed, setDelayPassed] = useState();
  const [c_place, setC_place] = useState(props.c_place);
  const [isMapAdded, setIsMapAdded] = useState();
  const [form] = Form.useForm();

  const rangeList = [...Array(9).keys()].map(x => {
    let value = 100 * (x + 1);
    return {label: `${value}米`, value}; 
  });

  const onOk = () => {
    let signPositionData = {
      ...form.getFieldsValue(),
      c_place,
    }
    props.onOk(signPositionData);
  }

  useEffect(() => {
    setC_place(props.c_place);
  }, [props.c_place]);

  const getCenter = () => (
    c_place ? c_place.split(",") : (sessionStorage.picked_long_lat ? sessionStorage.picked_long_lat.split(",") : null)
  )

  const onRangeChange = (range) => {
    redrawCircle(c_place, range);
  }

  const redrawCircle = (place, range) => {
    if (place) {
      circle && circle.setMap(null);
      circle = new AMap.Circle({
        center: place.split(","),
        radius: range || form.getFieldValue("c_range"), //半径
        strokeColor: "#1397fb", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 3, //线粗细度
        fillColor: "#1397fb", //填充颜色
        fillOpacity: 0.35//填充透明度
      });
      circle.setMap(map);
    }
  }

  useEffect(() => {
    if (props.visible && !isMapAdded) {
      setIsMapAdded(true);
      AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
        map = new AMap.Map('map', {
          zoom: 16,
          scrollWheel: true,
          resizeEnable: true,
          center: getCenter(),
        })
        map.plugin('AMap.Geolocation', function() {
          let location = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(24, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition:'RB',
            showCircle: false,
            GeoLocationFirst: true,
          });
          map.addControl(location);
          !c_place && location.getCurrentPosition();
        });

        let autoOptions = {
          input: "c_place_name"
        };
        let auto = new AMap.Autocomplete(autoOptions);
        let placeSearch = new AMap.PlaceSearch({
          map: map
        });  //构造地点查询类
        AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
        function select(e) {
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name);  //关键字查询查询
        }

        let positionPicker = new PositionPicker({
          mode: 'dragMap',
          map: map
        });

        positionPicker.on('success', function(positionResult) {
          let position = positionResult.position;
          let place = position[Object.keys(position)[1]]+","+position[Object.keys(position)[0]];
          // let place = position.O+","+position.Q; // before 2020
          !props.c_place && window.sessionStorage.setItem("picked_long_lat", place);
          setC_place(place);
          form.setFieldsValue({c_place_name: positionResult.address});
          redrawCircle(place);
        });
        positionPicker.on('fail', function(positionResult) {
          setC_place("");
          form.setFieldsValue({c_place_name: ""});
        });
        positionPicker.start();
      });
    }
  }, [props.visible])


  let initialValues = {
    c_range: props.c_range || 100,
  }

  return <>
    <Modal
      maskClosable={false}
      title="打卡地点"
      visible={props.visible}
      okText="确认"
      onOk={onOk}
      onCancel={props.close}
      closeIcon={<span className="close-x">&times;</span>}
      className="mymap"
      width={800}
    >
      <div className="map-inner">
        <div id="map"></div>
      </div>

      <Form form={form} colon={false} labelCol={{span: 4}} initialValues={initialValues}>
        <div className="need-edge">
          {props.needEdge && <ExclamationCircleOutlined />}
          {props.needEdge && <div>请使用Edge游览器可以更好的显示地图.</div>}
          {props.needEdge && <div>在下方输入详细地址可在地图中精确定位.</div>}
        </div>

        <Form.Item label="打卡地点名称" name="c_place_name">
          <Input
            id="c_place_name"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item label="打卡范围" name="c_range" className="range-select" extra="（员工可在这个范围内正常打卡）">
          <Select
            options={rangeList}
            listHeight={350}
            onChange={onRangeChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  </>
}

export default SignPosition;