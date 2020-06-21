/**
 * Une promesse est un objet retourné par une fonction asynchrone
 * auquel on peut attacher des fonctions de rappel
 */
function asyncFn() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (ok) {
        resolve(); // succès
        return;
      }
      reject(); // échec
    }, 2400);
  });
}
const promise = asyncFn();
promise.then(successCb, failureCb);

/**
 * L'instance de 'Promise' possède une méthode 'then' qui renvoie elle-même une promesse,
 * ce qui permet de créer des chaînes de fonctions asynchrones, et une méthode 'catch'
 * qui est un raccourci pour 'then(null, failureCb)'
 */
asyncFn1()
  .then(result1 => asyncFn2(result1))
  .then(result2 => use(result2))
  .catch(failureCb);

/**
 * La valeur de retour de 'then' diffère selon le comportement de sa fonction de rappel :
 * - si elle retourne une valeur, 'then' retourne une promesse résolue par cette valeur
 * - si elle ne retourne rien, 'then' retourne une promesse résolue avec la valeur 'undefined'
 * - si elle lève une erreur, 'then' retourne une promesse rejetée
 * - si elle retourne une promesse déjà résolue, 'then' retourne une promesse résolue avec la même valeur
 * - si elle retourne une promesse déjà rejetée, 'then' retourne une promesse rejetée avec la même valeur
 * - si elle retourne une promesse en cours de traitement, 'then' retournera après son succès ou échec
 * une promesse résolue ou rejetée avec la même valeur
 */

// Ainsi, le fait de retourner une promesse dans la fonction de rappel de 'then' permet d'éviter les imbrications :
//! ne pas faire
asyncFn1().then(() => {
  asyncFn2().then(() => {
    asyncFn3().then(() => {});
  });
});
// mais plutôt
asyncFn1()
  .then(() => asyncFn2())
  .then(() => asyncFn3())
  .then(() => {});

/**
 * Il est possible de poursuivre la chaîne après un 'catch' pour éxécuter
 * des instructions à la suite de l'échec d'une fonction asynchrone
 */
asyncFn()
  .then(() => {
    throw new Error("Failure");
  })
  .catch(err => {
    console.log(err);
  })
  .then(() => {
    doSthWhatever();
  });

/**
 * Si une erreur survient, l'exécution se poursuit dans la fonction de rappel
 * du prochain 'catch' de la chaîne (ou prochain 'failureCb' de 'then')
 */
asyncFn()
  .then(() => {
    throw new Error();
  })
  .then(() => {
    wontBeExecuted();
  })
  .catch(err => {
    handle(err);
  });

/**
 * En l'absence de gestion des erreurs dans la chaîne, il est possible
 * de les traiter en écoutant l'évènement 'unhandledrejection'
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event
 */
window.addEventListener("unhandledrejection", event => {
  use(event.promise);
  use(event.reason);
});
process.on("unhandledrejection", event => {
  use(event.promise);
  use(event.reason);
});

/**
 * La méthode 'Promise.all' permet d'exécuter des fonctions asynchrones en parallèle
 *
 * Elle retourne une unique promesse qui sera résolue après le succès de l'ensemble des promesses
 * reçues en argument, avec comme valeur le tableau de leurs valeurs de résolution,
 * ou rejetée avec la valeur de rejet de la première promesse en échec
 */
Promise.all([asyncFn1, asyncFn2, asyncFn3]).then(results => {
  use(results);
});

/**
 * La méthode 'Promise.allSettled' retourne une promesse qui sera résolue après le succès ou
 * l'échec de l'ensemble des promesses, avec comme valeur un tableau composé d'objets
 * représentant les valeurs de résolution et les raisons de rejet
 */
Promise.allSettled([asyncFn1, asyncFn2, asyncFn3]).then(results => {
  for (const result of results) {
    if (result.status === "fulfilled") {
      use(result.value);
    } else if (result.status === "rejected") {
      use(result.reason);
    }
  }
});

/**
 * La méthode 'Promise.race' retourne une promesse qui sera résolue ou rejetée aussitôt
 * après le succès ou l'échec de l'une des promesses reçues en argument
 */
Promise.race([asyncFn1, asyncFn2, asyncFn3]).then(firstResult => {
  use(firstResult);
});
