/**
 * Implémentation concrète du sujet
 */
var ConcreteSubject = /** @class */ (function () {
    function ConcreteSubject() {
        /**
         * @type {Observer[]} Liste des observateurs abonnés stockée dans un tableau,
         * (ES6 pour le support du Set)
         */
        this.observers = [];
    }
    /**
     * Souscription, ajout d'un observateur dans le tableau,
     * reproduction du comportement d'un Set en s'assurant que l'observateur
     * n'est pas déjà présent dans le tableau avant de l'ajouter
     */
    ConcreteSubject.prototype.attach = function (observer) {
        if (this.observers.indexOf(observer) !== -1)
            return;
        this.observers.push(observer);
    };
    /**
     * Désabonnement, retrait d'un observateur du tableau
     */
    ConcreteSubject.prototype.detach = function (observer) {
        var observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1)
            return;
        this.observers.splice(observerIndex, 1);
    };
    /**
     * Notification de l'ensemble des observateurs
     */
    ConcreteSubject.prototype.notify = function () {
        for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
            var observer = _a[_i];
            observer.update(this.state);
        }
    };
    /**
     * Méthode qui va provoquer un changement d'état et la notification de tous les observateurs
     */
    ConcreteSubject.prototype.someBusinessLogic = function () {
        this.state = Math.floor(Math.random() * (10 + 1));
        console.log("Nouvel \u00E9tat: " + this.state);
        this.notify();
    };
    return ConcreteSubject;
}());
/**
 * Implémentation concrète d'un premier observateur
 */
var ConcreteObserverA = /** @class */ (function () {
    function ConcreteObserverA() {
    }
    ConcreteObserverA.prototype.update = function (state) {
        if (state < 3) {
            console.log("J'ai bien observé qu'on est passé en dessous de 3");
        }
    };
    return ConcreteObserverA;
}());
/**
 * Implémentation concrète d'un deuxième observateur
 */
var ConcreteObserverB = /** @class */ (function () {
    function ConcreteObserverB() {
    }
    ConcreteObserverB.prototype.update = function (state) {
        if (state === 0 || state >= 2) {
            console.log("J'ai bien observé qu'on était en dehors de l'intervalle ]0, 2[");
        }
    };
    return ConcreteObserverB;
}());
/**
 * EXEMPLE D'UTILISATION
 */
var subject = new ConcreteSubject();
var firstObserver = new ConcreteObserverA();
subject.attach(firstObserver);
var secondObserver = new ConcreteObserverB();
subject.attach(secondObserver);
subject.someBusinessLogic();
subject.someBusinessLogic();
subject.detach(secondObserver);
subject.someBusinessLogic();
