# KubeSphere Dev Guide

This project uses [Hugo](https://gohugo.io/) and [Hugo theme learn](https://github.com/matcornic/hugo-theme-learn) to build the website. 

[![Netlify Status](https://api.netlify.com/api/v1/badges/1d4f2e02-aadc-4bab-a8d0-ec9f37293d07/deploy-status)](https://app.netlify.com/sites/kubesphere-dev-guide/deploys)

## Contribute

Contributions of any kind are welcome!

### Fork and clone the repository

1. Fork the repository.

2. Run the following commands to clone your fork and enter into it. Make sure you replace `<Your GitHub ID>` with your GitHub ID.

   ```bash
   git clone https://github.com/<Your GitHub ID>/dev-guide.git
   cd dev-guide
   ```

### Build and preview the website

You have to install [Hugo](https://gohugo.io/) to build the website in order to **preview it as static content**.

#### Install Hugo extended

Go to the [Hugo releases page](https://github.com/gohugoio/hugo/releases) and download the `hugo_extended` version that suits your OS (version 0.75+).

**EXTENDED version is MANDATORY to properly build the static content!**

Note: If you install Hugo on Windows, you need to add environment variables for the .exe file of Hugo. Run `hugo version` to check if the installation is successful.

### Running the website locally

After you install Hugo, run the following command:

```bash
# Launch KubeSphere extension development guide
hugo server --config extension-dev-guide.toml
```

or

```bash
# Launch KubeSphere development guide
hugo server --config dev-guide.toml
```

Now you can preview the website in your browser at `http://localhost:1313/`.

### Open a pull request

Open a [pull request (PR)](https://help.github.com/en/desktop/contributing-to-projects/creating-an-issue-or-pull-request#creating-a-new-pull-request) to contribute to our website. Use DCO sign-off when you submit a PR by running the command below (add `-s`):

```bash
git commit -s -m "xxx"
```

## Contributors

Thanks to all the wonderful contributors who continue to evolve KubeSphere within a great community.

<a href="https://github.com/kubesphere/dev-guide/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=kubesphere/dev-guide" />
</a>
