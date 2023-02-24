import Slider from "./index";
import "@testing-library/jest-dom/extend-expect";
import {render, screen} from "@testing-library/react";
import {createRef} from 'react';

const sliderRef = createRef();
const component = <Slider sliderRef={sliderRef}>
		<div>Slide-a</div>
		<div>Slide-b</div>
  </Slider>

test("UnitTest - Slider: Slider is rendered.", async () => {
	// render(component);

  // const { container } = render(<Button variant="default" />)
  // expect(container.getElementsByClassName('default').length).toBe(1);


	// // const element = screen.getAllByText('Slide-a')[0];
	// // console.log(screen.debug());
	// // console.log(element);

});
