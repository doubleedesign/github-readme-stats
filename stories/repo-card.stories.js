const meta = {
  title: "Repo Card",
  args: {
    username: 'doubleedesign',
    repo: 'fey-factor',
    theme: 'default',
    hide_border: false,
    show_owner: true,
    show_language: true,
    show_stars: true,
    show_forks: true,
    disable_animations: false
  },
}

export default meta;

export const RepoCard = {
  title: "Repo Card",
  render: (args) => {
    const queryParams = new URLSearchParams(args).toString();
    const apiUrl = `http://localhost:9000/api/pin/?${queryParams}`;

    return `<img src="${apiUrl}" />`;
  }
}