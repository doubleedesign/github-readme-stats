const meta = {
  title: "Top Languages",
  args: {
    username: 'doubleedesign',
    exclude_repo: '',
    langs_count: 10,
    layout: 'compact',
    card_width: 300,
    disable_animations: false,
    hide: 'shell,blade,hack',
    algorithm: 'byte_count'
  },
  argTypes: {
    custom_title: {
      control: { type: 'text' }
    },
    layout: {
      control: { type: 'select' },
      options: ['normal', 'compact', 'donut', 'donut-vertical', 'pie']
    },
    algorithm: {
      control: { type: 'select' },
      options: ['byte_count', 'repo_count', 'both']
    }
  }
};
export default meta;


export const TopLanguages = {
  title: "Top Languages",
  render: (args) => {
    const container = document.createElement("div");
    container.innerHTML = "Loading...";

    let algorithmParams = {};
    switch (args.algorithm) {
      case 'byte_count':
        algorithmParams = {
          size_weight: 1,
          count_weight: 0
        }
        break;
      case 'repo_count':
        algorithmParams = {
          size_weight: 0,
          count_weight: 1,
        };
        break;
      default:
        algorithmParams = {
          size_weight: 0.5,
          count_weight: 0.5,
        };
        break;
    }

    const queryParams = new URLSearchParams({...args, ...algorithmParams}).toString();
    const apiUrl = `http://localhost:9000/api/top-langs?${queryParams}`;

    console.log('Top languages query URL:', apiUrl)

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
