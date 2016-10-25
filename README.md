# :bow: Guichet
Fresh frontend kit to start any project quickly with everything already configured (Directories, Sass, Gulp, etc.).

---

Why "*Guichet*" ? [Because](https://www.legifrance.gouv.fr/affichTexte.do;jsessionid=?cidTexte=JORFTEXT000029461191&dateTexte=&oldAction=dernierJO&categorieLien=id).

---

## :inbox_tray: How to setup ?

Just run the following command:

```bash
curl -s http://guichet.download/install | bash -s --
```

#### :small_blue_diamond: Arguments
You can add the following arguments for advanced setup or options :

- `--nomakedirs` — It will step the making of default folders _(sass, js, etc.)_
- `--svn` — It will set the right svn properties to your folders

**Note:** If you have the [Two-Factor Authentication](https://help.github.com/articles/about-two-factor-authentication/) activated on your GitHub account, you may have to [create an access token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/) to use as password for SVN in CLI.

---

### :wrench: Configure

You have a config file in `gulp/config.js` with default values but you can edit it with your own settings.  
We advise you to keep all the default values except `projectName`, `styles.vendor.files` and `scripts.vendor.files`.  
If your browser requirements are differents you can also change `styles.autoprefixers.browsers`.  

---

## :rocket: How to use ?

To list all available tasks, just run

```bash
gulp
```

To start the main task that will run them all then watch, run

```bash
gulp all --notify --silent
```

---

## :bangbang: Troubleshooting

If the script does not work, run manually the following commands:

```bash
# Download
#  it will download the content of the `dist` directory into your current folder.
svn export --force https://github.com/cvergne/guichet/trunk/dist/ ./

# Install
npm install
```

---

## :ballot_box_with_check: TODO

Moved to issue [#1](https://github.com/KitaeAgency/guichet/issues/1).
