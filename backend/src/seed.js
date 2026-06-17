require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Review = require('./models/Review');
const Blog = require('./models/Blog');

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Blog.deleteMany({});
    console.log('Cleaned database collections...');

    // 1. Create Users
    const admin = new User({
      name: 'Nursery Admin',
      email: 'admin@nursery.com',
      password: 'admin123',
      role: 'admin',
      addresses: [
        {
          fullName: 'Admin Main Office',
          addressLine1: '100 Green Garden Lane',
          addressLine2: 'Suite A',
          city: 'Greenville',
          state: 'California',
          postalCode: '90210',
          country: 'United States',
          phone: '123-456-7890',
          isDefault: true
        }
      ]
    });

    const customer = new User({
      name: 'John Doe',
      email: 'customer@nursery.com',
      password: 'password123',
      role: 'customer',
      addresses: [
        {
          fullName: 'John Doe Home',
          addressLine1: '456 Bloom Street',
          city: 'Floral City',
          state: 'Florida',
          postalCode: '33536',
          country: 'United States',
          phone: '987-654-3210',
          isDefault: true
        }
      ]
    });

    await admin.save();
    await customer.save();
    console.log('Seeded Users: admin@nursery.com / customer@nursery.com');

    // 2. Create Products
    const productsData = [
      {
        name: 'Snake Plant (Sansevieria Laurentii)',
        description: 'The Snake Plant is one of the hardiest house plants available. Featuring striking upright sword-like green leaves with yellow margins, it is highly efficient at filtering indoor air.',
        price: 29.99,
        stock: 25,
        images: [
          'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
        ],
        category: 'Indoor Plants',
        difficulty: 'Easy',
        sunlight: 'Low to Partial Indirect Light',
        water: 'Once every 2-3 weeks (allow soil to dry out)',
        careInstructions: 'Water only when the soil has completely dried out. Avoid overwatering as it causes root rot. Wipe leaves occasionally with a damp cloth to remove dust.',
        growthInfo: 'Slow grower, reaches up to 3 to 4 feet indoors.',
        indoorOutdoor: 'Indoor'
      },
      {
        name: 'Fiddle Leaf Fig (Ficus Lyrata)',
        description: 'An iconic, premium statement plant with large, glossy violin-shaped leaves. Perfect for adding a bold tropical accent to a bright space in your home.',
        price: 59.99,
        stock: 4, // Low stock product
        images: [
          'https://images.unsplash.com/photo-1597055181300-e3633a207518?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&w=600&q=80'
        ],
        category: 'Indoor Plants',
        difficulty: 'Hard',
        sunlight: 'Bright Consistent Indirect Sunlight',
        water: 'Once a week when the top 2 inches of soil is dry',
        careInstructions: 'Requires consistent environments. Rotate every month for even light. Avoid drafts and cold air currents.',
        growthInfo: 'Can grow up to 6-10 feet tall indoors if cared for correctly.',
        indoorOutdoor: 'Indoor'
      },
      {
        name: 'Organic Aloe Vera',
        description: 'A beautiful succulent plant famous for the soothing gel inside its fleshy leaves. Very easy to care for and perfect for window sills.',
        price: 15.49,
        stock: 45,
        images: [
          'https://images.unsplash.com/photo-1596547613758-c10b57e793cb?auto=format&fit=crop&w=600&q=80'
        ],
        category: 'Succulents',
        difficulty: 'Easy',
        sunlight: 'Bright Direct Sunlight',
        water: 'Deeply but infrequently (approx. every 3 weeks)',
        careInstructions: 'Ensure the pot has excellent drainage. Do not let water pool in the leaf rosettes.',
        growthInfo: 'Grows short stems with rosettes spreading outward up to 1-2 feet.',
        indoorOutdoor: 'Both'
      },
      {
        name: 'Dwarf Juniper Bonsai',
        description: 'This classic outdoor evergreen bonsai tree features a traditional trailing cascade branch pattern. Trained meticulously over years.',
        price: 85.00,
        stock: 3, // Low stock product
        images: [
          'https://images.unsplash.com/photo-1613143715124-7389a9dbd178?auto=format&fit=crop&w=600&q=80'
        ],
        category: 'Bonsai',
        difficulty: 'Hard',
        sunlight: 'Full Sun to Partial Shade',
        water: 'Keep moist but not waterlogged (daily checking)',
        careInstructions: 'Best kept outdoors. Requires winter dormancy protection in freezing climates. Mist foliage daily.',
        growthInfo: 'Carefully pruned and structured, maintains a miniature size of 8-12 inches.',
        indoorOutdoor: 'Outdoor'
      },
      {
        name: 'Sweet Lavender (Lavandula Angustifolia)',
        description: 'Beloved for its fragrant purple blooms and soothing scent. Attracts butterflies and bees while repelling pests naturally.',
        price: 19.99,
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1528826722302-d4758b9ebed4?auto=format&fit=crop&w=600&q=80'
        ],
        category: 'Flowering Plants',
        difficulty: 'Medium',
        sunlight: 'Full direct sunlight (at least 6 hours)',
        water: 'Water deeply when dry, drought-tolerant once established',
        careInstructions: 'Prune annually in early spring to encourage bushy growth. Needs highly alkaline, well-draining soil.',
        growthInfo: 'Forms a rounded shrub up to 2-3 feet tall.',
        indoorOutdoor: 'Outdoor'
      },
      {
        name: 'Peace Lily (Spathiphyllum)',
        description: 'An elegant indoor plant featuring white hood-like flowers (spathes) and deep green glossy foliage. Extremely communicative - it droops when thirsty!',
        price: 24.99,
        stock: 18,
        images: [
          'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&w=600&q=80'
        ],
        category: 'Flowering Plants',
        difficulty: 'Easy',
        sunlight: 'Medium to Low Indirect Light',
        water: 'Keep soil lightly moist, water when leaves start to droop slightly',
        careInstructions: 'Sensitive to fluoride in tap water (use distilled or filtered water). Wipe leaves to keep them shiny.',
        growthInfo: 'Reaches a height of 1.5 to 3 feet.',
        indoorOutdoor: 'Indoor'
      },
      {
        name: 'Organic Heirloom Tomato Seeds Pack',
        description: 'Premium packet containing 100 organic, non-GMO Heirloom beefsteak tomato seeds. Features outstanding sweet flavor and heavy yields.',
        price: 4.99,
        stock: 150,
        images: [
          'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80'
        ],
        category: 'Seeds',
        difficulty: 'Easy',
        sunlight: 'Full Direct Sun',
        water: 'Keep soil moist during germination',
        careInstructions: 'Sow indoors 6-8 weeks before the last frost date. Transplant outdoors in a warm, sunny location.',
        growthInfo: 'Indeterminate vine, requires stakes or cages for support.',
        indoorOutdoor: 'Outdoor'
      },
      {
        name: 'Handcrafted Terracotta Clay Pot (8-inch)',
        description: 'Traditional breathable terracotta pot crafted with drainage holes. Promotes aeration and keeps plant roots cool and dry.',
        price: 12.99,
        stock: 50,
        images: [
          'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80'
        ],
        category: 'Pots & Accessories',
        difficulty: 'Easy',
        sunlight: 'N/A',
        water: 'N/A',
        careInstructions: 'Soak pot in water for 30 minutes before potting plants to prevent it from absorbing moisture from fresh soil.',
        growthInfo: '8-inch diameter, fits medium plants.',
        indoorOutdoor: 'Both'
      },
      {
        name: 'Classic Ergonomic Gardening Shears',
        description: 'Professional-grade bypass pruning shears with carbon steel blades and comfortable non-slip handles for neat cuts.',
        price: 18.99,
        stock: 20,
        images: [
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80'
        ],
        category: 'Pots & Accessories',
        difficulty: 'Easy',
        sunlight: 'N/A',
        water: 'N/A',
        careInstructions: 'Clean blades after every use with soapy water and dry completely. Apply light oil to joints periodically.',
        growthInfo: 'Ergonomic 8-inch design.',
        indoorOutdoor: 'Both'
      },
      {
        name: 'Echeveria Rosette Succulent',
        description: 'A gorgeous desert native forming symmetrical rose-like rosettes of pale-blue green leaves with pastel pink margins.',
        price: 8.99,
        stock: 0, // Out of stock product
        images: [
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
        ],
        category: 'Succulents',
        difficulty: 'Easy',
        sunlight: 'Bright Light / Partial Sun',
        water: 'Soak and dry method (water only when bone dry)',
        careInstructions: 'Plant in gritty succulent mix. Do not let water sit in the rosette center as it breeds rot.',
        growthInfo: 'Maintains tight rosette clumps of 3-6 inches wide.',
        indoorOutdoor: 'Both'
      }
    ];

    const seededProducts = await Product.insertMany(productsData);
    console.log(`Seeded ${seededProducts.length} Products!`);

    // 3. Create Reviews
    const reviewsData = [
      {
        user: customer._id,
        name: customer.name,
        product: seededProducts[0]._id, // Snake Plant
        rating: 5,
        comment: 'Absolutely love this Snake plant! It arrived healthy, looks gorgeous in my room, and is indeed extremely easy to keep alive!'
      },
      {
        user: customer._id,
        name: customer.name,
        product: seededProducts[1]._id, // Fiddle Fig
        rating: 4,
        comment: 'Stunning tree! It is definitely picky about light and took a couple of weeks to settle in, but it looks incredibly premium.'
      },
      {
        user: admin._id,
        name: admin.name,
        product: seededProducts[0]._id, // Snake Plant
        rating: 4,
        comment: 'Great plant for beginners. It adapts to almost any lighting condition.'
      }
    ];

    await Review.insertMany(reviewsData);
    console.log('Seeded initial reviews!');

    // Recalculate average ratings and numReviews on products
    for (let prod of seededProducts) {
      const prodReviews = await Review.find({ product: prod._id });
      if (prodReviews.length > 0) {
        const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
        prod.rating = parseFloat(avg.toFixed(1));
        prod.numReviews = prodReviews.length;
        await prod.save();
      }
    }
    console.log('Recalculated product ratings and reviews counts...');

    // 4. Create Blogs
    const blogsData = [
      {
        title: 'Complete Snake Plant Care Guide: The Indestructible Houseplant',
        content: `Snake plants (Sansevieria) are the ultimate low-maintenance plants. Whether you are a seasoned plant collector or a complete beginner, these plants are a fantastic choice.
        
        ### Lighting Requirements
        One of the biggest advantages of snake plants is their flexibility. They survive in very low-light conditions but will thrive in bright, indirect light. Avoid direct, scorching afternoon sun, which can burn their thick leaves.
        
        ### Water Schedule
        The golden rule of snake plants is: **when in doubt, do not water**. These plants are succulents and store water in their fleshy leaves. Only water when the soil is dry 100% of the way through. In winter, this might mean watering only once a month.
        
        ### Common Problems
        - **Drooping Leaves**: Usually caused by root rot due to overwatering. Remove soggy roots and repot in well-draining soil.
        - **Wrinkled Leaves**: A sign of severe dehydration. Give them a thorough soak and drain.`,
        excerpt: 'Learn how to keep your snake plant thriving with our simple, foolproof watering and lighting tips.',
        authorName: 'Nursery Expert',
        author: admin._id,
        imageUrl: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80',
        readTime: '4 min read',
        tags: ['Indoor Plants', 'Care Guide', 'Beginner Friendly']
      },
      {
        title: 'How to Prevent Root Rot: The Silent Succulent Killer',
        content: `Succulents are built to withstand drought, not floods. Root rot is the number one cause of succulent death, but it is entirely preventable if you know the signs.
        
        ### What Causes Root Rot?
        Root rot occurs when roots sit in wet, soggy soil for extended periods. This suffocates the root tissues and invites harmful soil-borne fungi.
        
        ### Prevention Tips
        1. **Drainage Holes**: Always use pots with drainage holes. Without them, excess water accumulates at the bottom.
        2. **Soil Mix**: Do not use standard potting soil. Mix it with 50% pumice, perlite, or coarse sand to allow rapid drainage.
        3. **The Soak & Dry Method**: Water your succulents thoroughly until water runs out of the drainage hole, then let the soil dry out completely before watering again.`,
        excerpt: 'Understand why root rot happens and learn key watering techniques to save your succulents.',
        authorName: 'Botanist Sarah',
        author: admin._id,
        imageUrl: 'https://images.unsplash.com/photo-1596547613758-c10b57e793cb?auto=format&fit=crop&w=600&q=80',
        readTime: '6 min read',
        tags: ['Succulents', 'Plant Care', 'Troubleshooting']
      },
      {
        title: 'Caring for your Bonsai: Balancing Water and Sun',
        content: `Bonsai is not just gardening; it is an art form. Keeping a tree miniature requires conscious pruning and specific watering schedules.
        
        ### Location
        Most traditional bonsai, like Junipers and Maples, are outdoor trees. They need direct morning sunlight and protection from dry winds.
        
        ### Watering
        Never water your bonsai on a rigid schedule. Instead, check the soil daily. Press your finger about a half-inch into the soil. If it feels slightly dry, it is time to water. Water until it drains out the bottom.`,
        excerpt: 'An introduction to bonsai cultivation, detailing the daily checking routine and outdoor requirements.',
        authorName: 'Master Kenji',
        author: admin._id,
        imageUrl: 'https://images.unsplash.com/photo-1613143715124-7389a9dbd178?auto=format&fit=crop&w=600&q=80',
        readTime: '8 min read',
        tags: ['Bonsai', 'Pruning', 'Outdoor']
      }
    ];

    await Blog.insertMany(blogsData);
    console.log('Seeded blog posts!');

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error during database seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
