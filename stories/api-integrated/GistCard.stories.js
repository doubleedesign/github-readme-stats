const meta = {
  args: {
    username: "doubleedesign",
    id: "6ff3645f081ae219edbf5d5d2e7f3dd1",
  },
};

export default meta;

export const GistCard = {
  render: (args) => {
    const queryParams = new URLSearchParams(args).toString();
    const apiUrl = `http://localhost:9000/api/gist/?${queryParams}`;

    return `<img src="${apiUrl}" />`;
  },
};
