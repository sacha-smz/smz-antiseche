# Encoding

## Unicode

Indépendamment des problématiques de stockage en mémoire, chaque caractère est associé à une valeur de **code point** notée sous la forme :

- **U+09AF** de 0 à 65 535 (Basic Multilingual Plane, les valeurs ASCII sont préservées)
- **U+109AF** de 65 536 à 1 048 575
- **U+1009AF** de 1 048 576 à 1 114 111 (valeur maximale U+10FFFF)

## Encoding

Stratégie de stockage en mémoire des valeurs de _code point_

### UTF-8

Enregistrement de la valeur du _code point_ sur un nombre d'octets qui varie selon sa taille :

- les valeurs de 0 à 127 utilisent **7 bits** sur **1 octet**

  |          00           |
  | :-------------------: |
  | _**0**_ 0 0 0 0 0 0 0 |

  |          7F           |
  | :-------------------: |
  | _**0**_ 1 1 1 1 1 1 1 |

- les valeurs de 128 à 2047 utilisent **11 bits** sur **2 octets**

  |                C2                 |             80              |
  | :-------------------------------: | :-------------------------: |
  | _**1**_ _**1**_ _**0**_ 0 0 0 1 0 | _**1**_ _**0**_ 0 0 0 0 0 0 |

  |                DF                 |             BF              |
  | :-------------------------------: | :-------------------------: |
  | _**1**_ _**1**_ _**0**_ 1 1 1 1 1 | _**1**_ _**0**_ 1 1 1 1 1 1 |

- les valeurs de 2 048 à 65 535 utilisent **16 bits** sur **3 octets**

  |                   E0                    |             A0              |             80              |
  | :-------------------------------------: | :-------------------------: | :-------------------------: |
  | _**1**_ _**1**_ _**1**_ _**0**_ 0 0 0 0 | _**1**_ _**0**_ 1 0 0 0 0 0 | _**1**_ _**0**_ 0 0 0 0 0 0 |

  |                   EF                    |             BF              |             BF              |
  | :-------------------------------------: | :-------------------------: | :-------------------------: |
  | _**1**_ _**1**_ _**1**_ _**0**_ 1 1 1 1 | _**1**_ _**0**_ 1 1 1 1 1 1 | _**1**_ _**0**_ 1 1 1 1 1 1 |

- les valeurs au delà de 65 536 utilisent **21 bits** sur **4 octets**

  |                      F0                       |             90              |             80              |             80              |
  | :-------------------------------------------: | :-------------------------: | :-------------------------: | :-------------------------: |
  | _**1**_ _**1**_ _**1**_ _**1**_ _**0**_ 0 0 0 | _**1**_ _**0**_ 0 1 0 0 0 0 | _**1**_ _**0**_ 0 0 0 0 0 0 | _**1**_ _**0**_ 0 0 0 0 0 0 |

  |                      F4                       |             8F              |             BF              |             BF              |
  | :-------------------------------------------: | :-------------------------: | :-------------------------: | :-------------------------: |
  | _**1**_ _**1**_ _**1**_ _**1**_ _**0**_ 1 0 0 | _**1**_ _**0**_ 0 0 1 1 1 1 | _**1**_ _**0**_ 1 1 1 1 1 1 | _**1**_ _**0**_ 1 1 1 1 1 1 |

La valeur de chaque octet donne ainsi une indication sur la manière dont il doit être interprété :

- entre 0 et 127 (00, 7F) : unique octet du caractère
- entre 128 et 191 (80, BF) : octet d'une séquence déjà initiée
- entre 194 et 223 (C2, DF) : premier octet d'une séquence sur 2 octets
- entre 224 et 239 (E0, EF) : premier octet d'une séquence sur 3 octets
- entre 240 et 244 (F0, F4) : premier octet d'une séquence sur 4 octets

### UTF-16

Enregistrement de la valeur du _code point_ sur **1 ou 2 blocs de 2 octets** (_surrogate_)

- les valeurs entre 0 et 65 535 utilisent **un bloc de 2 octets**

  |               0000                |
  | :-------------------------------: |
  | 0 0 0 0 0 0 0 0 - 0 0 0 0 0 0 0 0 |

  |               FFFF                |
  | :-------------------------------: |
  | 1 1 1 1 1 1 1 1 - 1 1 1 1 1 1 1 1 |

- les valeurs au-delà de 65 536 utilisent **une paire de blocs de 2 octets** (_surrogate pair_)

  1. on retire 65 536 pour obtenir une valeur nécessitant au maximum 20 bits

     |          Valeur initiale          | Après soustraction |
     | :-------------------------------: | :----------------: |
     |              65 536               |         0          |
     |               1000                |         0          |
     | 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 |         0          |

     |               Valeur initiale               |           Après soustraction            |
     | :-----------------------------------------: | :-------------------------------------: |
     |                  1 114 111                  |                1 048 575                |
     |                   10FFFF                    |                  FFFFF                  |
     | 1 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 | 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 |

  2. on ajoute 55 296 à la valeur de la séquence des **10 premiers bits** pour obtenir le premier bloc de 2 octets

     | Valeur initiale |                            Après addition                             |
     | :-------------: | :-------------------------------------------------------------------: |
     |        0        |                                 D800                                  |
     |        0        | _**1**_ _**1**_ _**0**_ _**1**_ _**1**_ _**0**_ 0 0 - 0 0 0 0 0 0 0 0 |

     |   Valeur initiale   |                            Après addition                             |
     | :-----------------: | :-------------------------------------------------------------------: |
     |         3FF         |                                 DBFF                                  |
     | 1 1 1 1 1 1 1 1 1 1 | _**1**_ _**1**_ _**0**_ _**1**_ _**1**_ _**0**_ 1 1 - 1 1 1 1 1 1 1 1 |

  3. on ajoute 56 320 à la valeur de la séquence des **10 derniers bits** pour obtenir le second bloc de 2 octets

     | Valeur initiale |                            Après addition                             |
     | :-------------: | :-------------------------------------------------------------------: |
     |        0        |                                 DC00                                  |
     |        0        | _**1**_ _**1**_ _**0**_ _**1**_ _**1**_ _**1**_ 0 0 - 0 0 0 0 0 0 0 0 |

     |   Valeur initiale   |                            Après addition                             |
     | :-----------------: | :-------------------------------------------------------------------: |
     |         3FF         |                                 DFFF                                  |
     | 1 1 1 1 1 1 1 1 1 1 | _**1**_ _**1**_ _**0**_ _**1**_ _**1**_ _**1**_ 1 1 - 1 1 1 1 1 1 1 1 |

  #### Résultat

  |            _code point_ initial             |                                                            UTF-16 _surrogate pair_                                                             |
  | :-----------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------: |
  |                    1000                     |                                                                  D800 \| DC00                                                                  |
  |      1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0      | _**1**_ _**1**_ _**0**_ _**1**_ _**1**_ _**0**_ 0 0 - 0 0 0 0 0 0 0 0 \| _**1**_ _**1**_ _**0**_ _**1**_ _**1**_ _**1**_ 0 0 - 0 0 0 0 0 0 0 0 |
  |                   10FFFF                    |                                                                  DBFF \| DFFF                                                                  |
  | 1 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 | _**1**_ _**1**_ _**0**_ _**1**_ _**1**_ _**0**_ 1 1 - 1 1 1 1 1 1 1 1 \| _**1**_ _**1**_ _**0**_ _**1**_ _**1**_ _**1**_ 1 1 - 1 1 1 1 1 1 1 1 |

#### Javascript

**UTF-16** est le format utilisé en interne par **Javascript**. Les caractères dont le _code point_ est supérieur à 65 535, valeur maximale pouvant être décrite par 2 octets, occupent deux index dans la chaîne de caractères et comptent donc pour 2 dans sa propriété `length`. La valeur de chaque bloc de 2 octets (_surrogate_) peut être obtenue avec la méthode [charCodeAt()](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String/charCodeAt)

Pour inscrire un caractère dans une chaîne, il est possible d'utiliser une séquence échappée dont la forme varie selon la valeur du _code point_ :

- "\x0F" jusqu'à 255
- "\u09AF" entre 256 et 65 535
- "\uDA0F\uDD0F" au-delà de 65 536 (une _surrogate pair_ pour représenter 1 _code point_)

ECMAScript 2015 apporte une nouvelle syntaxe de la forme "\u{19AF}" dans laquelle la valeur hexadécimale représente le _code point_ et peut occuper entre 1 et 6 caractères

ES6 introduit également la méthode [normalize()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) qui permet d'obtenir toujours la même chaîne lorsque sont présents des caractères dont la séquence d'écriture peut varier sans que leur apparence ne change, utile notamment pour la cohérence des comparaisons

Le _spread operator_ et la boucle `for...of` permettent de manipuler les entités Unicode

```js
const str = "123\u{1F631}";

console.log(str.length);
> 5
console.log([...str].length);
> 4

for (let i = 0; i < str.length; i++) {
  console.log(str[i]);
}
> 1
  2
  3
  �
  �

for (const c of str) {
  console.log(c);
}
> 1
  2
  3
  😱
```

#### Endianness & BOM

Le **boutisme** ou **endianness** désigne l'ordre dans lequel les octets constitutifs d'une même séquence sont inscrits en mémoire. On parle de système **_gros-boutiste_** ou **_big-endian_** lorsque l'octet de poids le plus fort est stocké à la plus petite adresse mémoire et de système **_petit-boutiste_** ou **_little-endian_** lorsque c'est à l'inverse l'octet de poids le plus faible qui est stocké à la plus petite adresse.

L'**indicateur d'ordre des octets** ou **BOM** (_byte order mark_) est le caractère Unicode correspondant au _code point_ **U+FEFF**. Il peut être placé au tout début d'un fichier ou flux encodé en UTF-16 pour indiquer le boutisme utilisé pour les caractères suivants :

- paire d'octets FE-FF pour l'ordre _big-endian_
- paire d'octets FF-FE pour l'ordre _little-endian_

Une tentative d'interprétation avec le mauvais boutisme produit le _code point_ U+FFFE qui est défini par le standard Unicode comme un caractère non valide (_noncharacter_)
