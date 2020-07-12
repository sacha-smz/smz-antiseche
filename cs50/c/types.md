# Types

## int

entiers (integers) stockés sur 4 bytes (32 bits)  
compris entre **-2<sup>31</sup>** et **2<sup>31</sup> - 1**

## unsigned int

entiers positifs stockés sur 4 bytes  
compris entre **0** et **2<sup>32</sup> - 1**

## char

caractères stockés sur 1 byte

## float

nombres à virgule flottante stockés sur 4 bytes

## double

nombres à virgule flottante stockés sur 8 bytes (double précision)

## void

aucun datatype : absence de valeur de retour ou absence de paramètres

## char [ ]

chaîne de caractères sous forme de tableau avec comme dernier élément le **null character** `'\0'`

```c
char string[6] = {'h', 'e', 'l', 'l', 'o', '\0'};
char string[] = "hello";
char *string = "hello";
```
