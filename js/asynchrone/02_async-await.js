/**
 * Le mot-clé 'async' peut être placé devant une déclaration de fonction pour en faire une
 * fonction asynchrone, c'est à dire une fonction qui retourne une promesse
 */
function syncFn() {
  return 42;
}
async function asyncFn(problem) {
  if (problem === true) throw "reason";
  return 42;
}
syncFn(); // retourne 42
asyncFn(); // retourne une promesse résolue par 42
asyncFn(true); // retourne une promesse rejetée avec la valeur de l'exception levée comme raison de l'échec

/**
 * Le mot-clé 'async' peut aussi être utilisé pour définir
 * une fonction asynchrone au sein d'une expression
 */
const asyncFn1 = async function () {
  setTimeout(() => {
    return 42;
  }, 2400);
};
const asyncFn2 = async () => {
  setTimeout(() => {
    return 23;
  }, 2400);
};

/**
 * Le mot-clé 'await' peut être utilisé au sein d'une fonction déclarée avec 'async' pour mettre en pause
 * l'exécution de son code le temps de la résolution de la promesse retournée par une fonction asynchrone,
 * le code situé en dehors de la fonction asynchrone peut quant à lui s'éxécuter pendant ce temps
 */
async function asyncFn3() {
  const result = await asyncFn2();
  // en cas de succès, 'result' vaut 23
  // en cas d'échec, 'await' lève une exception ayant pour valeur la raison du rejet
  console.log("Second!");
  return result + 24;
}
asyncFn3();
console.log("First!");
// First!
// Second!

/**
 * En cas d'échec de la promesse dont la résolution est attendue par 'await', une exception est levée et
 * transmise à la prochaine méthode 'catch' dans la chaîne des appels de fonctions asynchrones ou
 * au prochain bloc 'catch' d'une structure 'try'-'catch' classique
 */
asyncFn3()
  .then(result3 => {
    use(result3);
  })
  .catch(err => {
    handle(err);
  });
async function asyncFn3() {
  try {
    const result1 = await asyncFn1();
    return result1 + 24;
  } catch (err) {
    handle(err);
  }
}

/**
 * En l'absence du mot-clé 'await' et d'une méthode 'catch' directement rattachée à la promesse,
 * l'erreur ne peut pas être interceptée et un évènement 'unhandledrejection' est émis
 */
async function asyncFn() {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("error");
    }, 2400);
  });
}
// 'unhandled promise rejection'
asyncFn().catch(err => {
  wontBeExecuted();
});

async function asyncFn() {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("error");
    }, 2400);
  });
  // c'est l'exécution de l'instruction 'await', avant l'échec de la promesse,
  // qui permet de lever une erreur interceptée par le prochain 'catch'
  await promise;
}
asyncFn().catch(err => {
  willBeExecuted();
});
