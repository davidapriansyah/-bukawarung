import { ObjectId, WithId } from "mongodb";
import { db } from "@/src/db/config";

export type WishListInput = {
  userId: ObjectId;
  productId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type IWishList = WithId<WishListInput>;

export default class Wishlist {
  static getCollection() {
    return db.collection<WishListInput>("wishlists");
  }

  static async getUserWishlist(userId: string): Promise<IWishList[]> {
    return this.getCollection()
      .find({ userId: new ObjectId(userId) })
      .toArray(); // Pastikan menggunakan ObjectId untuk query
  }

  static async addProductToWishlist(
    userId: string,
    productId: string
  ): Promise<IWishList> {
    const wishlistItem = {
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.getCollection().insertOne(wishlistItem);
    return { _id: result.insertedId, ...wishlistItem };
  }

  static async removeProductFromWishlist(
    userId: string,
    productId: string
  ): Promise<{ deletedCount: number }> {
    const result = await this.getCollection().deleteOne({
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
    });

    return { deletedCount: result.deletedCount };
  }
}
