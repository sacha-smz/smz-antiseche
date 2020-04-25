# HEAD référence vers le dernier commit de la branche courante
# staging area : fichiers ajoutés à l'index, i.e. pris en compte par git pour le prochain commit

# fichier .gitignore: liste les fichiers à ignorer
# path/to/dir/* pour ignorer le contenu d'un répertoire

# configuration de l’utilisateur
git config --global user.name "John Doe"
git config --global user.email "johndoe@example.com"
# afficher la configuration actuelle
git config --list

# Initialisation du dépôt
git init

# ajouter un  fichier à l’index, mettre à jour un fichier dans l'index
git add file.ext
# ajouter tous les fichiers à l’index
git add .
git add -A
# annuler les modifications du fichier avant son ajout à l'index
git checkout -- file.ext
# annuler toutes les modifications
git checkout -- .
# retirer un fichier de l'index et le supprimer du répertoire de travail
git rm file.ext
# retirer un fichier de l'index sans le supprimer
git rm --cached file.ext
# afficher les différence entre le dernier commit et le répertoire de travail
git diff
# afficher les différences entre le dernier commit et l'index
git diff --cached
# enregistrer les modifications
git commit -m "description"
# mettre à jour l’index (add) et enregistrer les modifications
git commit -a
# modifier uniquement la description du dernier commit
git commit –-amend -m "description"
# intégrer les nouveaux ajouts au dernier commit, sans en modifier le message
git commit –-amend –no-edit

# remiser les modifications -> status “nothing to commit”	
git stash
# rappelle les modifications mises de côté sans en conserver la mémoire
git stash pop
# appliquer les dernières modifications remisées, elle sont conservées en mémoire et peuvent être appliquées à nouveau
git stash apply
# afficher la liste des remises	
git stash list
# appliquer la nième dernière remise
git stash apply stash@{n}

# afficher l’état des modifications prises en compte pour le prochain commit (staging area)
git status
# afficher l’historique des commits, du plus récent au plus ancien
git log
# afficher tout l’historique, y compris les actions locales (amend, reset, etc.)
git reflog
# revenir à un état précédent
# un commit peut être identifié par son hash (les 8 premiers caractères suffisent)
git checkout commit
# afficher les modifications apportées par un commit
git show commit
# afficher le détail des lignes modifiées et les auteurs des modifications
git blame file

# afficher la liste des branches locales, la branche courante apparaît avec une astérisque
git branch
# afficher la liste de toutes les branches, locales et distantes
git branch -a
# créer une nouvelle branche
git branch nom-branche
# changer de branche, ou revenir à l'état courant de la branche
git checkout nom-branche
# créer une nouvelle branche et y accéder
git checkout -b nom-branche
# supprimer une branche
git branch -d nom-branche
# délier la branche distante
git branch --unset-upstream
# forcer la suppression si des changements ont eu lieu dans la branche
git branch -D nom-branche

# fusionner les modifications apportées par une branche dans la branche courante, crée un nouveau commit
# résolution de conflits nécessaire si des modifications ont été enregistrées sur les mêmes fichiers dans les 2 branches
# https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging
git merge nom-branche
# lancer un outil de résolution des conflits
git mergetool

# créer un nouveau commit qui annule les modifications du commit spécifié
git revert commit
# se placer sur le commit spécifié sans rien supprimer :
# l'index reste inchangé, les fichiers non indexés également
git reset --soft commit
# réinitialiser l'index au commit spécifié et conserver les modifications postérieures,
# les fichiers précédemment indexés sont conservés dans le répertoire de travail au côtés des non indexés
git reset --mixed commit
# réinitialiser la branche courante au commit spécifié et supprimer toutes les modifications postérieures
git reset --hard commit
# supprimer le dernier commit de la branche courante
git reset --hard HEAD^

# créer un nouveau commit qui reproduit les modifications d’un autre
git cherry-pick commit

# redéfinir le point de bifurcation de la branche courante à l'extrêmité de la branche spécifiée
# les modifications survenues sur la branche cible sont prises en compte dans la branche courante (alternative à merge)
# aucun effet s'il n'y pas pas eu sur la branche cible de commits postérieurs à la bifurcation
git rebase nom-branche
# https://git-scm.com/book/fr/v2/Les-branches-avec-Git-Rebaser-Rebasing

# rebasage interactif, réécriture de l’historique postérieur au commit spécifié
# possibilité de réordonner les commits selon l’ordre des lignes pick hash msg,
# de supprimer des commits avec drop, d’en regrouper avec squash, de modifier le message avec edit
git rebase -i commit
# crée un message "fixup!commit"
git commit --fixup=commit
# les commits dont le message commence par "fixup!commit" ou "squash!commit"
# sont marqués squash et placés juste après le commit auquel ils doivent être intégrés
git rebase -i --autosquash commit

# cloner un dépôt distant
git clone url
# renseigner un dépôt distant (origin est le nom par défaut d'un dépôt cloné)
git remote add nom-repo url
# récupérer les modifications du dépôt distant sans les fusionner
git fetch
# indiquer la branche distante à lier à la branche courante
git branch --set-upstream-to nom-repo/nom-branche
git branch -u nom-repo/nom-branche
# envoyer les modifications locales sur la branche distante
git push
# lier la branche distante lors du premier push
git push -u nom-repo nom-branche
# envoyer les modifications locales sur la branche distante spécifiée (elle sera créée si elle n'existe pas)
git push nom-repo nom-branche
# supprimer une branche distante
git push nom-repo --delete nom-branche
# récupérer et fusionner les modifications de la branche distante, équivaut à git fetch puis git merge
git pull
# récupérer et fusionner les modifications de la branche distante spécifiée
git pull nom-repo nom-branche

# rechercher le commit à l’origine d’un dysfonctionnement
# on indique le commit sur lequel on a identifié le bug et un commit qui ne le présentait pas
# Git va rappeler l’état de chaque commit pour que l’on puisse vérifier la présence ou non du bug
# si le bug est présent, on renseigne git bisect bad, sinon git bisect good
# Git indique alors le commit responsable de l’apparition du bug
git bisect start commit_bad commit_good

# ajouter un autre dépôt au sein du dépôt courant
git submodule add url path

# GitHub
# [T] permet d'activer la recherche de fichiers avec auto-complétion
# fork crée à partir d'un projet existant un repository identique dans son propre compte,
# on peut ensuite créer une branche personnelle, faire un push de ses modifications,
# puis une pull request pour demander l'intégration des changements

# Sourcetree pour utiliser une GUI plutôt que le terminal
# https://www.sourcetreeapp.com/