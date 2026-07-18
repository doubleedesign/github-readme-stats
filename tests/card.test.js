import { describe, expect, it } from "@jest/globals";
import { queryByTestId } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { cssToObject } from "@uppercod/css-to-object";
import { Card } from "../src/common/Card.js";
import { icons } from "../src/common/icons.js";
import { getCardColors } from "../src/common/color.js";

describe("Card", () => {

  it("should have a custom title", () => {
    const card = new Card({
      customTitle: "custom title",
      defaultTitle: "default title",
    });

    document.body.innerHTML = card.render(``);
    expect(queryByTestId(document.body, "card-title")).toHaveTextContent(
      "custom title",
    );
  });

  it("should set custom title", () => {
    const card = new Card({});
    card.setTitle("custom title");

    document.body.innerHTML = card.render(``);
    expect(queryByTestId(document.body, "card-title")).toHaveTextContent(
      "custom title",
    );
  });

  it("should hide title", () => {
    const card = new Card({});
    card.setHideTitle(true);

    document.body.innerHTML = card.render(``);
    expect(queryByTestId(document.body, "card-title")).toBeNull();
  });

  it("should not hide title", () => {
    const card = new Card({});
    card.setHideTitle(false);

    document.body.innerHTML = card.render(``);
    expect(queryByTestId(document.body, "card-title")).toBeInTheDocument();
  });

  it("title should have prefix icon", () => {
    const card = new Card({ title: "ok", titlePrefixIcon: icons.contribs });

    document.body.innerHTML = card.render(``);
    expect(document.getElementsByClassName("icon")[0]).toBeInTheDocument();
  });

  it("title should not have prefix icon", () => {
    const card = new Card({ title: "ok" });

    document.body.innerHTML = card.render(``);
    expect(document.getElementsByClassName("icon")[0]).toBeUndefined();
  });

  it("should have proper height, width", () => {
    const card = new Card({ height: 200, width: 200, title: "ok" });
    document.body.innerHTML = card.render(``);
    expect(document.getElementsByTagName("svg")[0]).toHaveAttribute(
      "height",
      "200",
    );
    expect(document.getElementsByTagName("svg")[0]).toHaveAttribute(
      "width",
      "200",
    );
  });

  it("should have less height after title is hidden", () => {
    const card = new Card({ height: 200, title: "ok" });
    card.setHideTitle(true);

    document.body.innerHTML = card.render(``);
    expect(document.getElementsByTagName("svg")[0]).toHaveAttribute(
      "height",
      "170",
    );
  });

  it("main-card-body should have proper when title is visible", () => {
    const card = new Card({ height: 200 });
    document.body.innerHTML = card.render(``);
    expect(queryByTestId(document.body, "main-card-body")).toHaveAttribute(
      "transform",
      "translate(0, 55)",
    );
  });

  it("main-card-body should have proper position after title is hidden", () => {
    const card = new Card({ height: 200 });
    card.setHideTitle(true);

    document.body.innerHTML = card.render(``);
    expect(queryByTestId(document.body, "main-card-body")).toHaveAttribute(
      "transform",
      "translate(0, 25)",
    );
  });
});
