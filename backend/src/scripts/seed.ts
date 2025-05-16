import { connectToDatabase } from "../lib/mongo.js";
import { getEmbedding } from "../lib/openai.js";
import { Product } from "../types.js";

async function seed() {
  const db = await connectToDatabase();
  const productsCollection = db.collection<Product>("products");

  const dummyProducts = [
    {
      name: "Graphic T-Shirt",
      description: "100% cotton t-shirt with summer-themed graphic print.",
      price: 19.99,
      image:
        "https://solidthreads.com/cdn/shop/files/HL5088MSI_shirt_0db892e1-2877-4cdb-a57a-3e1a559b2c8d.jpg?v=1717184252",
    },
    {
      name: "Denim Jacket",
      description: "Classic blue denim jacket for chilly evenings.",
      price: 49.99,
      image: "https://m.media-amazon.com/images/I/71-BvRng-2L._AC_UY1000_.jpg",
    },
    {
      name: "Summer Dress",
      description: "Lightweight floral summer dress, perfect for warm days.",
      price: 34.99,
      image:
        "https://bb0c914c7c58d6608205-458e09a758fef5c92379297fa78e9b84.ssl.cf2.rackcdn.com/product-hugerect-3409297-254906-1719955894-cbba7ebb1e8a18579e3c5891f8f6e9b9.719955895_type_hugerect_nid_3409297_uid_254906_0",
    },
    {
      name: "Running Shoes",
      description:
        "Hoka. Comfortable sneakers ideal for running and daily wear.",
      price: 59.99,
      image:
        "https://publish.purewow.net/wp-content/uploads/sites/2/2024/08/hoka-mach-6-most-comfortable-sneakers.jpg?fit=680%2C500",
    },
    {
      name: "Baseball Cap",
      description: "Adjustable cotton cap with embroidered logo.",
      price: 14.99,
      image: "https://m.media-amazon.com/images/I/51FE1n+vuqL._AC_SX679_.jpg",
    },
    {
      name: "Hoodie Sweatshirt",
      description: "Cozy fleece hoodie with front pocket and drawstring hood.",
      price: 39.99,
      image:
        "https://www.citythreads.com/cdn/shop/products/FZH-EL_2048x.jpg?v=1638899734",
    },
    {
      name: "Chino Pants",
      description: "Slim-fit chino pants suitable for casual and formal wear.",
      price: 44.99,
      image:
        "https://image.josbank.com/is/image/JosBank/219B_03_TRAVELER_IRON_GATE_MAIN?imPolicy=pdp2",
    },
    {
      name: "Leather Belt",
      description: "Genuine leather belt with classic buckle design.",
      price: 24.99,
      image: "https://m.media-amazon.com/images/I/61QyVj5PacL._AC_SX679_.jpg",
    },
    {
      name: "Beanie Hat",
      description: "Warm knit beanie hat for cold weather.",
      price: 12.99,
      image: "https://m.media-amazon.com/images/I/71c681fpKfL._AC_SX679_.jpg",
    },
    {
      name: "Ankle Boots",
      description: "Stylish ankle boots made from premium leather.",
      price: 89.99,
      image:
        "https://hardnheavy.style/cdn/shop/products/fashion-womens-heels-ankle-boots-luxury-ladies-soft-genuine-leather-boots-003_bea2413b-80ea-4eda-b4d8-e37f76e5ce73.png?v=1679096318&width=1080",
    },
    {
      name: "Polo Shirt",
      description: "Classic polo shirt with ribbed collar and cuffs.",
      price: 29.99,
      image: "https://i.ebayimg.com/images/g/EhYAAOSwkCRmeMRS/s-l1200.png",
    },
    {
      name: "Cargo Shorts",
      description: "Comfortable cargo shorts with multiple pockets.",
      price: 34.99,
      image:
        "https://i5.walmartimages.com/seo/IRON-Clothing-Flex-Comfort-Waistband-Stretch-Twill-Multi-Pocket-Cargo-Short-Desert-Camel-38_5f9563bd-7c6d-4ab2-b916-cf1e0a305f40.379b152846ef4fa6102deef444e1a0b1.jpeg",
    },
    {
      name: "Raincoat",
      description: "Waterproof raincoat with adjustable hood.",
      price: 59.99,
      image:
        "https://www.froggtoggs.com/images/UL62104_Royal%20Blue-00.jpg?resizeid=3&resizeh=1600&resizew=1600",
    },
    {
      name: "Flannel Shirt",
      description: "Soft flannel shirt with plaid pattern.",
      price: 27.99,
      image:
        "https://www.gomuskox.com/cdn/shop/files/FGF-Oatmeal-1.jpg?v=1723566840&width=1080",
    },
    {
      name: "Trench Coat",
      description: "Elegant trench coat with belt and double-breasted buttons.",
      price: 99.99,
      image:
        "https://i5.walmartimages.com/asr/8fa7df19-dcbe-4e0c-97f8-93fe964d6cf3.3a957a225b64f7e2f7a85978619016fe.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
    },
    {
      name: "Graphic Hoodie",
      description: "Hoodie with unique graphic design on the back.",
      price: 49.99,
      image:
        "https://hpb.la/wp-content/uploads/2024/12/Timbo-Time-Hoodie-Back.jpg",
    },
    {
      name: "Swim Trunks",
      description: "Quick-dry swim trunks with drawstring waist.",
      price: 24.99,
      image: "https://m.media-amazon.com/images/I/71Pa5xhZ8iL._AC_SX679_.jpg",
    },
    {
      name: "Wool Scarf",
      description: "Soft wool scarf to keep you warm in winter.",
      price: 19.99,
      image: "https://m.media-amazon.com/images/I/717010Tx-lL._AC_UY1000_.jpg",
    },
  ];

  for (const product of dummyProducts) {
    const embedding = await getEmbedding(
      `${product.name}: ${product.description}`
    );
    await productsCollection.insertOne({ 
      ...product, 
      embedding,
      imageUrl: product.image 
    });
    console.log(`Inserted: ${product.name}`);
  }

  console.log("✅ Seeding complete.");
  process.exit(0);
}

seed().catch(console.error);
