import { queryAllByTestId, queryByTestId } from "@testing-library/dom";
import {
  MIN_CARD_WIDTH,
  renderTopLanguages,
} from "../src/cards/top-languages-card.js";
// adds special assertions like toHaveTextContent
import "@testing-library/jest-dom";


const langs = {
  HTML: {
    color: "#0f0",
    name: "HTML",
    size: 200,
  },
  javascript: {
    color: "#0ff",
    name: "javascript",
    size: 200,
  },
  css: {
    color: "#ff0",
    name: "css",
    size: 100,
  },
};

describe("Test renderTopLanguages", () => {
  it("should render correctly", () => {
    document.body.innerHTML = renderTopLanguages(langs);

    expect(queryByTestId(document.body, "header")).toHaveTextContent(
      "Most Used Languages",
    );

    expect(queryAllByTestId(document.body, "lang-name")[0]).toHaveTextContent(
      "HTML",
    );
    expect(queryAllByTestId(document.body, "lang-name")[1]).toHaveTextContent(
      "javascript",
    );
    expect(queryAllByTestId(document.body, "lang-name")[2]).toHaveTextContent(
      "css",
    );
    expect(queryAllByTestId(document.body, "lang-progress")[0]).toHaveAttribute(
      "width",
      "40%",
    );
    expect(queryAllByTestId(document.body, "lang-progress")[1]).toHaveAttribute(
      "width",
      "40%",
    );
    expect(queryAllByTestId(document.body, "lang-progress")[2]).toHaveAttribute(
      "width",
      "20%",
    );
  });

  it("should hide languages when hide is passed", () => {
    document.body.innerHTML = renderTopLanguages(langs, {
      hide: ["HTML"],
    });
    expect(queryAllByTestId(document.body, "lang-name")[0]).toBeInTheDocument(
      "javascript",
    );
    expect(queryAllByTestId(document.body, "lang-name")[1]).toBeInTheDocument(
      "css",
    );
    expect(queryAllByTestId(document.body, "lang-name")[2]).not.toBeDefined();

    // multiple languages passed
    document.body.innerHTML = renderTopLanguages(langs, {
      hide: ["HTML", "css"],
    });
    expect(queryAllByTestId(document.body, "lang-name")[0]).toBeInTheDocument(
      "javascript",
    );
    expect(queryAllByTestId(document.body, "lang-name")[1]).not.toBeDefined();
  });

  it("should resize the height correctly depending on langs", () => {
    document.body.innerHTML = renderTopLanguages(langs, {});
    expect(document.querySelector("svg")).toHaveAttribute("height", "205");

    document.body.innerHTML = renderTopLanguages(
      {
        ...langs,
        python: {
          color: "#ff0",
          name: "python",
          size: 100,
        },
      },
      {},
    );
    expect(document.querySelector("svg")).toHaveAttribute("height", "245");
  });

  it("should render with custom width set", () => {
    document.body.innerHTML = renderTopLanguages(langs, {});

    expect(document.querySelector("svg")).toHaveAttribute("width", "300");

    document.body.innerHTML = renderTopLanguages(langs, { card_width: 400 });
    expect(document.querySelector("svg")).toHaveAttribute("width", "400");
  });

  it("should render with min width", () => {
    document.body.innerHTML = renderTopLanguages(langs, { card_width: 190 });

    expect(document.querySelector("svg")).toHaveAttribute(
      "width",
      MIN_CARD_WIDTH.toString(),
    );

    document.body.innerHTML = renderTopLanguages(langs, { card_width: 100 });
    expect(document.querySelector("svg")).toHaveAttribute(
      "width",
      MIN_CARD_WIDTH.toString(),
    );
  });

  it("should render with layout compact", () => {
    document.body.innerHTML = renderTopLanguages(langs, { layout: "compact" });

    expect(queryByTestId(document.body, "header")).toHaveTextContent(
      "Most Used Languages",
    );

    expect(queryAllByTestId(document.body, "lang-name")[0]).toHaveTextContent(
      "HTML 40.00%",
    );
    expect(queryAllByTestId(document.body, "lang-progress")[0]).toHaveAttribute(
      "width",
      "100",
    );

    expect(queryAllByTestId(document.body, "lang-name")[1]).toHaveTextContent(
      "javascript 40.00%",
    );
    expect(queryAllByTestId(document.body, "lang-progress")[1]).toHaveAttribute(
      "width",
      "100",
    );

    expect(queryAllByTestId(document.body, "lang-name")[2]).toHaveTextContent(
      "css 20.00%",
    );
    expect(queryAllByTestId(document.body, "lang-progress")[2]).toHaveAttribute(
      "width",
      "50",
    );
  });

  it("should render a translated title", () => {
    document.body.innerHTML = renderTopLanguages(langs, { locale: "cn" });
    expect(document.getElementsByClassName("header")[0].textContent).toBe(
      "最常用的语言",
    );
  });

  it("should render langs with specified langs_count", async () => {
    const options = {
      langs_count: 1,
    };
    document.body.innerHTML = renderTopLanguages(langs, { ...options });
    expect(queryAllByTestId(document.body, "lang-name").length).toBe(
      options.langs_count,
    );
  });

  it("should render langs with specified langs_count even when hide is set", async () => {
    const options = {
      hide: ["HTML"],
      langs_count: 2,
    };
    document.body.innerHTML = renderTopLanguages(langs, { ...options });
    expect(queryAllByTestId(document.body, "lang-name").length).toBe(
      options.langs_count,
    );
  });
});
