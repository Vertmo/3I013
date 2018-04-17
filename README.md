# UE 3I013 : Projet SuperViseur #
Ce repository contient l'ensemble de mon travail durant l'UE 3I013 : Projet Recherche, sur le projet Superviseur.

## Contenu ##
Les codes javascripts sont contenus dans le dossier `/js`

Le dossier `/pages` contient les différentes pages du site (bien sur le fichier `index.html`) contenu a la racine du repo joue le role de point d'entrée.

Le dossier `/docs` contient :
* **bibliographie.bib** : La bibliographie qui sera commune a tous les futurs documents rédigés en LaTeX au cours du projet
* **comprehension.tex** : Le document résumant ma compréhension du problème, premier rendu demandé par l'UE
* **rapport.tex** : Le rapport à rendre à la fin du projet (en cours de réalisation)

## Deploiement ##
Le repo ne contient que les sources du projet. Il est donc nécessaire de compiler les fichiers *.tex* pour pouvoir lire les PDFs produits confortablement. Compiler *comprehension.tex* en pdf : `pdflatex comprehension` puis `bibtex comprehension` puis `pdflatex comprehension` puis encore `pdflatex comprehension`. Malheureusement l'utilisation de bibtex rends cette procédure un peu longue.


Le site peut être visité sur [https://vertmo.github.io/SuperViseur/](https://vertmo.github.io/SuperViseur/). (il s'agit de la dernière version de la branche master).

## Licence ##
Ce projet est sous licence GNU GPL3.0 - détails dans [LICENSE.md](LICENSE.md)

## Reconnaissance ##
Les bibliothèques de fonctionnalités suivantes ont été utilisées :
* [https://jquery.com/](jQuery)
* [https://semantic-ui.com/](Semantic UI) et [https://tyleryasaka.github.io/semantic-ui-range/](semantic-ui-range)
* [http://svgjs.com/](SVG.js)
* [http://www.chartjs.org/](Chart.js)
