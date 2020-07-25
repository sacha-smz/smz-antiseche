# Types

## int

**Entiers** (integers) stockés sur **4 octets** (32 bits), valeurs comprises entre **-2<sup>31</sup>** et **2<sup>31</sup> - 1**

## unsigned int

**Entiers positifs** stockés sur **4 octets**, valeurs comprises entre **0** et **2<sup>32</sup> - 1**

## char

**Caractères** stockés sur **1 octet**

## float

**Nombres à virgule flottante** stockés sur **4 octets** et représentés sous la forme :

![Représentation du nombre décimal][float-format]

[float-format]: img/float_format.svg "Float format"

![Stockage d'un float][float-32bits]

[float-32bits]: img/float_32bits.svg "Float 32 bits"

- Le **1er bit** détermine le **signe** : **0** pour ➕, **1** pour ➖
- La séquence des **8 bits suivants** détermine la valeur de l'**exposant**. L'**octet de valeur 127** (01111111) correspond à l'**exposant zéro** .
  La valeur de l'exposant est comprise entre **-126** (octet de valeur 1) à **127** (octet de valeur 254).  
  La **valeur d'octet 0** (00000000) ne correspond pas à l'exposant -127 mais est utilisée pour représenter le **nombre 0**, qui ne peut pas s'écrire sous la forme ± 2<sup>exposant</sup> × 1.mantisse.  
  La **valeur d'octet 255** (11111111) ne correspond pas à l'exposant 128 mais est utilisée pour représenter les valeurs **NaN, Infinity et -Infinity**
- La séquence des **23 bits suivants** détermine la valeur à ajouter à 1 pour former la **mantisse**. Le premier bit représente la valeur de 2<sup>-1</sup>, le second 2<sup>-2</sup> et ainsi de suite, de manière à ce que la mantisse soit toujours comprise entre 1 et 2 exclu

Lorsque l'octet de l'exposant vaut 255, le signe et la mantisse permettent d'identifier Nan, Infinity et -Infinity :

- bit du signe à 0 et mantisse nulle pour Infinity
- bit du signe à 1 et mantisse nulle pour -Infinity
- mantisse non nulle pour NaN

### Exemple pour la valeur 0.8 :

Meilleure approximation :  
2<sup>-1</sup> × 1.60000002384185791015625 = 0,800000011920928955078125

![Stockage d'un float][float-32bits-example]

[float-32bits-example]: img/float_0.8.svg "Exemple float 32 bits"

## double

**Nombres à virgule flottante** stockés sur **8 octets** (double précision).

L'**exposant** et la **mantisse** sont encodés respectivement sur **11** et **52 bits**.  
La **séquence des bits d'exposant** de valeur **1023** correspond à l'**exposant zéro**.  
La **séquence 0** (00000000000) ne correspond pas à l'exposant -1023 mais est utilisée pour représenter le **nombre 0**  
La **séquence 2047** (11111111111) ne correspond pas à l'exposant 1024 mais est utilisée pour représenter **NaN, Infinity et -Infinity**

## void

**Aucun type** : absence de valeur de retour ou absence de paramètres

## char [ ]

**Chaîne de caractères** sous forme de tableau avec comme dernier élément le **null character** `'\0'`

```c
char string[6] = {'h', 'e', 'l', 'l', 'o', '\0'};
char string[] = "hello";
char *string = "hello";
```
