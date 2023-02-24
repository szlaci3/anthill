import Sandbox from './Sandbox';
import {render, screen} from '@testing-library/react';
import "@testing-library/jest-dom/extend-expect";
// import axios from 'axios';

// jest.mock('axios');

it("UnitTest - Sandbox Page is rendered.", async () => {
  const stories = [
    { objectID: '1', title: 'Hello' },
    { objectID: '2', title: 'React' },
  ];

  // axios.get.mockImplementationOnce(() =>
  //   Promise.resolve({ data: { hits: stories } })
  // );
  
  const wrapper = render(<Sandbox/>);
 
  const contentElement = await screen.findByTestId("w11");
  const contentElement3 = await screen.findByTestId("w13");
  console.log(screen.debug())
  expect(contentElement).toBeInTheDocument();
  expect(contentElement3).toBeInTheDocument();
});