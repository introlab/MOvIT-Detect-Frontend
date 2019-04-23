# MOvIT-Detect-Frontend

MOvIT-Detect-Frontend est la partie Frontend du projet MOvIT+, destiné a fonctionné sur un ordinateur embarqué de type Raspberry Pi zero w. La page web est conçu en React ce qui la rends flexible et rapide. Le serveur web est sous nodeJS. Le serveur une fois démarrer est accesible a l'adresse http://192.168.10.1:3000, si le point d'accèes du Raspberry Pi Zero w est utilisé, autrement, il faudra utilisé l'adresse DHCP assigné par le routeur.

# Mots de passe
   - Client: `user`
   - Clinicien: `admin`

# Installation
Pour gerer les dépendances, le gestionnaire de dépendances yarn est utiliser. La versiont 1.13.0 est la plus récente en date du 16 Janvier 2019. Il faut l'installer comme suit:
```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

Il faut ensuite installer la version nodeJS `9.10.0` ainsi que la vesrsion NPM `5.6.0` si ce n'est pas déja fait
```bash
curl -o node-v9.10.0-linux-armv6l.tar.gz https://nodejs.org/dist/v9.10.0/node-v9.10.0-linux-armv6l.tar.gz
tar -xzf node-v9.10.0-linux-armv6l.tar.gz
sudo cp -r node-v9.10.0-linux-armv6l/* /usr/local/
rm -r -f node-v9.10.0-linux-armv6l/ node-v9.10.0-linux-armv6l.tar.gz
```

Finalement il faut télécharger et installer MOvIT-Detect-Frontend
```bash
sudo apt-get install -y git
git clone https://github.com/introlab/MOvIT-Detect-Frontend.git
cd ~/MOvIT-Detect-Frontend/
git checkout develop
```
On démarre le serveur en utilisant le commande suivante a partir du dossier racine du projet:
```bash
npm start
```
Le serveur prends un certains temps (~6 minutes) a démarrer sur un Raspberry Pi zero w, c'est du a la compilation du projet avec WebPack a chaque démarrage. 



