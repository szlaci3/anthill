import Coat from "./Coat";
import "@testing-library/jest-dom/extend-expect";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const depObj = {
  id: "2",
  name: "Department2",
  pid: "1",
  selected: undefined,
  sub: [{
    id: "3",
    name: "Department3",
    pid: "2",
    selected: true,
    sub: [],
  }, {
    id: "4",
    name: "Department4",
    pid: "2",
    selected: undefined,
    sub: [],
  }],
}

const coat = <Coat
  depObj={depObj}
  selectDepartment={() => {}}
/>

test("UnitTest - Department Coat: Coat is rendered.", () => {
  render(coat)

  const coatEl = screen.getByText("Department3");
  expect(coatEl).toBeInTheDocument();
  expect(coatEl.className).toEqual("name hi");
});

test("UnitTest - Department Coat: Department can be opened.", async () => {
  render(coat)
  const coatEl = screen.getByText("Department4");
  expect(coatEl).toBeInTheDocument();
  expect(coatEl.className).not.toEqual("name hi");
  await userEvent.hover(coatEl);
  expect(coatEl.className).toEqual("name hi");
});



