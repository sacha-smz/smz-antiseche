<?php

/**
 * Interface commune à la fois à l'objet décoré et à ses décorateurs,
 * elle décrit le comportement dont ils ont tous la responsabilité : le formatage du texte
 */
interface InputFormat
{
  public function formatText(string $text): string;
}

/**
 * Implémentation concrète de l'interface,
 * C'est à partir de cette classe que sera construit l'objet décoré,
 * son comportement est basique, il produit du texte à l'état brut
 */
class TextInput implements InputFormat
{
  public function formatText(string $text): string
  {
    return $text;
  }
}

/**
 * Classe de base qui ne sera pas instanciée mais héritée par les décorateurs,
 * elle se contente de stocker une référence à l'objet décoré
 */
class TextFormat implements InputFormat
{
  /**
   * @var InputFormat
   */
  protected $inputFormat;

  public function __construct(InputFormat $inputFormat)
  {
    $this->inputFormat = $inputFormat;
  }

  /**
   * Le rôle du décorateur étant d'ajouter une fonctionnalité à l'objet initial,
   * et non d'écraser son comportement, il doit faire appel à la méthode de formatage de l'objet décoré,
   * avant ou après avoir effectué ses propres ajouts
   */
  public function formatText(string $text): string
  {
    return $this->inputFormat->formatText($text);
  }
}

/**
 * 1ère implémentation concrète de décorateur
 */
class DangerousHTMLTagsFilter extends TextFormat
{
  private $dangerousTagPatterns = [
    "|<script.*?>([\s\S]*)?</script>|i", // ...
  ];

  private $dangerousAttributes = [
    "onclick",
    "onkeypress", // ...
  ];

  /**
   * premier formatage via la méthode de l'objet décoré,
   * puis suppression sélective des éléments dangereux (potentielle exécution de scripts)
   * parent::formatText fait référence à la méthode décrite dans la classe de base (TextFormat),
   * dont héritent les décorateurs, qui fait elle-même appel à la méthode formatText de l'objet décoré
   */
  public function formatText(string $text): string
  {
    $text = parent::formatText($text);

    foreach ($this->dangerousTagPatterns as $pattern) {
      $text = preg_replace($pattern, '', $text);
    }

    foreach ($this->dangerousAttributes as $attribute) {
      $text = preg_replace_callback(
        '|<(.*?)>|',
        function ($matches) use ($attribute) {
          $result = preg_replace("|$attribute=|i", '', $matches[1]);
          return "<" . $result . ">";
        },
        $text
      );
    }

    return $text;
  }
}

/**
 * 2ème implémentation concrète de décorateur
 */
class PlainTextFilter extends TextFormat
{
  /**
   * premier formatage via la méthode de l'objet décoré, puis suppression de toutes les balises HTML et PHP
   */
  public function formatText(string $text): string
  {
    $text = parent::formatText($text);
    return strip_tags($text);
  }
}

/**
 *EXEMPLE D'UTILISATION
 */

/**
 * Chaîne de caractère suspecte à formater
 */
$dangerousComment = <<<BOUND
Hello! Nice blog post!
Please visit my <a href='http://www.iwillhackyou.com'>homepage</a>.
<script src="http://www.iwillhackyou.com/script.js">
  performXSSAttack();
</script>
BOUND;

/**
 * Instanciation de l'objet au comportement basique
 */
$rowInput = new TextInput();
echo $rowInput->formatText("$dangerousComment\n\n");
/**
 * output, texte brut:
 * Hello! Nice blog post!
 * Please visit my <a href='http://www.iwillhackyou.com'>homepage</a>.
 * <script src="http://www.iwillhackyou.com/script.js">
 *   performXSSAttack();
 * </script>
 */

/**
 * Utilisation du 1er décorateur,
 * l'objet à décorer est passé comme argument au constructeur
 */
$safeInput = new DangerousHTMLTagsFilter($rowInput);
echo $safeInput->formatText("$dangerousComment\n\n");
/**
 * output, fruit de l'appel à la méthode de formatage de rowInput (i.e. aucun formatage, texte brut),
 * suivi du retrait des balises dangereuses (script):
 * Hello! Nice blog post!
 * Please visit my <a href='http://www.iwillhackyou.com'>homepage</a>.
 */

/**
 * Utilisation du 2ème décorateur en complément du 1er
 * (on décore un objet déjà décoré)
 */
$filteredInput = new PlainTextFilter($safeInput);
echo $filteredInput->formatText("$dangerousComment\n\n");
/**
 * output, texte brut sécurisé par le 1er décorateur, duquel
 * le second décorateur a retiré toutes les balises restantes:
 * Hello! Nice blog post!
 * Please visit my homepage.
 */
