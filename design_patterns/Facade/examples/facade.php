<?php

class Facade
{
  protected $system1;
  protected $system2;

  /**
   * La Facade accède à des systèmes extérieurs pour construire ses
   * méthodes à partir de leurs fonctionnalités
   */
  public function __construct()
  {
    $this->system1 = new System1();
    $this->system2 = new System2();
  }

  /**
   * Les méthodes de la Facade sont des moyens raccourcis exécuter
   * une série d'instructions complexes, mettant en jeu plusieurs systèmes
   */
  public function operation(): string
  {
    $result = "La Facade initialise les systèmes:\n";
    $result .= $this->system1->complexOperation1();
    $result .= $this->system2->complexOperation1();
    $result .= "La Facade exécute un enchaînement d'opérations complexes, mettant en jeu plusieurs systèmes:\n";
    $result .= $this->system1->complexOperationN();
    $result .= $this->system2->complexOperationZ();

    return $result;
  }
}

class System1
{
  public function complexOperation1(): string
  {
    return "- Système 1 initialisé !\n";
  }

  /**
   * Le système peut comporter d'autres fonctionnalités
   * auxquelles la façade ne donne pas accès
   */

  public function complexOperationN(): string
  {
    return "- La fonctionnalité complexe du premier système est exécutée\n";
  }
}

class System2
{
  public function complexOperation1(): string
  {
    return "- Système 2 initialisé !\n";
  }

  // ...

  public function complexOperationZ(): string
  {
    return "- La fonctionnalité complexe du second système est exécutée\n";
  }
}

/**
 * L'utilisation des fonctionnalités est ultra-simplifiée par la Facade.
 * Une série d'instructions complexes, coordonnées entre
 * différents systèmes, est réduite à un simple appel de méthode
 */
function clientCode(Facade $facade)
{
  echo $facade->operation();
}

$facade = new Facade();
clientCode($facade);
