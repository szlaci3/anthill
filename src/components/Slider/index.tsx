import { Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

function Slider(props) {
  const {
    sliderRef,
    children,
  } = props;

  // these fix an antd error in console
  const LeftArrow = ({ currentSlide, slideCount, ...restArrowProps}) => <LeftOutlined {...restArrowProps}/>
  const RightArrow = ({ currentSlide, slideCount, ...restArrowProps}) => <RightOutlined {...restArrowProps}/>

  return (
    <Carousel ref={sliderRef} dots={false} arrows={true} prevArrow={<LeftArrow />} nextArrow={<RightArrow />}>
      {children}
    </Carousel>
  );
}

export default Slider;