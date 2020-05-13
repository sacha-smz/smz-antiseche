<?php

/**
 * PHP possède des interfaces qui décrivent le comportement du Sujet et de l'Observateur
 *
 * https://www.php.net/manual/fr/class.splsubject.php
 * SplSubject {
 *  abstract public attach ( SplObserver $observer ) : void
 *  abstract public detach ( SplObserver $observer ) : void
 *  abstract public notify ( void ) : void
 * }
 *
 * https://www.php.net/manual/fr/class.splobserver.php
 *  SplObserver {
 *    abstract public update ( SplSubject $subject ) : void
 *  }
 */

/**
 * Implémentation concrète du sujet
 */
class Subject implements \SplSubject
{
  /**
   * L'état dont dépend le comportement des observateurs est stocké dans une propriété
   */
  public $state;

  /**
   * Liste des observateurs stockée dans un set d'objets
   * https://www.php.net/manual/fr/class.splobjectstorage.php
   */
  private $observers;

  public function __construct()
  {
    $this->observers = new \SplObjectStorage();
  }

  /**
   * Souscription, ajout d'un observateur au set d'objets
   */
  public function attach(\SplObserver $observer): void
  {
    $this->observers->attach($observer);
  }
  /**
   * Désabonnement, retrait d'un observateur du set d'objets
   */
  public function detach(\SplObserver $observer): void
  {
    $this->observers->detach($observer);
  }

  /**
   * Notification de l'ensemble des observateurs, l'interface PHP prévoit que l'objet
   * sujet entier est transmis à l'observateur et pas simplement le nouvel état
   */
  public function notify(): void
  {
    foreach ($this->observers as $observer) {
      $observer->update($this);
    }
  }

  /**
   * Méthode qui va provoquer un changement d'état et la notification de tous les observateurs
   */
  public function someBusinessLogic(): void
  {
    $this->state = rand(0, 10);
    echo "Nouvel état: $this->state\n";
    $this->notify();
  }
}

/**
 * Implémentation concrète d'un premier observateur
 */
class ConcreteObserverA implements \SplObserver
{
  public function update(\SplSubject $subject): void
  {
    /**
     * adaptation du comportement à l'état du sujet observé
     */
    if ($subject->state < 3) {
      echo "J'ai bien observé qu'on est passé en dessous de 3\n\n";
    }
  }
}

/**
 * Implémentation concrète d'un deuxième observateur
 */
class ConcreteObserverB implements \SplObserver
{
  public function update(\SplSubject $subject): void
  {
    if ($subject->state == 0 || $subject->state >= 2) {
      echo "J'ai bien observé qu'on était en dehors de l'intervalle ]0, 2[\n\n";
    }
  }
}

/**
 * EXEMPLE D'UTILISATION
 */
$subject = new Subject();

$firstObserver = new ConcreteObserverA();
$subject->attach($firstObserver);

$secondObserver = new ConcreteObserverB();
$subject->attach($secondObserver);

$subject->someBusinessLogic();
$subject->someBusinessLogic();

$subject->detach($secondObserver);

$subject->someBusinessLogic();
