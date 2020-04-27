/*
  Composant pur fonctionnel
  Défini à l'aide d’une simple fonction
  Idéalement, il renvoie toujours la même chose, pour les mêmes arguments, sans effet de bord
  Facile à tester, à privilégier, représente généralement 90% des composants dans une application
*/
function Composant() {
  return React.createElement("tag", { prop1: val1, prop2: val2 }, contenu);
}
/* JSX */
function Composant() {
  return (
    <tag prop1={val1} prop2="val2">
      Contenu
    </tag>
  );
}

/*
  Rendu des composants
  ReactDOM.render(element, container, callback);
  avec element sous la forme React.createElement(Composant) ou <Composant />
*/

/* exemple de JSX avec paramètres */
function Composant(props) {
  // décomposition de l’objet passé en argument, correspondant à l’ensemble des attributs
  const { prop1, prop2 } = props;

  if (prop2) doSth();

  return <tag>Contenu {prop1}</tag>;
}
ReactDOM.render(
  <>
    <Composant prop1="val" prop2 /> {/* une prop sans valeur vaut true par défaut */}
    <Composant />
  </>,
  document.getElementById("root")
);
/*
  Un élément correspond à une balise racine et son contenu, pour éviter d’utiliser des balises sans rôle sémantique,
  on peut utiliser comme racine <Fragment>…</Fragment>, <>…</> en notation courte.
*/
/*
  JSX 
  La valeur des props peut être uniquement de type string ou une expression JSX entre accolades (ex : step={1})
  Les valeurs true, false, null et undefined sont ignorées au rendu
  Pas de mots-clés javascript pour les noms des props -> className en remplacement de class, htmlFor pour for
  Les commentaires doivent se trouver à l’intérieur d’accolades {// comment}
  Les éléments dont le nom commence par une minuscule sont traités comme un élément natif, on utilise une majuscule pour les composants React
  On peut utiliser condition && expression, ou encore l’opérateur ternaire, pour faire de l’affichage conditionnel.
  Une expression JSX peut contenir un tableau d’éléments, chaque élément doit comporter un attribut key,
  identifiant unique de l’élément (éviter d’utiliser l’indice qui peut changer si des éléments sont ajoutés, supprimés ou réarrangés)
  dangerouslySetInnerHTML : insertion d’HTML non échappé via un objet { __html: "html string" }
*/

/*
  Props
  Passées de composant parent vers composant enfant
  Lecture seule
  key : identifiant unique des éléments d’un tableau
  children : contient les éléments enfants du composant
*/
// Définition des valeurs par défaut des props d’un composant
Composant.defaultProps = {
  prop1: val1,
  prop2: val2
};
class Composant extends React.Component {
  static defaultProps = {
    prop1: val1,
    prop2: val2
  };
}
/*
  PropTypes
  https://fr.reactjs.org/docs/typechecking-with-proptypes.html
  Définition des types attendus pour les props d’un composant, module prop-types à installer
  Outil à destination des développeurs, ignoré lors du build
*/
import PropTypes from "prop-types";
Composant.propTypes = {
  nom: PropTypes.type.isRequired
};
/*
  Types :
  .array, .bool, .func, .number, .object, .string, .symbol, .node, .element, .elementType,
  .instanceOf(Classe)
  .oneOf( [val1, val2] )
  .oneOfType( [PropTypes.type1, PropTypes.type2] )
  .arrayOf(type), .objectOf(type)
  .shape({
    key1: type,
    key2; type
  })
*/

/* validateur personnalisé : une fonction qui renvoie un objet Error */
Composant.propTypes = {
  nom: () => {
    if (condition) {
      return new Error(str);
    }
  }
};

/*
  Binding de this
  Par défaut, lorsque l'on utilise dans une expression une référence à une méthode de classe définie avec function nom(){…} ou nom(){…},
  elle n’accède pas à l’instance via this
  Solutions :
    - bind explicite dans le constructeur :
    this.method = this.method.bind(this);
    - declaration sous forme nom = () => {…};
    - décorateur @autobind placé au-dessus de la déclaration function nom(){} ou nom(){}
*/

/*
  Etat local
  Propriété state à l’intérieur d’un composant qui contient les données persistantes d’un rendu à l’autre,
  ou dont le changement doit entraîner un nouveau rendu
  Uniquement accessible au composant lui-même, mais pas depuis un parent ni depuis un enfant
*/
class Composant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nom1: val1,
      nom2: val2
    };
  }
}
/* Ou via un initialiseur de champ, synthaxe ES2018, state = {…}; en dehors du constructeur */

/*
  Mise à jour de l’état local, fonction asynchrone, this.state sera réellement modifié plus tard dans le cycle de vie de l’objet
  prevState correspond à l’état local à jour, tenant compte des dernières modifications demandées via setState
  http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/
*/
this.setState({ nom1: newVal, nom2: newVal });
this.setState((prevState, props) => {
  return { nom1: newVal, nom2: newVal };
});

/* Le state remonte, les props descendent */

/*
  Contexte
  https://fr.reactjs.org/docs/context.html
  Données accessibles à tous les composants de l’arborescence, c’est-à-dire le composant qui définit le contexte et tous ses enfants
  La définition de la propriété contextType dans le composant enfant permet d’accéder à la valeur du contexte via this.context
*/
const NamedContext = React.createContext(defaultVal);
class Parent extends React.Component {
  render() {
    return (
      <NamedContext.Provider value={val}>
        <Child />
      </NamedContext.Provider>
    );
  }
}
function Child(props) {
  return (
    <>
      <GrandChild />
    </>
  );
}
class GrandChild extends React.Component {
  static contextType = NamedContext;
  render() {
    /* utilisation de this.context */
  }
}

/*
  Formulaires

  Champs contrôlés, par exemple pour formater la saisie :
    dotés des props value (ou checked) et onChange
    on accède à la valeur de l’input à l’intérieur de la fonction de rappel affectée à onChange,
    qui reçoit l’évènement en paramètre (via event.target.value)
    en l’absence d’onChange, le champ est en lecture seule

  Champs non contrôlés :
    on utilise la prop ref pour accéder à la valeur (via ref.current.value)
    prop defaultValue (ou defaultChecked) pour fixer la valeur par défaut
    librairie Formik pour faciliter l’accès aux valeurs, la validation des champs, les messages d’erreur, et la soumission du formulaire
*/

/*
  Hooks
  
  Les hooks sont des fonctions qui permettent d'utiliser davantage de fonctionnalités React
  au sein des composants purs fonctionnels (notamment l'interaction avec le cycle de vie)

  Les hooks doivent être appelés à l'intérieur d'un composant fonctionnel, ou d'un hook personnalisé, et
  uniquement au niveau racine (i.e. pas à l'intérieur d'une boucle, ni d'un bloc conditionnel ou autre)

  Un hook personnalisé est simplement une fonction qui fait appel à un autre hook, préfixée use par convention

  plugin ESLint pour veiller au respect des conventions, inclus par défaut dans un projet create-react-app
  https://www.npmjs.com/package/eslint-plugin-react-hooks
  npm install eslint-plugin-react-hooks --save-dev
  {
    plugins: [
      // ...
      "react-hooks"
    ],
    rules: {
      // ...
      "react-hooks/rules-of-hooks": "error", // Vérifie les règles des Hooks
      "react-hooks/exhaustive-deps": "warn" // Vérifie les tableaux de dépendances
    }
  }
*/
// hook d'état
import React, { useState } from "react";

function Composant() {
  /*
    useState() renvoie une paire de valeurs correspondant à l'état actuel et une fonction pour le modifier
    Au premier appel, l'état est initialisé à la valeur passée en argument
    L'état n'est pas obligatoirement un objet (vs. this.state dans une classe)
    Contrairement à this.setState({}) à l'intérieur d'une classe, la fonction modificatrice ne fait pas une simple mise à jour,
    elle remplace l'état par la nouvelle valeur renseignée, c'est pourquoi il peut être intéressant d'appeler plusieurs fois useState
    pour les différents éléments de l'état local susceptibles d'être mis à jour
  */
  const [stateKey1, setStateKey1] = useState(initialValue1);
  const [stateKey2, setStateKey2] = useState(initialValue2);

  return (
    <div>
      <button onClick={() => setStateKey1(modifier(stateKey1))}></button>
    </div>
  );
}

// hook d'effet
import React, { useState, useEffect } from "react";

function Composant() {
  const [stateKey, setStateKey] = useState(initialValue);
  /*
    Gestion des effets de bord :
    Les instructions contenues dans useEffect() sont exécutées après chaque affichage du composant (componentDidMount et componentDidUpdate)
    On peut appeler plusieurs fois useEffect() dans un composant pour séparer des blocs de codes aux responsabilités différentes,
    e.g. un appel à useEffect() qui gère la souscription à une API et renvoie une fonction qui procède à la désinscription
    et un autre appel à useEffect(), sans retour de fonction, pour modifier le style d'un autre composant
  */
  useEffect(() => {
    el.style.backgroundColor = stateKey ? green : red;
    // si useEffect() renvoie une fonction, ses instructions seront exécutées juste avant le prochain appel,
    // donc par défaut à chaque affichage, sauf le premier
    return () => {
      /* ... */
    };
  });

  return (
    <div>
      <button onClick={() => setStateKey(modifier(stateKey))}></button>
    </div>
  );
}
/*
  A des fins d'optimisation, on peut empêcher l'exécution de useEffect() à chaque affichage en renseignant un tableau de variables comme deuxième argument,
  useEffect() sera alors exécutée uniquement si les valeurs des variables ont changé depuis le précédent appel
*/

// useContext()
const NamedContext = React.createContext(defaultVal);
function Parent(props) {
  return (
    <NamedContext.Provider value={val}>
      <Child />
    </NamedContext.Provider>
  );
}
function Child(props) {
  return (
    <>
      <GrandChild />
    </>
  );
}
function GrandChild(props) {
  // useContext() renvoie la valeur actuelle du contexte, i.e. la valeur de la prop value du NamedContext.Provider le plus proche
  const context = useContext(NamedContext);
}

// useMemo() permet d'optimiser les performances en exécutant des instructions uniquement si
// les variables passées comme second argument on changé de valeur depuis le précédent appel
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
