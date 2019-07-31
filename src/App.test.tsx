import React from "react";
import ReactDOM from "react-dom";
import { mount } from "enzyme";

import App from "./App";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

/**
 * This is a _great_ integration test because it _actually_ renders the DOM,
 * interacts with the page, and sends a network request, but a _terrible_
 * unit test. I spent some time trying to mock out the fetch request but
 * couldn't quite figure it out. Mocking out the fetch request would
 * allow me to remove the setTimeout. In a real world scenario though,
 * having a test like this is much better than having no test, because
 * we'll know that the core functionality of the app will always work.
 */
it("Displays a crawl when a user selects a movie", done => {
  const wrapper = mount(<App />);
  setTimeout(() => {
    // Triggers react-select's change event with an arrow down and enter press
    wrapper
      .find(".list__control")
      .first()
      .simulate("keyDown", { key: "ArrowDown", keyCode: 40 });
    wrapper
      .find(".list__control")
      .first()
      .simulate("keyDown", { key: "Enter", keyCode: 13 });

    expect(wrapper.find("article h1").text()).toEqual("A New Hope");
    done();
  }, 2000);
});
