const meta = {
  title: "Top Languages",
  args: {
    username: 'doubleedesign'
  },
};
export default meta;


export const TopLanguages = {
  title: "Top Languages",
  render: (args) => {
    const container = document.createElement("div");
    container.innerHTML = "Loading...";

    const queryParams = new URLSearchParams(args).toString();
    const apiUrl = `http://localhost:9000/api/top-langs?${queryParams}`;

    fetch(apiUrl)
      .then((response) => response.text())
      .then((svg) => {
        container.innerHTML = svg;
      })
      .catch((error) => {
        console.error("Error fetching top languages:", error);
        container.innerHTML = "Error fetching top languages";
      });

    return container; // returned synchronously, populated later
  },
};
