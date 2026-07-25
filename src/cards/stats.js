// @ts-check
import { I18n } from "../common/I18n.js";
import { icons } from "../common/icons.js";
import {
  clampValue,
  flexLayout,
  kFormatter,
  measureText,
} from "../common/utils.js";
import { statCardLocales } from "../translations.js";

const CARD_MIN_WIDTH = 287;
const CARD_DEFAULT_WIDTH = 287;
const RANK_CARD_MIN_WIDTH = 420;
const RANK_CARD_DEFAULT_WIDTH = 450;

/**
 * Create a stats card text item.
 *
 * @param {object[]} createTextNodeParams Object that contains the createTextNode parameters.
 * @param {string} createTextNodeParams.label The label to display.
 * @param {string} createTextNodeParams.value The value to display.
 * @param {string} createTextNodeParams.id The id of the stat.
 * @param {number} createTextNodeParams.index The index of the stat.
 * @param {boolean} createTextNodeParams.showIcons Whether to show icons.
 * @param {number} createTextNodeParams.shiftValuePos Number of pixels the value has to be shifted to the right.
 * @returns
 */
const createTextNode = ({
  icon,
  label,
  value,
  id,
  index,
  showIcons,
  shiftValuePos,
}) => {
  const kValue = kFormatter(value);
  const staggerDelay = (index + 3) * 150;

  const labelOffset = showIcons ? `x="25"` : "";
  const iconSvg = showIcons
    ? `
    <svg data-testid="icon" class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
      ${icon}
    </svg>
  `
    : "";
  return `
    <g class="stagger" style="animation-delay: ${staggerDelay}ms" transform="translate(25, 0)">
      ${iconSvg}
      <text class="stat" ${labelOffset} y="12.5">${label}:</text>
      <text
        class="stat"
        x="${(showIcons ? 140 : 120) + shiftValuePos}"
        y="12.5"
        data-testid="${id}"
      >${kValue}</text>
    </g>
  `;
};

/**
 * Renders the stats card.
 *
 * @param {Partial<import('../fetchers/types').StatsData>} stats The stats data.
 * @param {Partial<import("./types").StatCardOptions>} options The card options.
 * @returns {string} The stats card SVG object.
 */
const renderStatsCard = (stats = {}, options = { hide: [] }) => {
  const {
    name,
    totalStars,
    totalCommits,
    totalIssues,
    totalPRs,
    contributedTo,
    rank,
  } = stats;
  const {
    hide = [],
    show_icons = false,
    card_width,
    hide_rank = false,
    include_all_commits = false,
    custom_title,
    locale,
    disable_animations = false,
  } = options;


  // returns theme based colors with proper overrides and defaults
  const { titleColor, iconColor, textColor, bgColor, borderColor, ringColor } =
    getCardColors({});

  const apostrophe = ["x", "s"].includes(name.slice(-1).toLocaleLowerCase())
    ? ""
    : "s";
  const i18n = new I18n({
    locale,
    translations: statCardLocales({ name, apostrophe }),
  });

  // Meta data for creating text nodes with createTextNode function
  const STATS = {
    stars: {
      icon: icons.star,
      label: i18n.t("statcard.totalstars"),
      value: totalStars,
      id: "stars",
    },
    commits: {
      icon: icons.commits,
      label: `${i18n.t("statcard.commits")}${
        include_all_commits ? "" : ` (${new Date().getFullYear()})`
      }`,
      value: totalCommits,
      id: "commits",
    },
    prs: {
      icon: icons.prs,
      label: i18n.t("statcard.prs"),
      value: totalPRs,
      id: "prs",
    },
    issues: {
      icon: icons.issues,
      label: i18n.t("statcard.issues"),
      value: totalIssues,
      id: "issues",
    },
    contribs: {
      icon: icons.contribs,
      label: i18n.t("statcard.contribs") + " (last year)",
      value: contributedTo,
      id: "contribs",
    },
  };

  const longLocales = [
    "cn",
    "es",
    "fr",
    "pt-br",
    "ru",
    "uk-ua",
    "id",
    "my",
    "pl",
    "de",
    "nl",
    "zh-tw",
  ];
  const isLongLocale = longLocales.includes(locale) === true;

  // filter out hidden stats defined by user & create the text nodes
  const statItems = Object.keys(STATS)
    .filter((key) => !hide.includes(key))
    .map((key, index) =>
      // create the text nodes, and pass index so that we can calculate the line spacing
      createTextNode({
        ...STATS[key],
        index,
        showIcons: show_icons,
        shiftValuePos: 79.01 + (isLongLocale ? 50 : 0),
      }),
    );

  // Calculate the card height depending on how many items there are
  // but if rank circle is visible clamp the minimum height to `150`
  let height = Math.max(
    45 + (statItems.length + 1) * 25,
    hide_rank ? 0 : 150,
  );

  // the better user's score the the rank will be closer to zero so
  // subtracting 100 to get the progress in 100%
  const progress = 100 - rank.score;

  const calculateTextWidth = () => {
    return measureText(custom_title ? custom_title : i18n.t("statcard.title"));
  };

  /*
    When hide_rank=true, the minimum card width is 270 px + the title length and padding.
    When hide_rank=false, the minimum card_width is 340 px + the icon width (if show_icons=true).
    Numbers are picked by looking at existing dimensions on production.
  */
  const iconWidth = show_icons ? 16 + /* padding */ 1 : 0;
  const minCardWidth =
    (hide_rank
      ? clampValue(
          50 /* padding */ + calculateTextWidth() * 2,
          CARD_MIN_WIDTH,
          Infinity,
        )
      : RANK_CARD_MIN_WIDTH) + iconWidth;
  const defaultCardWidth =
    (hide_rank ? CARD_DEFAULT_WIDTH : RANK_CARD_DEFAULT_WIDTH) + iconWidth;
  let width = isNaN(card_width) ? defaultCardWidth : card_width;
  if (width < minCardWidth) {
    width = minCardWidth;
  }

  const card = new Card({
    customTitle: custom_title,
    defaultTitle: i18n.t("statcard.title"),
    width,
    height,
  });

  const colors = getCardColors({});

  card.setCSS(`
    .description { font: 400 13px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${colors.text_color} }
    .stat { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${colors.text_color} }
    .icon { fill: ${colors.icon_color} }
    .badge { font: 600 11px 'Segoe UI', Ubuntu, Sans-Serif; }
    .badge rect { opacity: 0.2 }
  `);


  if (disable_animations) {card.disableAnimations();}

  /**
   * Calculates the right rank circle translation values such that the rank circle
   * keeps respecting the following padding:
   *
   * width > RANK_CARD_DEFAULT_WIDTH: The default right padding of 70 px will be used.
   * width < RANK_CARD_DEFAULT_WIDTH: The left and right padding will be enlarged
   *   equally from a certain minimum at RANK_CARD_MIN_WIDTH.
   *
   * @returns {number} - Rank circle translation value.
   */
  const calculateRankXTranslation = () => {
    const minXTranslation = RANK_CARD_MIN_WIDTH + iconWidth - 70;
    if (width > RANK_CARD_DEFAULT_WIDTH) {
      const xMaxExpansion = minXTranslation + (450 - minCardWidth) / 2;
      return xMaxExpansion + width - RANK_CARD_DEFAULT_WIDTH;
    } else {
      return minXTranslation + (width - minCardWidth) / 2;
    }
  };

  // Conditionally rendered elements
  const rankCircle = hide_rank
    ? ""
    : `<g data-testid="rank-circle" transform="translate(${calculateRankXTranslation()}, ${height / 2 - 50})">
        <circle class="rank-circle-rim" cx="-10" cy="8" r="40" />
        <circle class="rank-circle" cx="-10" cy="8" r="40" />
        <g class="rank-text">
          <text
            x="-5"
            y="3"
            alignment-baseline="central"
            dominant-baseline="central"
            text-anchor="middle"
          >
            ${rank.level}
          </text>
        </g>
      </g>`;

  // Accessibility Labels
  const labels = Object.keys(STATS)
    .filter((key) => !hide.includes(key))
    .map((key) => {
      if (key === "commits") {
        return `${i18n.t("statcard.commits")} ${
          include_all_commits ? "" : `in ${new Date().getFullYear()}`
        } : ${totalStars}`;
      }
      return `${STATS[key].label}: ${STATS[key].value}`;
    })
    .join(", ");

  card.setAccessibilityLabel({
    title: `${card.title}, Rank: ${rank.level}`,
    desc: labels,
  });

  return card.render(`
    ${rankCircle}
    <svg x="0" y="0">
      ${flexLayout({
        items: statItems,
        direction: "column",
      }).join("")}
    </svg>
  `);
};

export { renderStatsCard };
export default renderStatsCard;
