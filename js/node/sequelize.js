/**
 * installation de sequelize : npm i sequelize
 * installation du driver de base de données : npm i pg pg-hstore
 */

// import des classes de sequelize utilisées dans le fichier
const { Sequelize, Model, DataTypes, Op } = require("sequelize");
// instanciation du client pour la connexion à la base de données
const client = new Sequelize(process.env.PG_URL, {
  // définition d'options par défaut pour l'ensemble des modèles
  define: {
    underscored: true,
    timestamps: false
  }
});

// représentation d'une table par une classe qui étend Model
class Table extends Model {}

Table.init(
  // une clé primaire nommée id est définie par défaut
  {
    // liste des types de données supportés : https://sequelize.org/master/variable/index.html#static-variable-DataTypes
    first_field: {
      type: DataTypes.STRING, // possibilité d'utiliser également Sequelize.TYPE
      allowNull: false, // définit le champ comme NOT NULL, true par défaut (NULL)
      defaultValue: "value", // valeur par défaut si le champ n'est pas renseigné
      unique: true, // la valeur ne peut être présente qu'une seule fois pour ce champ dans la table
      // règles de validation : https://sequelize.org/v5/manual/models-definition.html#validations
      validate: {
        isEmail: true,
        notContains: {
          args: ["tempmail"],
          msg: "Les adresses email temporaires ne sont pas acceptées" // personnalisation du message d'erreur
        }
      }
    },
    second_field: DataTypes.INTEGER, // possibilité de ne renseigner que le type sans passer par un objet
    third_field: {
      // possibilité de définir des accesseurs pour une propriété
      type: DataTypes.STRING,
      get() {
        return this.getDataValue("third_field").toUpperCase(); // getDataValue pour accéder à la valeur d'une propriété de l'instance
      },
      set(val) {
        this.setDataValue("third_field", val.toLowerCase()); // setDataValue pour affecter une valeur à une propriété de l'instance
      }
    }
  },
  {
    sequelize: client,
    // nom du modèle utilisé pour la génération automatique des clés étrangères, le modèle est accessible via 'sequelize.models.table'
    modelName: "table",
    // nom de la table, nom du model mis au pluriel par défaut
    tableName: "table",
    // snake case pour les noms des champs des timestamps et les clés étrangères, false par défaut
    underscored: true,
    // présence des champs createdAt et updatedAt (ou created_at et updated_at selon la valeur d'underscored), true par défaut
    timestamps: false
  }
);

// création de la table en base de données conformément à sa représentation définie par le modèle
Table.sync({ force: true }).then(() => {
  // l'option 'force: true' permet d'écraser la table si elle existe déjà
});
// création des tables pour tous les modèles à la fois
client.sync();
//! l'utilisation de sync() est à éviter en production où l'on privilégiera le recours aux migrations

/**
 * Déclaration d'un hook pour déclencher systématiquement l'exécution d'une instruction à une certaine étape du cycle de vie du modèle
 * e.g. : traitement sur un champ juste avant l'insertion d'une entrée dans la table
 */
Table.beforeCreate((entry, options) => {
  // 'entry' représente l'entrée en cours de création et 'options' l'objet passé à la méthode 'create' en second argument
  entry.third_field = entry.third_field.replace(" ", "_");
});

// accéder à toutes les entrées correspondant à un critère de recherche (la totalité des entrées de la table en l'absence de critère)
Table.findAll({
  // possibilité de sélectionner des champs et renommer une propriété :
  attributes: [id, first_field, [second_field, alias]], // entry.alias correspondra à la valeur du champ second_field de la table
  where: {
    first_field: "value",
    second_field: 42,
    third_field: { [Op.like]: "%zou%" } // opérateurs de comparaison : https://sequelize.org/v5/manual/querying.html#operators
  },
  order: [["field", "DESC"]], // SQL ORDER BY : https://sequelize.org/v5/manual/querying.html#ordering
  group: "field", // SQL GROUP BY
  limit: 20, // SQL LIMIT
  offset: 40 // SQL OFFSET
}).then(entries => {
  // utiliser les entrées, i.e. un tableau d'instances de Table
  for (const entry of entries) {
    // ...
  }
});

// compter les entrées correspondant à un critère de recherche
Table.count({ where: { first_field: "value" } }).then(count => {
  // utiliser le nombre d'entrées
});

// accéder à toutes les entrées de la table et les compter
Table.findAndCountAll().then(({ rows, count }) => {
  // utiliser les entrées et leur compte, par exemple pour une pagination
});

// accéder à la première entrée correspondant à un critères de recherche
Table.findOne({ where: { first_field: "value" } }).then(entry => {
  // utiliser l'instance, entry vaut null s'il n'y a aucune entrée correspondante dans la table
});

// accéder à une entrée via sa clé primaire (l'id par défaut)
Table.findByPk(42).then(entry => {
  // utiliser l'instance
});

// insérer une entrée dans la table
Table.create({ first_field: "Value", second_field: 42 }).then(newEntry => {
  // utiliser la nouvelle entrée
});

// créer une instance du modèle sans insérer l'entrée correspondante dans la table
const tableInstance = Table.build({ first_field: "Value", second_field: 42 });

// enregistrer dans la table l'entrée correspondant à l'instance
tableInstance.save().then(savedInstance => {
  // sauvegarde effectuée avec succès
});

// rechercher une entrée et l'insérer si elle n'existe pas encore dans la table
Table.findOrCreate({
  where: { first_field: "value" },
  defaults: { second_field: 42, third_field: "other value" }
}).then(([entry, created]) => {
  /**
   * si aucune entrée ne correspond aux critères de recherche dans la table, une nouvelle entrée est crée avec les
   * valeurs renseignées dans l'objet 'defaults' et 'created' vaut true (false sinon)
   */
});

// modifier des entrées correspondant à un critère de recherche
Table.update(
  { first_field: "new value" },
  {
    where: { first_field: "value" },
    // SQL RETURNING *, false par défaut, possibilité de renseigner un tableau contenant une sélection de champs à la place du booléen
    returning: true
  }
).then((affectedRowsNbr, returnedRows) => {
  // mise à jour effectuée avec succès
});

// supprimer des entrées correspondant à un critère de recherche
Table.destroy({ where: { first_field: "value" } }).then(deletedRowsNbr => {
  // suppression effectuée avec succès
});

// obtenir la valeur maximale d'un champ parmi les entrées correspondant à un critère de recherche
Table.max("second_field", { where: { second_field: { [Op.lt]: 42 } } }).then(max => {
  // utiliser la valeur maximale du champ
});

// obtenir la valeur minimale d'un champ parmi les entrées correspondant à un critère de recherche
Table.min("second_field", { where: { second_field: { [Op.lt]: 42 } } }).then(max => {
  // utiliser la valeur minimale du champ
});

// obtenir le total des valeurs d'un champ
Table.sum("second_field", { where: { second_field: { [Op.lt]: 42 } } }).then(sum => {
  // utiliser le total
});

/**
 * RELATIONS
 */
class Customer extends Model {}
Customer.init({});

class Order extends Model {}
Order.init({});

class Coupon extends Model {}
Coupon.init({});

class Cart extends Model {}
Cart.init({});

class Item extends Model {}
Item.init({});

/**
 * une commande est liée à un client,
 * chaque entrée de la table 'order' possède un champ référençant le client auteur de la commande
 */
Order.belongsTo(Customer, {
  // alias qui permet d'identifier la relation, nom du modèle cible par défaut
  as: "customer",
  // nom de la clé étrangère présente dans la table source, par défaut construite à partir du nom du modèle cible et de sa clé primaire
  foreignKey: "customer_id",
  // nom de la colonne référencée dans la table cible, clé primaire par défaut
  targetKey: "id",
  // si un client est supprimé de la base de données, les commandes qu'il a passées n'ont plus de raison d'être
  onDelete: "CASCADE"
});

/**
 * un client possède un panier mémorisé,
 * une entrée de la table 'cart' possède un champ qui référence le client à qui le panier appartient
 */
Customer.hasOne(Cart, {
  as: "cart",
  foreignKey: "customer_id"
});

/**
 * un client peut passer plusieurs commandes,
 * dans la table 'order', chaque entrée correspondant à l'une de ses commandes possède un champ qui le référence
 */
Customer.hasMany(Order, {
  as: "orders",
  foreignKey: {
    name: "customer_id",
    // une commande est forcément rattachée à un client
    allowNull: false,
    validate: {
      notNull: {
        msg: "Une commande doit être rattachée à un client"
      }
    }
  }
});

/**
 * un client peut bénéficier de plusieurs bons de réduction et un même coupon peut être valable pour plusieurs clients,
 * une table additionnelle fait le lien entre les deux modèles
 */
Coupon.belongsToMany(Customer, {
  as: "customers",
  through: "coupon_customer", // nom de la table qui représente la relation qui lie les clients et les coupons de remise (Many-To-Many)
  foreignKey: "coupon_id",
  otherKey: "customer_id",
  onDelete: "CASCADE"
});

Customer.belongsToMany(Coupon, {
  as: "coupons",
  through: "coupon_customer",
  foreignKey: "customer_id",
  otherKey: "coupon_id",
  onDelete: "CASCADE"
});

/**
 * un panier peut être composé de plusieurs articles,
 * un même article peut être ajouté à plusieurs paniers
 */
Cart.belongsToMany(Item, {
  as: "items",
  through: "cart_item",
  foreignKey: "cart_id",
  otherKey: "item_id",
  onDelete: "CASCADE"
});

Item.belongsToMany(Cart, {
  as: "carts",
  through: "cart_item",
  foreignKey: "item_id",
  otherKey: "cart_id",
  onDelete: "CASCADE"
});

// accéder aux entrées d'une table et à ses relations
Customer.findAll({
  include: [
    {
      association: "cart", // alias de la relation
      // possibilité de récupérer des relations imbriquées
      include: [
        {
          association: "items",
          where: { price: { [Op.gt]: 9.99 } } // possibilité de filtrer les entrées de la relation
        }
      ]
    },
    "orders" // possibilité de ne renseigner que l'alias de la relation sans passer par un objet
  ]
}).then(customers => {
  for (const customer of customers) {
    // utiliser les instances de Customer et Cart
    console.log(customer.dataValues, customer.cart.dataValues);

    // accéder aux données la relation via la propriété correspondant à son alias
    for (const order of customer.orders) {
      console.log(order.dataValues);
    }

    // accéder aux données de la relation imbriquée
    for (const item of customer.cart.items) {
      console.log(item.dataValues);
    }
  }
});
