

# MOvIT-Detect-Frontend

MOvIT-Detect-Frontend est la partie Frontend du projet MOvIT-Plus, destinée à fonctionner sur un ordinateur embarqué de type Raspberry Pi zero w. La page web est conçue en React, ce qui la rend flexible et rapide. Le serveur web est sous NodeJS, lancé avec Express et préparé avec Webpack. Le serveur, une fois démarré, est accesible à l'adresse [movit.plus], si le point d'accèes du Raspberry Pi Zero w est utilisé, autrement. Voir la section "[Accès à la page web](#accès-à-la-page-web)".
___
### Table des matières :

- **[Guide d'installation](#guide-dinstallation "Installation de NodeJS, Yarn, GitHub, du frontend et des modules")** 
- **[Guide d'utilisation](#guide-dutilisation "Utilisation de Yarn, de Webpack et des modes")**
- **[Interface Web](#interface-web "Accès à la page web et mot de passe")**
___



## Guide d'installation
#### Installation de NodeJS
Il faut débuter en installant NodeJS. Celui-ci devrait être déjà installé après avoir suivit les instuctions pour le Backend. Veuillez vous reférer à la sous-section "Installation de NodeJS" du [guide de la partie Backend du projet]

#### Installation de Yarn
Pour gérer les dépendances et les modules nécessaires à la préparation du frontend, le gestionnaire de dépendances yarn est utilisé. En date du 16 Octobre 2019, la version la plus récente (`1.17.3`) est fonctionnelle. Il faut l'installer comme suit ou visiter le [guide d'installation yarn] :
```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update -y #au besoin
sudo apt-get install yarn -y
```
#### Installation de GitHub
Si _git_ n'est pas installé, il faut exécuter cette commande : `sudo apt-get install -y git`

#### Installation du frontend
Pour installer le frontend, il faut simplement suivre la procédure habituelle avec GitHub :
```bash
git clone https://github.com/introlab/MOvIT-Detect-Frontend.git
cd ~/MOvIT-Detect-Frontend/
git checkout #(+la branche désirée, permet d'accéder aux versions de branches en développment)
```

#### Installation des modules
> L'installation de ces modules n'est pas nécessaire si le but est simplement de lancer la version déjà préparée

Pour lancer l'installation des modules qui sont déclarés dans le fichier package.json, il faut simplement faire la commande `yarn install`. Cette installation peut prendre un certain temps spécialement sur un RaspberryPi
___



## Guide d'utilisation

###### Notes sur les versions pre-bundled (déjà prête à utiliser)
La préparation avec _Webpack_ de la partie backend ayant pour but un serveur de type "production" peut prendre plus de 20 minutes sur un _RaspberryPi Zero_. C'est pourquoi il est fortement recommendé d'utiliser les versions pré-compilées du fichier "_bundle.js_" inclues dans ce répertoire GitHub ou de préparer vos propres versions sur un ordinateur plus rapide.
Si vous choisissez la deuxième option, il est possible de suivre le guide d'utilisation avec Webpack si-dessous et de copier le fichier à l'aide d'une adaptation de la commande :
`scp static/bundle.js pi@hostname-du-pi.local:/home/pi/MOvIT-Detect-Frontend/static/bundle.js`

#### Utilisation de Yarn et Webpack
Yarn, en plus de permettre l'installation simplifiée d'une vaste sélection de modules, permet l'éxecution de script simplifiant le lancement d'application avec certains paramètres. Ces scripts sont accessibles dans le fichier _package.json_ et ils peuvent être éxecuté simplement avec des commandes tels **`yarn nom-du-script`**. (voir [doc. de Yarn]) L'exécution de ces commandes doit être faite à même le dossier du projet.

Webpack est l'outil qui permet de joindre le code écrit pour le projet au code des dépendences et des modules nécessaires à son fonctionnement (voir [doc. de Webpack]). Webpack est lui même un module installé avec Yarn.


Les scripts présentement disponibles sont les suivants :
- **build** : Démarre la préparation du code à des fins de production sur un _RPi_. <sub><sup>(Utilise le fichier webpack.config.production.js)</sup></sub>
- **start** : Utilise les fichiers statiques disponibles pour lancer le serveur _Express_. <sub><sup>(Utilise le fichier server.production.js)</sup></sub>
- **dev** : Démarre un serveur de développement après avoir préparer le code. <sub><sup>(Utilise le fichier node server.js)</sup></sub>
- **devlocal** : Même chose que **_dev_** mais à des fins de test sur une autre machine. <sub><sup>(Utilise le fichier node server.js)</sup></sub>
  Autres : D'autres scripts utiles à des fins de développement sont aussi disponibles.<sub><sup>(voir package.json)</sup></sub>
> Le script `yarn start` est celui qui est appelé lors du démarrage des RaspberryPi préconfigurés.



###### Mode développement :
>Le mode développement (**dev**) pour le RaspberryPi prend environ 8 minutes à lancer, mais celui-ci propose notamment un serveur avec une fonction de "hot-reload" permettant de compiler uniquement les parties changées dans le code. Le mode développement **devlocal** utilise _localhost_ afin de l'utiliser sur une autre machine. Voir les scripts dans package.json et les fichiers correspondants pour plus de détails.

###### Mode production :
>La préparation en mode production (**build** -> lent sur une RaspberryPi) permet de créer le fichier bundle.js et les images nécessaires au lancement du serveur Express (**start**). Voir les scripts dans package.json et les fichiers correspondants pour plus de détails.

#### Démarrage du frontend
Le démarrage se fait donc avec **`yarn start`** dans un cas d'utilisation normal, mais celui-ci est géré avec un service (basé sur _systemd_) pour les systèmes préconfigurés. Le fichier qui constitue le service se trouve sous `/etc/systemd/system/movit_frontend.service`. Voir la documentation sur le [démarrage du RaspberryPi].
___

## Interface Web
#### Accès à la page web 
Sauf pour le mode développement, l'interface web est accessible en se connectant sur le point d'accès généré par le RaspberryPi (voir les [instructions de configuration réseau]) à l'addresse [movit.plus].
Il est aussi possible d'y accèder à l'aide de l'addresse [192.168.10.1].
Aussi, pour le mode **devlocal**, le host est simplement _localhost_ ou _0.0.0.0_ et le port est _3000_, d'où l'addresse pour y accèder à même la machine : [localhost:3000]

#### Mots de passe de la page web
Lors de l'ouverture d'une session sur sur la page web, il est possible de se connecter avec les mots de passe respectifs suivants.

| Utilisateur   | Mot de passe  |
| :-----------: |:-------------:|
| Client        | movit-user    |
| Clinicien     | movit-admin   |

>Si la connection est impossible avec les mots de passe fournis ci-haut, il y a de forte chances que la communication avec le backend ne fonctionne pas. Le backend doit être démarré pour naviguer l'interface!
___



[guide de la partie Backend du projet]:https://github.com/introlab/MOvIT-Detect-Backend/blob/master/README.md#installation-de-nodejs "MOvIT-Detect-Backend"

[guide d'installation yarn]: https://google.ca "Guide d'installation yarn"

[doc. de Webpack]:https://webpack.js.org/concepts/ "Documentation de Webpack"

[doc. de Yarn]:https://yarnpkg.com/en/docs "Documentation de Yarn"

[démarrage du RaspberryPi]:https://github.com/introlab/MOvITPlus/blob/master/docs/FR/InstallationLogiciel/DemarragePi.md#service-frontend "Service de démarrage du frontend"

[instructions de configuration réseau]:https://github.com/introlab/MOvITPlus/blob/master/docs/FR/InstallationLogiciel/ConfigurationReseau.md#access-point "Configuration du wi-fi, du point d'accès et du nom de domaine"

[movit.plus]:http://movit.plus "Addresse de l'interface en utilisant le point d'accès"

[192.168.10.1]:http://192.168.10.1 "Autre option d'addresse de l'interface en utilisant le point d'accès"

[localhost:3000]:http://localhost:3000 "Addresse de l'interface en utilisant le navigateur de la machine sur laquelle le serveur s'exécute"
