const meta = {
  title: "Stats Card",
  args: {
    username: "doubleedesign",
  },
};

export default meta;

export const StatsCard = {
  title: "Stats Card",
  render: (args) => {
    const queryParams = new URLSearchParams(args).toString();
    const apiUrl = `http://localhost:9000/api/?${queryParams}`;

    return `<img src="${apiUrl}" />`;
  },
};
