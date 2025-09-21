import { DataTypes, Model } from "sequelize";

export default (sequelize, User, Product) => {
  class CartItem extends Model {}

  CartItem.init(
    {
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    },
    {
      sequelize,
      modelName: "CartItem",
      tableName: "cart_items",
      timestamps: true,
    }
  );

  // Associações
  User.hasMany(CartItem, { foreignKey: "userId" });
  CartItem.belongsTo(User, { foreignKey: "userId" });

  Product.hasMany(CartItem, { foreignKey: "productId" });
  CartItem.belongsTo(Product, { foreignKey: "productId" });

  return CartItem;
};
