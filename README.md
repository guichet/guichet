# Guichet
Fresh frontend kit to start any project quickly with everything already configured (Directories, Sass, Gulp, etc.).

---

Why "*Guichet*" ? [Because](https://www.legifrance.gouv.fr/affichTexte.do;jsessionid=?cidTexte=JORFTEXT000029461191&dateTexte=&oldAction=dernierJO&categorieLien=id).

---

## How to setup ?

### Download

Thanks to SVN support on Github, we can use a SVN feature to quick download all the content of the `dist` directory without the versioning system and other useless files.

```bash
# Download
#  it will download the content of the `dist` directory into your current folder.
svn export --force https://github.com/KitaeAgency/guichet/trunk/dist/ ./

# Install
npm install
```

**Note:** If you have the [Two-Factor Authentication](https://help.github.com/articles/about-two-factor-authentication/) activated on your GitHub account, you may have to [create an access token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/) to use as password for SVN in CLI.

---

### Configure

You have a config file in `gulp/config.js` with default values but you can edit it with your own settings.  
We advise you to keep all the default values except `projectName`, `styles.vendor.files` and `scripts.vendor.files`.  
If your browser requirements are differents you can also change `styles.autoprefixers.browsers`.  

---

## How to use ?

Just run  

```bash
gulp
```

It will show you all the available tasks. The main task to run them all is `gulp all`.

---

## TODO

Moved to issue [#1](https://github.com/KitaeAgency/guichet/issues/1).
