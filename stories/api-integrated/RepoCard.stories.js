const meta = {
  args: {
    username: 'doubleedesign',
    repo: 'fey-factor',
    show_owner: true,
    show_language: true,
    show_stars: true,
    show_forks: true,
    disable_animations: false
  },
}

export default meta;

export const RepoCard = {
  render: (args) => {
    const queryParams = new URLSearchParams(args).toString();
    const apiUrl = `http://localhost:9000/api/pin/?${queryParams}`;

    // For debugging the source SVG
    fetch(apiUrl).then((response => {
      return response.text();
    })).then((svg) => {
      console.log(svg);
    });

    return `<img src="${apiUrl}" />`;
  }
}