

# MOvIT-Detect-Frontend

MOvIT-Detect-Frontend est la partie Frontend du projet MOvIT-Plus, destinée à fonctionner sur un ordinateur embarqué de type Raspberry Pi. La page web est conçue en React, ce qui la rend flexible et rapide. Le serveur web est sous NodeJS, lancé avec Express et préparé avec Webpack. Le serveur, une fois démarré, est accesible à l'adresse [movit.plus], si le point d'accèes du Raspberry Pi est utilisé, autrement. Voir la section "[Accès à la page web](#accès-à-la-page-web)".
___
## Table des matières :
- [MOvIT-Detect-Frontend](#movit-detect-frontend)
  - [Table des matières :](#table-des-mati%c3%a8res)
- [1. Guide d'installation](#1-guide-dinstallation)
    - [1.1. Installation de NodeJS](#11-installation-de-nodejs)
    - [1.2. Installation de Yarn](#12-installation-de-yarn)
    - [1.3. Installation de GitHub](#13-installation-de-github)
    - [1.4. Installation du frontend](#14-installation-du-frontend)
    - [1.5. Installation des modules](#15-installation-des-modules)
- [2. Guide d'utilisation](#2-guide-dutilisation)
        - [Notes sur les versions pre-bundled (déjà prête à utiliser)](#notes-sur-les-versions-pre-bundled-d%c3%a9j%c3%a0-pr%c3%aate-%c3%a0-utiliser)
    - [2.1. Utilisation de Yarn et Webpack](#21-utilisation-de-yarn-et-webpack)
        - [Mode développement :](#mode-d%c3%a9veloppement)
        - [Mode production :](#mode-production)
    - [2.2. Démarrage du frontend](#22-d%c3%a9marrage-du-frontend)
- [3. Interface Web](#3-interface-web)
    - [3.1. Accès à la page web](#31-acc%c3%a8s-%c3%a0-la-page-web)
    - [3.2. Mots de passe de la page web](#32-mots-de-passe-de-la-page-web)
___

<br>
<br>

# 1. Guide d'installation
### 1.1. Installation de NodeJS
Il faut débuter en installant NodeJS. Celui-ci devrait être déjà installé après avoir suivit les instuctions pour le Backend. Veuillez vous reférer à la sous-section "Installation de NodeJS" du [guide de la partie Backend du projet]

### 1.2. Installation de Yarn
Pour gérer les dépendances et les modules nécessaires à la préparation du frontend, le gestionnaire de dépendances yarn est utilisé. Il faut l'installer comme suit ou visiter le [guide d'installation yarn] :
```bash
sudo wget -qO- https://deb.nodesource.com/setup_10.x | sudo bash -
sudo apt-get update && sudo DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs yarn
```

### 1.3. Installation de GitHub
Si _git_ n'est pas installé, il faut exécuter cette commande : `sudo apt-get install -y git`

### 1.4. Installation du frontend

```bash
# Ici nous avions déjà fait un clone du projet complet
cd ~/MOvITPlus/MOvIT-Detect-Frontend/

```

### 1.5. Installation des modules
Pour lancer l'installation des modules qui sont déclarés dans le fichier package.json, il faut simplement faire la commande suivante :
```bash
yarn install
yarn build
```
Cette installation peut prendre un certain temps spécialement sur un RaspberryPi

___



# 2. Guide d'utilisation

##### Notes sur les versions pre-bundled (déjà prête à utiliser)
La préparation avec _Webpack_ de la partie backend ayant pour but un serveur de type "production" peut prendre plus de 20 minutes sur un _RaspberryPi Zero_. C'est pourquoi il est fortement recommendé d'utiliser les versions pré-compilées du fichier "_bundle.js_" inclues dans ce répertoire GitHub ou de préparer vos propres versions sur un ordinateur plus rapide.
Si vous choisissez la deuxième option, il est possible de suivre le guide d'utilisation avec Webpack si-dessous et de copier le fichier à l'aide d'une adaptation de la commande :
`scp static/bundle.js pi@hostname-du-pi.local:/home/pi/MOvIT-Detect-Frontend/static/bundle.js`

### 2.1. Utilisation de Yarn et Webpack
Yarn, en plus de permettre l'installation simplifiée d'une vaste sélection de modules, permet l'éxecution de script simplifiant le lancement d'application avec certains paramètres. Ces scripts sont accessibles dans le fichier _package.json_ et ils peuvent être éxecuté simplement avec des commandes tels **`yarn nom-du-script`**. (voir [doc. de Yarn]) L'exécution de ces commandes doit être faite à même le dossier du projet.

Webpack est l'outil qui permet de joindre le code écrit pour le projet au code des dépendences et des modules nécessaires à son fonctionnement (voir [doc. de Webpack]). Webpack est lui même un module installé avec Yarn.


Les scripts présentement disponibles sont les suivants :
- **build** : Démarre la préparation du code à des fins de production sur un _RPi_. <sub><sup>(Utilise le fichier webpack.config.production.js)</sup></sub>
- **start** : Utilise les fichiers statiques disponibles pour lancer le serveur _Express_. <sub><sup>(Utilise le fichier server.production.js)</sup></sub>
- **dev** : Démarre un serveur de développement après avoir préparer le code. <sub><sup>(Utilise le fichier node server.js)</sup></sub>
- **devlocal** : Même chose que **_dev_** mais à des fins de test sur une autre machine. <sub><sup>(Utilise le fichier node server.js)</sup></sub>
- **buildlocal** : Prépare le code pour à des fins de test sur une autre machine. <sub><sup>(Utilise le fichier webpack.config.production.js)</sup></sub>
- **startlocal** : Lance le code préparé avec **_buildlocal_** <sub><sup>(Utilise le fichier server.production.js)</sup></sub>
- Autres : D'autres scripts utiles à des fins de développement sont aussi disponibles.<sub><sup>(voir package.json)</sup></sub>

> Le script `yarn start` est celui qui est appelé lors du démarrage des RaspberryPi configurés correctement.

##### Mode développement :
Le mode développement (**dev**) pour le RaspberryPi prend environ 8 minutes à lancer, mais celui-ci propose notamment un serveur avec une fonction de "hot-reload" permettant de compiler uniquement les parties changées dans le code. Le mode développement **devlocal** utilise _localhost_ afin de l'utiliser sur une autre machine. Voir les scripts dans package.json et les fichiers correspondants pour plus de détails.

> Le lancement du frontend en mode dévelopmment nécessite l'installation des modules avec Yarn sans l'argument `--production`. Dans les images préconfigurés, il faudra donc relancer l'installation avec `yarn install --ignore-optional --network-timeout 1000000`

##### Mode production :
La préparation en mode production (**build**) permet de créer le fichier bundle.js et les images nécessaires au lancement du serveur Express (**start**). Voir les scripts dans package.json et les fichiers correspondants pour plus de détails.

> La préparation de bundle.js est très lente sur un RaspberryPi, soit environ 20 minutes. Cette préparation peut être faite sur un autre ordinateur plus rapide.


### 2.2. Démarrage du frontend
Le démarrage se fait donc avec **`yarn start`** dans un cas d'utilisation normal, mais celui-ci est géré avec un service (basé sur _systemd_) pour les systèmes préconfigurés. Le fichier qui constitue le service se trouve sous `/etc/systemd/system/movit_frontend.service`. Voir la documentation sur le [démarrage du RaspberryPi].
___

# 3. Interface Web
### 3.1. Accès à la page web 
Sauf pour le mode développement, l'interface web est accessible en se connectant sur le point d'accès généré par le RaspberryPi (voir les [instructions de configuration réseau]) à l'addresse [movit.plus].
Il est aussi possible d'y accèder à l'aide de l'addresse [192.168.10.1].
Aussi, pour le mode **devlocal**, le host est simplement _localhost_ ou _0.0.0.0_ et le port est _3000_, d'où l'addresse pour y accèder à même la machine : [localhost:3000]

### 3.2. Mots de passe de la page web
Lors de l'ouverture d'une session sur sur la page web, il est possible de se connecter avec les mots de passe respectifs suivants.

| Utilisateur   | Mot de passe  |
| :-----------: |:-------------:|
| Client        | movit-user    |
| Clinicien     | movit-admin   |

>Si la connection est impossible avec les mots de passe fournis ci-haut, il y a de forte chances que la communication avec le backend ne fonctionne pas. Le backend doit être démarré pour naviguer l'interface!
___

# 4. Exécuter le code dans vscode sous Windows 

Faire ces étapes: 
npm install
npm i cross-env
Aller dans le dossier : none_modules\chart\dist 
Changer le nom du dossier "dist" pour "src". 
Aller dans none_modules\chart\src
Changer le nom du fichier "Chart.js" pour "chart.js"
Aller dans package.json et exécuter les scripts : build_windows et dev_windows


[guide de la partie Backend du projet]:https://github.com/introlab/MOvIT-Detect-Backend/blob/master/README.md#installation-de-nodejs "MOvIT-Detect-Backend"

[guide d'installation yarn]: https://google.ca "Guide d'installation yarn"

[doc. de Webpack]:https://webpack.js.org/concepts/ "Documentation de Webpack"

[doc. de Yarn]:https://yarnpkg.com/en/docs "Documentation de Yarn"

[yarn issue]:https://github.com/yarnpkg/yarn/issues/4890 "Yarn issue"

[démarrage du RaspberryPi]:https://github.com/introlab/MOvITPlus/blob/master/docs/FR/InstallationLogiciel/DemarragePi.md#service-frontend "Service de démarrage du frontend"

[instructions de configuration réseau]:https://github.com/introlab/MOvITPlus/blob/master/docs/FR/InstallationLogiciel/ConfigurationReseau.md#access-point "Configuration du wi-fi, du point d'accès et du nom de domaine"

[movit.plus]:http://movit.plus "Addresse de l'interface en utilisant le point d'accès"

[192.168.10.1]:http://192.168.10.1 "Autre option d'addresse de l'interface en utilisant le point d'accès"

[localhost:3000]:http://localhost:3000 "Addresse de l'interface en utilisant le navigateur de la machine sur laquelle le serveur s'exécute"
