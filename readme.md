# GitHub Readme Stats (Refined)

This is a version of [GitHub Readme Stats by Anurag Hazra](https://github.com/anuraghazra/github-readme-stats) that I have stripped back and modified to meet my own needs.

Some parts have been entirely refactored (e.g., consolidating data fetching and processing from multiple files per type into one `Fetcher` class per type) or rewritten (e.g., using custom web components to generate the cards), others have been reused as-is or with minor modifications (e.g., the top languages algorithm, caching, API request implementation with retries, error handling, much of the donut and pie chart rendering logic); some have been removed (stats card, Wakatime card, themes, some card options/variations I don't intend to use).

The general design of the cards is based on the original, with some enhancements (e.g., language bar and listing multiple languages on repo cards; adding support for languages to Gist cards; line clamping of repo descriptions to ensure consistent height of cards; single colour scheme that _mostly_ works with both light and dark modes). I have also refactored everything to use TypeScript and added Storybook for local development and testing.

You are welcome to fork and use this project as you see fit, but support is not guaranteed. That said, I'd love to see what you do with it!

## Usage

The first thing you'll need to do after forking the repo is edit `src/constants.js` to set your GitHub username, and set any language or repository exclusions you want to apply.

Next, you'll need to grab a GitHub Personal Access Token (Classic) with `repo` and `read:user` scopes enabled, and add that to a `.env` file locally and in the relevant location in your production environment. See [Deployment](#deployment) for more information.

Documentation for the cards and options available is via Storybook when developing locally. See [Local Development](#local-development) for details on how to set this up.

### Language stats algorithm

> [!IMPORTANT]
> The Top Languages card currently looks at the content of public repositories that you own, including archives but not including forks, and excluding any languages and repositories specified in the `src/constants.js` file. It also merges specific languages into one count.
> To adjust what is counted and which languages get merged, you will need to adjust the GraphQL query and/or refinement methods in `src/fetchers/TopLanguagesFetcher.ts`.

The following algorithm is used to calculate the language percentages:

```js
ranking_index = (byte_count ^ size_weight) * (repo_count ^ count_weight)
```

Use the `algorithm` option to weight the language usage calculation: 

- `&algorithm=byte_count` - orders by number of bytes of code in a language; equivalent to `&size_weight=1&count_weight=0` in the original 
- `&algorithm=repo_count` - orders by number of repos the language is used in; equivalent to `&size_weight=0&count_weight=1` in the original
- `&algorithm=both` - Uses both byte and repo count, equivalent to `&size_weight=0.5&count_weight=0.5` in the original

[More details about the algorithm can be found here](https://github.com/anuraghazra/github-readme-stats/issues/1600#issuecomment-1046056305).

### Tweaking language stats for your repositories

You can tweak how GitHub itself calculates a repository's language breakdown by adding a `.gitattributes` file to the root of your repository and using [Linguist overrides](https://github.com/github-linguist/linguist/blob/main/docs/overrides.md). Note: This will affect your stats GitHub-wide.

To exclude files or directories because they are generated code (e.g., SCSS to CSS, TypeScript to compiled JS), vendor libraries, or documentation:

```gitattributes
dist/** linguist-generated
docs/** linguist-documentation
vendor/** linguist-vendored
```

You can also override the language that specific file types are interpreted as in that repo. For example, I have a repo where the Blade files contain very little PHP and are mostly HTML, so to treat them as the latter I use:

```gitattributes
*.blade.php linguist-language=HTML
```

And for some repos that use [Styled Components](https://styled-components.com/), I set those files to be interpreted as CSS like so:

```gitattributes
*.style.ts linguist-language=css
*.style.tsx linguist-language=css
```

## Deployment

### Node version

For built-in TypeScript support, Node 22.18.0 or newer is required.

### GitHub Personal Access Token (PAT)

For deploying your own instance of GitHub Readme Stats, you will need to create a GitHub Personal Access Token (PAT). Below are the steps to create one and the scopes you need to select for both classic and fine-grained tokens.

#### Classic token

* Go to [Account -> Settings -> Developer Settings -> Personal access tokens -> Tokens (classic)](https://github.com/settings/tokens).
* Click on `Generate new token -> Generate new token (classic)`.
* Scopes to select:
  * repo
  * read:user
* Click on `Generate token`, copy it, and paste it into your local `.env` file and in the relevant location in your production environment as `GITHUB_TOKEN`.

### To host on Vercel

<details>
<summary>Step-by-step guide on setting up your own Vercel instance</summary>

1.  Go to [vercel.com](https://vercel.com/).
2.  Click on `Log in`.
    ![](https://files.catbox.moe/pcxk33.png)
3.  Sign in with GitHub by pressing `Continue with GitHub`.
    ![](https://files.catbox.moe/b9oxey.png)
4.  Sign in to GitHub and allow access to all repositories if prompted.
5.  Fork this repo.
6.  Go back to your [Vercel dashboard](https://vercel.com/dashboard).
7.  To import a project, click the `Add New...` button and select the `Project` option.
    ![](https://files.catbox.moe/3n76fh.png)
8.  Click the `Continue with GitHub` button, search for the required Git Repository and import it by clicking the `Import` button. Alternatively, you can import a Third-Party Git Repository using the `Import Third-Party Git Repository ->` link at the bottom of the page.
    ![](https://files.catbox.moe/mg5p04.png)
9.  Create a Personal Access Token (PAT) as described in the [previous section](#first-step-get-your-personal-access-token-pat).
10. Add the PAT as an environment variable named `PAT_1` (as shown).
    ![](https://files.catbox.moe/0yclio.png)
11. Click deploy, and you're good to go. See your domains to use the API!

</details>

### On other platforms (untested for this version)

<details>
  <summary>General guide to other deployments</summary>

1.  Fork or clone this repo as per your needs
2.  Move `express` from the devDependencies to the dependencies section of `package.json`
    <https://github.com/anuraghazra/github-readme-stats/blob/ba7c2f8b55eac8452e479c8bd38b044d204d0424/package.json#L54-L61>
3.  Run `npm i` if needed (initial setup)
4.  Run `node express.ts` to start the server, or set the entry point to `express.ts` in `package.json` if you're deploying on a managed service
    <https://github.com/anuraghazra/github-readme-stats/blob/ba7c2f8b55eac8452e479c8bd38b044d204d0424/package.json#L11>
5.  You're done 🎉

</details>

> [!IMPORTANT]
> Remember to redeploy your instance after making any changes to the environment variables so that the updates take effect.

---
## Local Development

>[!IMPORTANT]
> To include your Gists and/or private repositories you don't own, you need to use a _classic_ personal access token (PAT) with all `repo` scopes enabled. Fine-grained access tokens won't work.

1. Clone the repo to your local machine
2. Run `npm install` in the repository root
3. Create `.env` file and update the token values
    ```dotenv
    NODE_ENV=development
    GITHUB_TOKEN=YOUR_TOKEN_HERE
    ```
4. Run `npm run server` to start the server in dev mode
5. Run `npm run storybook` to start Storybook in your default browser.

## Testing GraphQL queries

You can test GraphQL queries using a client such as [Hoppscotch](https://hoppscotch.io/).

You can use the same GitHub Personal Access Token that you use in the application. Go to the "Authorization" tab, select "Bearer" and paste it in there.

### Troubleshooting 
Connection error messages can be cryptic, such as `Invalid or incomplete introspection result. Ensure that you are passing "data" property of introspection response and no "errors" was returned alongside: undefined.` actually being caused by an invalid GitHub token. 

You can test if the issue is your token from your terminal:

```powershell
curl -X POST https://api.github.com/graphql -H "Authorization: Bearer YOUR_TOKEN_HERE" -H "Content-Type: application/json" -d '{"query":"{ viewer { login } }"}'
```