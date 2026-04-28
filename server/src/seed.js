/**
 * SEED SCRIPT – Football Shoes Shop
 * Chạy: node src/seed.js
 * Sẽ XOÁ toàn bộ data cũ rồi insert lại data mẫu
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();

// ── Models (inline để seed.js chạy độc lập) ─────────────────────

// ── sizeSchema
const sizeSchema = new mongoose.Schema({ size: Number, stock: Number }, { _id: false });

// ── reviewSchema
const reviewSchema = new mongoose.Schema(
  { user: mongoose.Schema.Types.ObjectId, name: String, rating: Number, comment: String },
  { timestamps: true },
);

// ── productSchema
const productSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true },
    slug:          { type: String, unique: true, lowercase: true },
    price:         { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    description:   { type: String, required: true },
    images:        [String],
    tier:          { type: String, enum: ['Elite', 'Pro', 'Academy'] },
    surfaceType:   { type: String, enum: ['FG', 'AG', 'TF', 'IC', 'SG'] },
    category:      { type: String, enum: ['Phantom', 'Mercurial', 'Tiempo', 'Vapor', 'Other'] },
    sizes:         [sizeSchema],
    totalStock:    { type: Number, default: 0 },
    isFeatured:    { type: Boolean, default: false },
    isActive:      { type: Boolean, default: true },
    reviews:       [reviewSchema],
    rating:        { type: Number, default: 0 },
    numReviews:    { type: Number, default: 0 },
    color:         { type: String, default: '' },
    colorHex:      { type: String, default: '#000000' },
    tags:          [String],
  },
  { timestamps: true },
);
productSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
  }
  this.totalStock = this.sizes.reduce((s, x) => s + x.stock, 0);
});

// ── userSchema
const addressSchema = new mongoose.Schema(
  { fullName: String, phone: String, street: String, ward: String, district: String, city: String, isDefault: Boolean },
  { _id: false },
);
const userSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    password:  { type: String, required: true, select: false },
    role:      { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar:    { type: String, default: '' },
    addresses: [addressSchema],
    wishlist:  [mongoose.Schema.Types.ObjectId],
    isActive:  { type: Boolean, default: true },
  },
  { timestamps: true },
);
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ── orderSchema
const itemSchema = new mongoose.Schema(
  { product: mongoose.Schema.Types.ObjectId, name: String, image: String, price: Number, size: Number, quantity: Number },
  { _id: false },
);
const orderSchema = new mongoose.Schema(
  {
    user:          mongoose.Schema.Types.ObjectId,
    items:         [itemSchema],
    shippingInfo:  { fullName: String, phone: String, email: String, street: String, ward: String, district: String, city: String },
    paymentMethod: { type: String, enum: ['cod', 'bank_transfer', 'vnpay'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'],     default: 'pending' },
    orderStatus:   { type: String, enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'], default: 'pending' },
    itemsPrice:    Number,
    shippingPrice: { type: Number, default: 0 },
    totalPrice:    Number,
    note:          { type: String, default: '' },
    deliveredAt:   Date,
  },
  { timestamps: true },
);

const Product = mongoose.model('Product', productSchema);
const User    = mongoose.model('User', userSchema);
const Order   = mongoose.model('Order', orderSchema);

// ─────────────────────────────────────────────────────────────────
// DATA MẪU
// ─────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    name: 'Nike Air Zoom Mercurial Vapor 16 Elite FG',
    price: 5990000,
    originalPrice: 6500000,
    description: 'Phiên bản đặc biệt Elite FG với thiết kế đỉnh cao. Cải thiện độ bám sân và tăng tốc bứt phá.',
    images: ['https://cdn.hstatic.net/products/1000061481/anh_sp_add_web_1-01-02-02-02-2-2-2_f4fc0131fac54da880a83c0f4641b9b7.jpg'],
    tier: 'Elite',
    surfaceType: 'FG',
    category: 'Vapor',
    sizes: [{ size: 39, stock: 5 }, { size: 40, stock: 8 }, { size: 41, stock: 10 }, { size: 42, stock: 12 }],
    isFeatured: true,
    rating: 4.8, numReviews: 24,
    color: 'Plum Eclipse', colorHex: '#4a2c40',
    tags: ['new', 'limited'],
  },
  {
    name: 'Nike Air Zoom Mercurial Vapor 16 Pro FG',
    price: 3890000,
    originalPrice: 4200000,
    description: 'Bản Pro nhẹ nhàng, thiết kế Sunset Pulse nổi bật. Dành cho sân cỏ tự nhiên.',
    images: ['https://cdn.hstatic.net/products/1000061481/anh_sp_add_we-02-02-02-2-2-2_00edfc17218e4cbc959b591f14031dc4.jpg'],
    tier: 'Pro',
    surfaceType: 'FG',
    category: 'Vapor',
    sizes: [{ size: 40, stock: 4 }, { size: 41, stock: 8 }, { size: 42, stock: 10 }],
    isFeatured: true,
    rating: 4.7, numReviews: 18,
    color: 'Sunset Pulse', colorHex: '#ff4c4c',
    tags: ['bestseller'],
  },
  {
    name: 'Nike Air Zoom Mercurial Vapor 16 Pro TF',
    price: 3350000,
    originalPrice: null,
    description: 'Sự lựa chọn số 1 cho sân cỏ nhân tạo. Bản Vini Jr. Personal Edition.',
    images: ['https://cdn.hstatic.net/products/1000061481/anh_sp_add-01-01-07173-w3-3_c2e75a31a04441979b655bb0eb82aafa.jpg'],
    tier: 'Pro',
    surfaceType: 'TF',
    category: 'Vapor',
    sizes: [{ size: 39, stock: 10 }, { size: 40, stock: 15 }, { size: 41, stock: 20 }, { size: 42, stock: 18 }],
    isFeatured: true,
    rating: 4.9, numReviews: 31,
    color: 'Sunset Pulse', colorHex: '#ff4c4c',
    tags: ['bestseller', 'new'],
  },
  {
    name: 'Nike Air Zoom Mercurial Vapor 16 Academy TF',
    price: 2250000,
    originalPrice: 2500000,
    description: 'Phân khúc Academy dễ tiếp cận, thiết kế đẹp mắt. Đế đinh TF bám sân hiệu quả.',
    images: ['https://cdn.hstatic.net/products/1000061481/anh_sp_add-091-01-01-04-07173-w3-2_50237842a8b64040873e952d4b6aabc8.jpg'],
    tier: 'Academy',
    surfaceType: 'TF',
    category: 'Vapor',
    sizes: [{ size: 39, stock: 8 }, { size: 40, stock: 12 }, { size: 41, stock: 16 }, { size: 42, stock: 14 }],
    isFeatured: true,
    rating: 4.5, numReviews: 53,
    color: 'Sunset Pulse', colorHex: '#ff4c4c',
    tags: [],
  },
  {
    name: 'Nike Tiempo Ligera Pro TF',
    price: 2950000,
    originalPrice: 3200000,
    description: 'Êm ái với chất liệu da cao cấp, Tiempo Ligera Pro là sự lựa chọn an toàn và ổn định.',
    images: ['https://cdn.hstatic.net/products/1000061481/anh_sp_add_we04-03-2_6a59a35393bb478bbed9f8baaf31b22e.jpg'],
    tier: 'Pro',
    surfaceType: 'TF',
    category: 'Tiempo',
    sizes: [{ size: 40, stock: 14 }, { size: 41, stock: 18 }, { size: 42, stock: 16 }, { size: 43, stock: 10 }],
    isFeatured: true,
    rating: 4.4, numReviews: 19,
    color: 'White/Black', colorHex: '#ffffff',
    tags: [],
  },
  {
    name: 'Nike Tiempo Ligera Pro TF Attack',
    price: 2950000,
    originalPrice: null,
    description: 'Phiên bản Attack phối màu phá cách. Độ êm tuyệt đối trên mọi mặt sân cứng.',
    images: ['https://cdn.hstatic.net/products/1000061481/anh_sp_add_web_301-01-04-03-2_0a848213faac4c978badfc04dbbaa2b7.jpg'],
    tier: 'Pro',
    surfaceType: 'TF',
    category: 'Tiempo',
    sizes: [{ size: 39, stock: 5 }, { size: 40, stock: 8 }, { size: 41, stock: 10 }],
    isFeatured: false,
    rating: 4.2, numReviews: 12,
    color: 'Racer Blue', colorHex: '#0000ff',
    tags: [],
  },
  {
    name: 'Nike Air Zoom Mercurial Vapor 16 Pro FG Attack',
    price: 3690000,
    originalPrice: 4000000,
    description: 'Màu Racer Blue cực ngầu. Công nghệ Air Zoom đệm gót chân bảo vệ tối đa.',
    images: ['https://cdn.hstatic.net/products/1000061481/anh_sp-02-02-02-02-02-02-02-01-01-02-02-02-2-2_3a3a4feb47c4435fa7c056954b19fa1f.jpg'],
    tier: 'Pro',
    surfaceType: 'FG',
    category: 'Vapor',
    sizes: [{ size: 40, stock: 6 }, { size: 41, stock: 9 }, { size: 42, stock: 11 }],
    isFeatured: true,
    rating: 4.6, numReviews: 42,
    color: 'Racer Blue', colorHex: '#0000ff',
    tags: ['new'],
  },
  {
    name: 'Nike Phantom GX 2 Pro Low Cut TF',
    price: 2890000,
    originalPrice: null,
    description: 'Dòng Phantom nổi tiếng với thiết kế Low Cut linh hoạt. Hỗ trợ sút bóng xoáy.',
    images: ['https://cdn.hstatic.net/products/1000061481/a-098883-12-2_9de2a7bf18a94a4baeac97e0e345ba4a.jpg'],
    tier: 'Pro',
    surfaceType: 'TF',
    category: 'Phantom',
    sizes: [{ size: 38, stock: 6 }, { size: 39, stock: 10 }, { size: 40, stock: 14 }],
    isFeatured: true,
    rating: 4.5, numReviews: 28,
    color: 'Pink Blast', colorHex: '#ff66b2',
    tags: ['bestseller'],
  },
  {
    name: 'Nike Air Zoom Mercurial Superfly 10 Academy TF',
    price: 2250000,
    originalPrice: 2400000,
    description: 'Thiết kế cao cổ ôm cổ chân, giúp an toàn hơn trong các pha tranh chấp.',
    images: ['https://cdn.hstatic.net/products/1000061481/a-098883-2-2_dd287cef3c8c410ca082d1f9ac6f1494.jpg'],
    tier: 'Academy',
    surfaceType: 'TF',
    category: 'Mercurial',
    sizes: [{ size: 40, stock: 22 }, { size: 41, stock: 18 }, { size: 42, stock: 12 }],
    isFeatured: true,
    rating: 4.3, numReviews: 67,
    color: 'Racer Blue', colorHex: '#0000ff',
    tags: [],
  },
  {
    name: 'Nike Air Zoom Mercurial Vapor 16 Academy TF Attack',
    price: 2050000,
    originalPrice: null,
    description: 'Dòng Academy thiết kế low-cut, rất dễ mang và thoải mái, bám sân cực tốt. Phối màu Racer Blue.',
    images: ['https://cdn.hstatic.net/products/1000061481/a-098883-222-2_8f76293129b3447eaa96d726cb19eb3b.jpg'],
    tier: 'Academy',
    surfaceType: 'TF',
    category: 'Vapor',
    sizes: [{ size: 39, stock: 20 }, { size: 40, stock: 25 }, { size: 41, stock: 30 }],
    isFeatured: false,
    rating: 4.1, numReviews: 89,
    color: 'Racer Blue', colorHex: '#0000ff',
    tags: [],
  }
];

const USERS = [
  {
    name: 'Admin',
    email: 'admin@nikefootball.vn',
    password: 'admin123',
    role: 'admin',
    avatar: '',
    addresses: [
      {
        fullName: 'Admin Nike',
        phone: '0901234567',
        street: '1 Nguyễn Văn Linh',
        ward: 'Phường Tân Phong',
        district: 'Quận 7',
        city: 'TP. Hồ Chí Minh',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@gmail.com',
    password: 'user1234',
    role: 'user',
    addresses: [
      {
        fullName: 'Nguyễn Văn An',
        phone: '0912345678',
        street: '123 Lê Lợi',
        ward: 'Phường Bến Nghé',
        district: 'Quận 1',
        city: 'TP. Hồ Chí Minh',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Trần Thị Bình',
    email: 'binh.tran@gmail.com',
    password: 'user1234',
    role: 'user',
    addresses: [
      {
        fullName: 'Trần Thị Bình',
        phone: '0987654321',
        street: '45 Trần Hưng Đạo',
        ward: 'Phường Nguyễn Cư Trinh',
        district: 'Quận 1',
        city: 'TP. Hồ Chí Minh',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Lê Hoàng Cường',
    email: 'cuong.le@gmail.com',
    password: 'user1234',
    role: 'user',
    addresses: [
      {
        fullName: 'Lê Hoàng Cường',
        phone: '0909876543',
        street: '77 Đinh Tiên Hoàng',
        ward: 'Phường Đa Kao',
        district: 'Quận 1',
        city: 'TP. Hồ Chí Minh',
        isDefault: true,
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// SEED FUNCTION
// ─────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🔗 Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGO_CONNECT_URL);
  console.log('✅ Connected!\n');

  // 1. Xoá data cũ
  console.log('🗑  Dropping old data...');
  await Promise.all([Product.deleteMany({}), User.deleteMany({}), Order.deleteMany({})]);
  console.log('   Products, Users, Orders cleared.\n');

  // 2. Insert Users (password sẽ tự hash qua pre-save)
  console.log('👤 Seeding users...');
  const savedUsers = [];
  for (const u of USERS) {
    const doc = new User(u);
    await doc.save();
    savedUsers.push(doc);
    console.log(`   ✔ ${doc.role.toUpperCase()} – ${doc.email}`);
  }

  // 3. Insert Products
  console.log('\n👟 Seeding products...');
  const savedProducts = [];
  for (const p of PRODUCTS) {
    const doc = new Product(p);
    await doc.save();
    savedProducts.push(doc);
    console.log(`   ✔ [${doc.tier}] ${doc.name} – ${doc.price.toLocaleString('vi-VN')}₫`);
  }

  // 4. Insert Orders mẫu
  console.log('\n📦 Seeding orders...');
  const user1  = savedUsers.find((u) => u.email === 'an.nguyen@gmail.com');
  const user2  = savedUsers.find((u) => u.email === 'binh.tran@gmail.com');
  const prod1  = savedProducts[0]; // Mercurial Elite FG
  const prod2  = savedProducts[3]; // Tiempo Pro FG
  const prod3  = savedProducts[6]; // Mercurial Academy

  const orders = [
    {
      user: user1._id,
      items: [
        { product: prod1._id, name: prod1.name, image: prod1.images[0], price: prod1.price, size: 42, quantity: 1 },
        { product: prod3._id, name: prod3.name, image: prod3.images[0], price: prod3.price, size: 40, quantity: 2 },
      ],
      shippingInfo: {
        fullName: 'Nguyễn Văn An', phone: '0912345678',
        email: 'an.nguyen@gmail.com', street: '123 Lê Lợi',
        ward: 'Phường Bến Nghé', district: 'Quận 1', city: 'TP. Hồ Chí Minh',
      },
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus:   'delivered',
      itemsPrice:    prod1.price + prod3.price * 2,
      shippingPrice: 30_000,
      totalPrice:    prod1.price + prod3.price * 2 + 30_000,
      deliveredAt:   new Date('2025-12-20'),
      note: 'Giao giờ hành chính',
    },
    {
      user: user2._id,
      items: [
        { product: prod2._id, name: prod2.name, image: prod2.images[0], price: prod2.price, size: 41, quantity: 1 },
      ],
      shippingInfo: {
        fullName: 'Trần Thị Bình', phone: '0987654321',
        email: 'binh.tran@gmail.com', street: '45 Trần Hưng Đạo',
        ward: 'Phường Nguyễn Cư Trinh', district: 'Quận 1', city: 'TP. Hồ Chí Minh',
      },
      paymentMethod: 'bank_transfer',
      paymentStatus: 'paid',
      orderStatus:   'shipping',
      itemsPrice:    prod2.price,
      shippingPrice: 0,
      totalPrice:    prod2.price,
      note: '',
    },
    {
      user: user1._id,
      items: [
        { product: prod1._id, name: prod1.name, image: prod1.images[0], price: prod1.price, size: 43, quantity: 1 },
      ],
      shippingInfo: {
        fullName: 'Nguyễn Văn An', phone: '0912345678',
        email: 'an.nguyen@gmail.com', street: '123 Lê Lợi',
        ward: 'Phường Bến Nghé', district: 'Quận 1', city: 'TP. Hồ Chí Minh',
      },
      paymentMethod: 'vnpay',
      paymentStatus: 'paid',
      orderStatus:   'confirmed',
      itemsPrice:    prod1.price,
      shippingPrice: 30_000,
      totalPrice:    prod1.price + 30_000,
      note: 'Để trước cửa nhà',
    },
  ];

  for (const o of orders) {
    await Order.create(o);
    console.log(`   ✔ Order for ${o.shippingInfo.fullName} – ${o.orderStatus} – ${o.totalPrice.toLocaleString('vi-VN')}₫`);
  }

  console.log('\n🎉 SEED COMPLETE!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Users:    ${savedUsers.length}`);
  console.log(`   Products: ${savedProducts.length}`);
  console.log(`   Orders:   ${orders.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\nTài khoản test:');
  console.log('  admin@nikefootball.vn  / admin123  (role: admin)');
  console.log('  an.nguyen@gmail.com    / user1234  (role: user)');
  console.log('  binh.tran@gmail.com    / user1234  (role: user)');
  console.log('  cuong.le@gmail.com     / user1234  (role: user)');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
