# GitHub Readme Stats (Refined)

This is a version of [GitHub Readme Stats by Anurag Hazra](https://github.com/anuraghazra/github-readme-stats) that I have stripped back and modified to meet my own needs. You are welcome to fork and use it as you see fit, but support is not guaranteed. That said, I'd love to see what you do with it!

> [!NOTE]
> The author of the original project recommends the successor project [GitHub Stats Extended](https://github.com/stats-organization/github-stats-extended).

## Usage

Documentation for the cards and options available is via Storybook when developing locally. See [Local Development](#local-development) for details on how to set this up.

### Language stats algorithm

We use the following algorithm to calculate the languages percentages on the language card:

```js
ranking_index = (byte_count ^ size_weight) * (repo_count ^ count_weight)
```

Use the `&size_weight=` and `&count_weight=` options to weight the language usage calculation. The values must be positive real numbers. [More details about the algorithm can be found here](https://github.com/anuraghazra/github-readme-stats/issues/1600#issuecomment-1046056305).

*   `&size_weight=1&count_weight=0` - Orders by byte count
*   `&size_weight=0.5&count_weight=0.5` - Uses both byte and repo count
*   `&size_weight=0&count_weight=1` - Orders by repo count

## Deployment

### GitHub Personal Access Token (PAT)

For deploying your own instance of GitHub Readme Stats, you will need to create a GitHub Personal Access Token (PAT). Below are the steps to create one and the scopes you need to select for both classic and fine-grained tokens.

Selecting the right scopes for your token is important in case you want to display private contributions on your cards.

#### Classic token

* Go to [Account -> Settings -> Developer Settings -> Personal access tokens -> Tokens (classic)](https://github.com/settings/tokens).
* Click on `Generate new token -> Generate new token (classic)`.
* Scopes to select:
  * repo
  * read:user
* Click on `Generate token` and copy it.

#### Fine-grained token

> [!WARNING]
> This limits the scope to issues in your repositories and includes only public commits.

1. Go to [Account -> Settings -> Developer Settings -> Personal access tokens -> Fine-grained tokens](https://github.com/settings/tokens).
2. Click on `Generate new token -> Generate new token`.
3. Select an expiration date
4. Select `All repositories`
5. Scopes to select in `Repository permission`:
  - Commit statuses: read-only
  - Contents: read-only
  - Issues: read-only
  - Metadata: read-only
  - Pull requests: read-only
6. Click on `Generate token` and copy it.

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