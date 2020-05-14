/**
 * Interface implémentée par l'objet sujet de l'observation
 */
interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

/**
 * Implémentation concrète du sujet
 */
class ConcreteSubject implements Subject {
  /**
   * L'état dont dépend le comportement des observateurs est stocké dans une propriété
   */
  public state: number;

  /**
   * Liste des observateurs abonnés stockée dans un tableau,
   * (ES6 pour le support du Set)
   */
  private observers: Observer[] = [];

  /**
   * Souscription, ajout d'un observateur dans le tableau,
   * reproduction du comportement d'un Set en s'assurant que l'observateur
   * n'est pas déjà présent dans le tableau avant de l'ajouter
   */
  public attach(observer: Observer): void {
    if (this.observers.indexOf(observer) !== -1) return;
    this.observers.push(observer);
  }
  /**
   * Désabonnement, retrait d'un observateur du tableau
   */
  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) return;
    this.observers.splice(observerIndex, 1);
  }

  /**
   * Notification de l'ensemble des observateurs
   */
  public notify(): void {
    for (const observer of this.observers) {
      observer.update(this.state);
    }
  }

  /**
   * Méthode qui va provoquer un changement d'état et la notification de tous les observateurs
   */
  public someBusinessLogic(): void {
    this.state = Math.floor(Math.random() * (10 + 1));
    console.log(`Nouvel état: ${this.state}`);
    this.notify();
  }
}

/**
 * Interface implémentée par les objets observateurs
 */
interface Observer {
  update(state: number): void;
}

/**
 * Implémentation concrète d'un premier observateur
 */
class ConcreteObserverA implements Observer {
  public update(state: number): void {
    if (state < 3) {
      console.log("J'ai bien observé qu'on est passé en dessous de 3");
    }
  }
}

/**
 * Implémentation concrète d'un deuxième observateur
 */
class ConcreteObserverB implements Observer {
  public update(state: number): void {
    if (state === 0 || state >= 2) {
      console.log("J'ai bien observé qu'on était en dehors de l'intervalle ]0, 2[");
    }
  }
}

/**
 * EXEMPLE D'UTILISATION
 */
const subject = new ConcreteSubject();

const firstObserver = new ConcreteObserverA();
subject.attach(firstObserver);

const secondObserver = new ConcreteObserverB();
subject.attach(secondObserver);

subject.someBusinessLogic();
subject.someBusinessLogic();

subject.detach(secondObserver);

subject.someBusinessLogic();
