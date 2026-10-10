import { PrismaClient, Role, Unit, StockReason } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify } from "../lib/utils/slug";

const db = new PrismaClient();
const fruits = [
  ["Alphonso Mango","mangoes",899,"DOZEN",120,"summer"],["Banganapalli Mango","mangoes",149,"KG",250,"summer"],["Totapuri Mango","mangoes",99,"KG",300,"summer"],["Kesar Mango","mangoes",189,"KG",150,"summer"],["Langra Mango","mangoes",129,"KG",140,"summer"],["Dasheri Mango","mangoes",119,"KG",160,"summer"],["Watermelon","melons",35,"KG",400,"summer"],["Muskmelon","melons",60,"KG",180,"summer"],["Pineapple","tropical",80,"PIECE",120,"summer"],["Lychee","tropical",349,"KG",60,"summer"],["Jackfruit","tropical",70,"KG",80,"summer"],["Jamun","tropical",299,"KG",45,"monsoon"],["Tender Coconut","tropical",45,"PIECE",500,"summer"],["Nagpur Orange","citrus",90,"KG",350,"winter"],["Kinnow","citrus",70,"KG",280,"winter"],["Sweet Lime","citrus",85,"KG",220,"winter"],["Strawberry","berries-grapes",199,"BOX",50,"winter"],["Green Seedless Grapes","berries-grapes",110,"KG",150,"winter"],["Black Grapes","berries-grapes",130,"KG",130,"winter"],["Shimla Apple","apples-pears",220,"KG",260,"monsoon"],["Pear","apples-pears",160,"KG",140,"monsoon"],["Plum","stone-fruits",240,"KG",90,"monsoon"],["Peach","stone-fruits",260,"KG",70,"monsoon"],["Robusta Banana","everyday",60,"DOZEN",600,"year-round"],["Elaichi Banana","everyday",90,"KG",250,"year-round"],["Papaya","everyday",50,"KG",300,"year-round"],["Guava","everyday",80,"KG",200,"monsoon"],["Pomegranate","everyday",190,"KG",180,"winter"],["Custard Apple","everyday",180,"KG",90,"monsoon"],["Chikoo","everyday",80,"KG",160,"winter"],["Amla","everyday",70,"KG",120,"winter"],["Kiwi","exotic",249,"BOX",40,"winter"],["Dragon Fruit","exotic",280,"KG",75,"monsoon"],["Avocado","exotic",380,"KG",40,"monsoon"],["Fresh Figs","exotic",349,"BOX",30,"monsoon"],["Mango Season Box","fruit-boxes",749,"BOX",60,"summer"],["Winter Citrus Box","fruit-boxes",429,"BOX",80,"winter"],["Monsoon Fruit Basket","fruit-boxes",899,"BOX",35,"monsoon"],
] as const;
const categories = ["mangoes","citrus","berries-grapes","tropical","melons","apples-pears","stone-fruits","everyday","exotic","fruit-boxes"];
const seasons = [{ slug:"summer", name:"Summer", emoji:"☀️", months:[3,4,5,6], color:"#f59e0b" },{ slug:"monsoon", name:"Monsoon", emoji:"🌧️", months:[7,8,9], color:"#0d9488" },{ slug:"winter", name:"Winter", emoji:"❄️", months:[10,11,12,1,2], color:"#e11d48" }];
const imageCategoryBySeedCategory: Record<string, string> = { "berries-grapes": "berries", "apples-pears": "apples", "stone-fruits": "stone", "fruit-boxes": "boxes" };

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("Refusing to seed production database");
  const seasonRows = new Map<string,string>();
  for (const season of seasons) { const { color, ...seasonData } = season; const row = await db.season.upsert({ where:{ slug:season.slug }, update:{...seasonData, themeColor:color}, create:{...seasonData, themeColor:color} }); seasonRows.set(season.slug,row.id); }
  const categoryRows = new Map<string,string>();
  for (const slug of categories) { const row = await db.category.upsert({ where:{ slug }, update:{ name:slug.replace(/-/g," ") }, create:{ name:slug.replace(/-/g," "), slug } }); categoryRows.set(slug,row.id); }
  for (const [name, cat, rupees, unit, stock, season] of fruits) {
    const slug = slugify(name);
    const imageCategory = imageCategoryBySeedCategory[cat] ?? cat;
    const product = await db.product.upsert({ where:{ slug }, update:{ pricePaise:rupees*100, isActive:true }, create:{ name, slug, description:`Fresh ${name}, carefully selected at peak season.`, shortDescription:`Seasonal ${name}`, pricePaise:rupees*100, unit:unit as Unit, origin:"India", tasteNotes:"Fresh and naturally delicious", shelfLifeDays:7, nutritionHighlights:["Fibre","Vitamin C"], tags:["seasonal"], isSeasonal:season !== "year-round", isFeatured:fruits.findIndex((fruit) => fruit[0] === name) % 4 === 0, categoryId:categoryRows.get(cat)! , inventory:{ create:{ quantity:stock, lowStockThreshold:10, movements:{ create:{ delta:stock, reason:StockReason.INITIAL, note:"Seed stock" } } } } } });
    await db.productImage.deleteMany({ where: { productId: product.id } });
    await db.productImage.create({ data: { productId: product.id, url: `/api/images/${slug}?category=${imageCategory}`, alt: `Fresh ${name}`, sortOrder: 0 } });
    const seasonSlug = season === "year-round" ? "winter" : season;
    await db.productSeason.upsert({ where:{ productId_seasonId:{ productId:product.id, seasonId:seasonRows.get(seasonSlug)! } }, update:{ peakMonths:[] }, create:{ productId:product.id, seasonId:seasonRows.get(seasonSlug)!, peakMonths:[] } });
  }
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const customerEmail = process.env.SEED_CUSTOMER_EMAIL?.trim().toLowerCase();
  const customerPassword = process.env.SEED_CUSTOMER_PASSWORD;
  if (adminEmail && adminPassword && customerEmail && customerPassword) {
    const adminHash = await bcrypt.hash(adminPassword, 12);
    await db.user.upsert({ where:{ email:adminEmail }, update:{ role:Role.ADMIN, passwordHash:adminHash }, create:{ name:"Store Admin", email:adminEmail, passwordHash:adminHash, role:Role.ADMIN, cart:{create:{}}, wishlist:{create:{}} } });
    const customerHash = await bcrypt.hash(customerPassword, 12);
    await db.user.upsert({ where:{ email:customerEmail }, update:{ passwordHash:customerHash }, create:{ name:"Test Customer", email:customerEmail, passwordHash:customerHash, cart:{create:{}}, wishlist:{create:{}} } });
  } else {
    console.log("Demo users skipped. Set SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_CUSTOMER_EMAIL and SEED_CUSTOMER_PASSWORD to create them.");
  }
  console.log(`Seeded ${fruits.length} products, ${seasons.length} seasons and ${categories.length} categories.`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => db.$disconnect());
