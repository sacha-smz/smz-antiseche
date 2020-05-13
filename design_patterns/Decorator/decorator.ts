/**
 * Interface commune à la fois à l'objet décoré et à ses décorateurs,
 * elle décrit le comportement dont ils ont tous la responsabilité
 */
interface Component {
  operation(): string;
}

/**
 * Implémentation concrète de l'interface,
 * C'est à partir de cette classe que sera construit
 * l'objet décoré, son comportement est basique
 */
class ConcreteComponent implements Component {
  public operation(): string {
    return "j'étais une string relativement courte";
  }
}

/**
 * Classe de base qui ne sera pas instanciée mais héritée par les décorateurs,
 * elle se contente de stocker une référence à l'objet décoré
 */
class Decorator implements Component {
  protected component: Component;

  constructor(component: Component) {
    this.component = component;
  }

  /**
   * Le rôle du décorateur étant d'ajouter une fonctionnalité à l'objet initial,
   * et non d'écraser son comportement, il doit faire appel à la méthode de base,
   * avant ou après avoir effectué ses propres ajouts
   */
  public operation(): string {
    return this.component.operation();
  }
}

/**
 * 1ère implémentation concrète de décorateur
 */
class ConcreteDecoratorA extends Decorator {
  /**
   * ajout par le décorateur d'un texte avant celui généré par la méthode de l'objet décoré,
   * super.operation fait référence à la méthode décrite dans la classe de base (Decorator),
   * dont héritent les décorateurs, qui fait elle-même appel à la méthode operation de l'objet décoré
   */
  public operation(): string {
    return `Avant qu'un premier décorateur n'intervienne, ${super.operation()}`;
  }
}

/**
 * 2ème implémentation concrète de décorateur
 */
class ConcreteDecoratorB extends Decorator {
  /**
   * première partie de l'output généré par la méthode de l'objet décoré,
   * puis ajout par le décorateur d'un complément de texte
   */
  public operation(): string {
    return `${super.operation()}, puis un deuxième décorateur m'a encore rallongée`;
  }
}

/**
 *EXEMPLE D'UTILISATION
 */

/**
 * Instanciation de l'objet au comportement basique
 */
const decorated = new ConcreteComponent();
console.log(decorated.operation());
// j'étais une string relativement courte

/**
 * Utilisation du 1er décorateur,
 * l'objet à décorer est passé comme argument au constructeur
 */
const firstDecorator = new ConcreteDecoratorA(decorated);
console.log(firstDecorator.operation());
// Avant qu'un premier décorateur n'intervienne, j'étais une string relativement courte

/**
 * Utilisation du 2ème décorateur en complément du 1er
 * (on décore un objet déjà décoré)
 */
const secondDecortor = new ConcreteDecoratorB(firstDecorator);
console.log(secondDecortor.operation());
// Avant qu'un premier décorateur n'intervienne, j'étais une string relativement courte, puis un deuxième décorateur m'a encore rallongée
