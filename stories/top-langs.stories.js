const meta = {
  title: "Top Languages Card",
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


export const TopLanguagesCard = {
  title: "Top Languages Card",
  render: (args) => {
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

    return `<img src="${apiUrl}" />`;
  },
};
