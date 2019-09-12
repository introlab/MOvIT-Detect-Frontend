# MOvIT-Detect-Frontend

MOvIT-Detect-Frontend est la partie Frontend du projet MOvIT+, destinée à fonctionner sur un ordinateur embarqué de type Raspberry Pi zero w. La page web est conçue en React ce qui la rend flexible et rapide. Le serveur web est sous nodeJS. Le serveur, une fois démarré, est accesible a l'adresse http://192.168.10.1:3000, si le point d'accèes du Raspberry Pi Zero w est utilisé, autrement, il faudra utilisé l'adresse DHCP assigné par le routeur.

# Mots de passe
   - Client: `user`
   - Clinicien: `admin`

# Installation
Pour gerer les dépendances, le gestionnaire de dépendances yarn est utilisé. La version 1.13.0 est la plus récente en date du 16 Janvier 2019. Il faut l'installer comme suit:
```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update -y && sudo apt-get install yarn -y
```

Il faut ensuite installer la version nodeJS `9.10.0` ainsi que la vesrsion NPM `5.6.0` si ce n'est pas déja fait
Voir la documentation de [MOvIT-Detect-Backend](https://github.com/introlab/MOvIT-Detect-Backend/blob/master/README.md)

Si `git` n'est pas installé :
```bash
sudo apt-get install -y git
```

Finalement il faut télécharger et installer MOvIT-Detect-Frontend
```bash
git clone https://github.com/introlab/MOvIT-Detect-Frontend.git
cd ~/MOvIT-Detect-Frontend/
git checkout (la branche désirée)
```
On compile MOvIT-Detect-Frontend:
```bash
npm install
```
On démarre le serveur en utilisant le commande suivante a partir du dossier racine du projet:
```bash
npm start
```
Le serveur prend un certain temps (~6 minutes) a démarrer sur un Raspberry Pi zero w. C'est dû à la compilation du projet avec WebPack a chaque démarrage. 



