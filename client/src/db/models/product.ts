import { WithId } from "mongodb";
import { db } from "../config/index";

export type ProductInput = {
  name: string;
  slug: string;
  description: string;
  excerpt: string;
  price: number;
  tag: string[];
  thumbnail: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type IProduct = WithId<ProductInput>;

export default class Product {
  static getProductCollection() {
    return db.collection<ProductInput>("products");
  }

  static async getProduct(): Promise<IProduct[]> {
    const collection = this.getProductCollection();

    const products: IProduct[] = await collection.find().toArray();
    console.log(products, "ini dari model");

    return products;
  }

  static async getProductBySlug(slug: string): Promise<IProduct | null> {
    const collection = this.getProductCollection();

    // Cari produk berdasarkan slug
    const product = await collection.findOne({ slug });
    // console.log(product, "ini dari model nih");
    return product;
  }

  static async SearchByName(name: string): Promise<IProduct[]> {
    const collection = this.getProductCollection();

    const products: IProduct[] = await collection
      .find({ name: { $regex: new RegExp(name, "i") } })
      .toArray();

    // console.log(products, "Search results");
    return products;
  }
}
