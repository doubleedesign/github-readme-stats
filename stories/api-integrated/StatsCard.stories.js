const meta = {
  args: {
    username: "doubleedesign",
  },
};

export default meta;

export const StatsCard = {
  render: (args) => {
    const queryParams = new URLSearchParams(args).toString();
    const apiUrl = `http://localhost:9000/api/?${queryParams}`;

    // For debugging the source SVG
    fetch(apiUrl)
      .then((response) => {
        return response.text();
      })
      .then((svg) => {
        console.log(svg);
      });

    return `<img src="${apiUrl}" />`;
  },
};
