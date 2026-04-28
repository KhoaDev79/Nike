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
    name: 'Nike Phantom 6 Academy Low Cut TF Erling Haaland',
    price: 2450000,
    originalPrice: 2990000,
    description: 'Phiên bản đặc biệt Erling Haaland Personal Edition. Form giày Low Cut linh hoạt, đinh TF bám sân nhân tạo siêu tốt.',
    images: ['https://cdn.hstatic.net/products/1000061481/anh_sp_hq2326-603-270426_3bc226313c9e45baad6aa079018386c0.jpg'],
    tier: 'Academy',
    surfaceType: 'TF',
    category: 'Phantom',
    sizes: [{ size: 39, stock: 5 }, { size: 40, stock: 8 }, { size: 41, stock: 10 }, { size: 42, stock: 12 }],
    isFeatured: true,
    rating: 4.8, numReviews: 24,
    color: 'Hot Punch/Black', colorHex: '#ff3366',
    tags: ['new', 'limited'],
  },
  {
    name: 'Nike Tiempo Maestro Academy MG United',
    price: 2650000,
    originalPrice: 2939000,
    description: 'Tiempo Maestro Academy đem đến sự mềm mại vượt trội nhờ chất liệu da tổng hợp cao cấp, tối ưu chạm bóng.',
    images: ['https://cdn.hstatic.net/products/1000061481/anh_sp_io8461-201-270426_25574c8111e1499bb540bb4417084527.jpg'],
    tier: 'Academy',
    surfaceType: 'FG',
    category: 'Tiempo',
    sizes: [{ size: 40, stock: 4 }, { size: 41, stock: 8 }, { size: 42, stock: 10 }],
    isFeatured: false,
    rating: 4.7, numReviews: 18,
    color: 'Fossil/Metallic Silver', colorHex: '#eaddcf',
    tags: [],
  },
  {
    name: 'Nike Air Zoom Mercurial Vapor 16 Academy MG United',
    price: 2450000,
    originalPrice: 2999000,
    description: 'Phân khúc Academy dễ tiếp cận với bộ đệm Air Zoom trứ danh, hỗ trợ bứt tốc cực nhanh.',
    images: ['https://cdn.hstatic.net/products/1000061481/anh_sp_io8443-661-200426_b02e17575b67405d95bdfc687ee484f4.jpg'],
    tier: 'Academy',
    surfaceType: 'FG',
    category: 'Vapor',
    sizes: [{ size: 39, stock: 10 }, { size: 40, stock: 15 }, { size: 41, stock: 20 }, { size: 42, stock: 18 }],
    isFeatured: true,
    rating: 4.9, numReviews: 31,
    color: 'Burgundy Crush', colorHex: '#800020',
    tags: ['bestseller'],
  },
  {
    name: 'Nike Air Zoom Mercurial Vapor 16 Academy MG Attack',
    price: 2150000,
    originalPrice: 2669000,
    description: 'Phối màu Racer Blue bắt mắt nằm trong bộ sưu tập Attack, đinh MG đá được cả sân cỏ tự nhiên lẫn nhân tạo.',
    images: ['https://cdn.hstatic.net/products/1000061481/7d2348a0642b410aa011892ffbd5619a_6199d59856cb4a938f7e3c15bb5ade9e.jpg'],
    tier: 'Academy',
    surfaceType: 'FG',
    category: 'Vapor',
    sizes: [{ size: 39, stock: 8 }, { size: 40, stock: 12 }, { size: 41, stock: 16 }, { size: 42, stock: 14 }],
    isFeatured: false,
    rating: 4.5, numReviews: 53,
    color: 'Racer Blue', colorHex: '#0000ff',
    tags: [],
  },
  {
    name: 'Nike Air Zoom Mercurial Vapor 16 Elite FG Mbappé',
    price: 5990000,
    originalPrice: 8239000,
    description: 'Siêu phẩm Elite dành cho sân cỏ tự nhiên, phiên bản cá nhân hoá của Kylian Mbappé. Nhẹ, ôm chân, bám sân hoàn hảo.',
    images: ['https://cdn.hstatic.net/products/1000061481/anh_sp_add_web_1-01-02-02-02-2-2-2_f4fc0131fac54da880a83c0f4641b9b7.jpg'],
    tier: 'Elite',
    surfaceType: 'FG',
    category: 'Vapor',
    sizes: [{ size: 40, stock: 14 }, { size: 41, stock: 18 }, { size: 42, stock: 16 }, { size: 43, stock: 10 }],
    isFeatured: true,
    rating: 4.8, numReviews: 89,
    color: 'Plum Eclipse', colorHex: '#4a2c40',
    tags: ['limited', 'new'],
  },
  {
    name: 'Nike Air Zoom Mercurial Vapor 16 Pro FG Vini Jr.',
    price: 3890000,
    originalPrice: 5069000,
    description: 'Bản Pro cực chất của Vini Jr. với màu Sunset Pulse rực rỡ, tích hợp Air Zoom trợ lực.',
    images: ['https://cdn.hstatic.net/products/1000061481/anh_sp_add_we-02-02-02-2-2-2_00edfc17218e4cbc959b591f14031dc4.jpg'],
    tier: 'Pro',
    surfaceType: 'FG',
    category: 'Vapor',
    sizes: [{ size: 39, stock: 5 }, { size: 40, stock: 8 }, { size: 41, stock: 10 }],
    isFeatured: true,
    rating: 4.6, numReviews: 42,
    color: 'Sunset Pulse', colorHex: '#ff4c4c',
    tags: ['bestseller'],
  },
  {
    name: 'Nike Air Zoom Mercurial Vapor 16 Pro TF Vini Jr.',
    price: 3350000,
    originalPrice: 4109000,
    description: 'Đinh TF bám sân nhân tạo cực tốt, là sự lựa chọn số 1 cho các sân mini 5-7 người.',
    images: ['https://cdn.hstatic.net/products/1000061481/anh_sp_add-01-01-07173-w3-3_c2e75a31a04441979b655bb0eb82aafa.jpg'],
    tier: 'Pro',
    surfaceType: 'TF',
    category: 'Vapor',
    sizes: [{ size: 38, stock: 6 }, { size: 39, stock: 10 }, { size: 40, stock: 14 }],
    isFeatured: true,
    rating: 4.5, numReviews: 28,
    color: 'Sunset Pulse', colorHex: '#ff4c4c',
    tags: ['bestseller', 'new'],
  },
  {
    name: 'Nike Air Zoom Mercurial Vapor 16 Academy TF Vini Jr.',
    price: 2250000,
    originalPrice: 2779000,
    description: 'Dòng Academy dễ tiếp cận, thiết kế đẹp mắt lấy cảm hứng từ lối chơi hoa mỹ của Vinicius Jr.',
    images: ['https://cdn.hstatic.net/products/1000061481/anh_sp_add-091-01-01-04-07173-w3-2_50237842a8b64040873e952d4b6aabc8.jpg'],
    tier: 'Academy',
    surfaceType: 'TF',
    category: 'Vapor',
    sizes: [{ size: 40, stock: 22 }, { size: 41, stock: 18 }, { size: 42, stock: 12 }],
    isFeatured: false,
    rating: 4.3, numReviews: 67,
    color: 'Sunset Pulse', colorHex: '#ff4c4c',
    tags: [],
  },
  {
    name: 'Nike Tiempo Ligera Pro TF',
    price: 2950000,
    originalPrice: 4429000,
    description: 'Da thật êm ái, mang lại cảm giác bóng chân thực nhất. Dòng Tiempo luôn là chân ái cho các vị trí kiến tạo.',
    images: ['https://cdn.hstatic.net/products/1000061481/anh_sp_add_we04-03-2_6a59a35393bb478bbed9f8baaf31b22e.jpg'],
    tier: 'Pro',
    surfaceType: 'TF',
    category: 'Tiempo',
    sizes: [{ size: 39, stock: 20 }, { size: 40, stock: 25 }, { size: 41, stock: 30 }],
    isFeatured: true,
    rating: 4.4, numReviews: 19,
    color: 'White/Black', colorHex: '#ffffff',
    tags: [],
  },
  {
    name: 'Nike Phantom 6 Pro Low Cut TF Attack',
    price: 2890000,
    originalPrice: 4439000,
    description: 'Sút xoáy đỉnh cao với Phantom 6 Pro. Lớp vân Gripknit trên bề mặt giúp tăng độ ma sát với bóng.',
    images: ['https://cdn.hstatic.net/products/1000061481/a-098883-12-2_9de2a7bf18a94a4baeac97e0e345ba4a.jpg'],
    tier: 'Pro',
    surfaceType: 'TF',
    category: 'Phantom',
    sizes: [{ size: 39, stock: 10 }, { size: 40, stock: 15 }, { size: 41, stock: 20 }, { size: 42, stock: 18 }],
    isFeatured: true,
    rating: 4.8, numReviews: 31,
    color: 'Racer Blue', colorHex: '#0000ff',
    tags: ['bestseller', 'new'],
  },
  {
    name: 'Nike Air Zoom Mercurial Superfly 10 Academy TF Attack',
    price: 2250000,
    originalPrice: 2999000,
    description: 'Cổ thun cao Superfly ôm trọn cổ chân, giảm thiểu chấn thương lật sơ mi. Đệm Air Zoom êm ái.',
    images: ['https://cdn.hstatic.net/products/1000061481/a-098883-2-2_dd287cef3c8c410ca082d1f9ac6f1494.jpg'],
    tier: 'Academy',
    surfaceType: 'TF',
    category: 'Mercurial',
    sizes: [{ size: 39, stock: 8 }, { size: 40, stock: 12 }, { size: 41, stock: 16 }, { size: 42, stock: 14 }],
    isFeatured: true,
    rating: 4.5, numReviews: 53,
    color: 'Racer Blue', colorHex: '#0000ff',
    tags: [],
  },
  {
    name: 'Nike Air Zoom Mercurial Vapor 16 Academy TF Attack',
    price: 2050000,
    originalPrice: 2669000,
    description: 'Bản Low-cut truyền thống dễ xỏ, rất phù hợp cho dân đá phủi cường độ cao.',
    images: ['https://cdn.hstatic.net/products/1000061481/a-098883-222-2_8f76293129b3447eaa96d726cb19eb3b.jpg'],
    tier: 'Academy',
    surfaceType: 'TF',
    category: 'Vapor',
    sizes: [{ size: 40, stock: 14 }, { size: 41, stock: 18 }, { size: 42, stock: 16 }, { size: 43, stock: 10 }],
    isFeatured: false,
    rating: 4.4, numReviews: 19,
    color: 'Racer Blue', colorHex: '#0000ff',
    tags: [],
  },
  {
    name: 'Nike Air Zoom Mercurial Vapor 16 Pro TF Attack',
    price: 2800000,
    originalPrice: 3799000,
    description: 'Phân khúc Pro của dòng Vapor mang lại cảm giác chạm bóng tốt hơn hẳn nhờ lớp upper cao cấp.',
    images: ['https://cdn.hstatic.net/products/1000061481/anh_sp_add-01-01-01-04-07173-w3_cd8f9394bd294b8c9b86077b604d6009.jpg'],
    tier: 'Pro',
    surfaceType: 'TF',
    category: 'Vapor',
    sizes: [{ size: 39, stock: 5 }, { size: 40, stock: 8 }, { size: 41, stock: 10 }],
    isFeatured: true,
    rating: 4.7, numReviews: 42,
    color: 'Racer Blue', colorHex: '#0000ff',
    tags: ['bestseller'],
  },
  {
    name: 'Nike Phantom 6 Academy Low Cut TF Max Voltage',
    price: 2250000,
    originalPrice: 2949000,
    description: 'Phối màu Max Voltage xanh chuối cực cháy. Nổi bật trên mọi mặt sân.',
    images: ['https://cdn.hstatic.net/products/1000061481/56756-2_f081193c1993405e82756173126d8e6f.jpg'],
    tier: 'Academy',
    surfaceType: 'TF',
    category: 'Phantom',
    sizes: [{ size: 38, stock: 6 }, { size: 39, stock: 10 }, { size: 40, stock: 14 }],
    isFeatured: false,
    rating: 4.5, numReviews: 28,
    color: 'Limelight Volt', colorHex: '#ccff00',
    tags: [],
  },
  {
    name: 'Nike Air Zoom Mercurial Superfly 10 Academy TF Max Voltage',
    price: 2250000,
    originalPrice: 2999000,
    description: 'Superfly 10 màu Volt dạ quang. Ai cũng sẽ phải chú ý đến những bước chạy của bạn.',
    images: ['https://cdn.hstatic.net/products/1000061481/gy889089-2_2323b0bdcd7a4204a270639ca57d6704.jpg'],
    tier: 'Academy',
    surfaceType: 'TF',
    category: 'Mercurial',
    sizes: [{ size: 40, stock: 22 }, { size: 41, stock: 18 }, { size: 42, stock: 12 }],
    isFeatured: true,
    rating: 4.6, numReviews: 67,
    color: 'Limelight Volt', colorHex: '#ccff00',
    tags: ['new'],
  },
  {
    name: 'Nike Air Zoom Mercurial Vapor 16 Academy TF Max Voltage',
    price: 2050000,
    originalPrice: 2669000,
    description: 'Tốc độ xé gió cùng màu sắc rực rỡ, trang bị công nghệ đệm Air Zoom cao cấp.',
    images: ['https://cdn.hstatic.net/products/1000061481/gy89-2_2f6d4f8d8942489b926903709880c511.jpg'],
    tier: 'Academy',
    surfaceType: 'TF',
    category: 'Vapor',
    sizes: [{ size: 39, stock: 20 }, { size: 40, stock: 25 }, { size: 41, stock: 30 }],
    isFeatured: false,
    rating: 4.1, numReviews: 89,
    color: 'Limelight Volt', colorHex: '#ccff00',
    tags: [],
  },
  {
    name: 'Nike Tiempo Legend 10 Academy TF Max Voltage',
    price: 2050000,
    originalPrice: 2529000,
    description: 'Dòng Tiempo Huyền thoại chuyển mình sang thiết kế hiện đại hơn nhưng vẫn giữ được độ êm đặc trưng.',
    images: ['https://cdn.hstatic.net/products/1000061481/anh_sp_add-01-01-01-04-0373-3-2_716a4c56ffe04c50bd923a0265c3abb5.jpg'],
    tier: 'Academy',
    surfaceType: 'TF',
    category: 'Tiempo',
    sizes: [{ size: 39, stock: 8 }, { size: 40, stock: 12 }, { size: 41, stock: 16 }, { size: 42, stock: 14 }],
    isFeatured: true,
    rating: 4.5, numReviews: 53,
    color: 'Limelight Volt', colorHex: '#ccff00',
    tags: ['bestseller'],
  },
  {
    name: 'Nike Tiempo Legend 10 Pro FG Max Voltage',
    price: 3690000,
    originalPrice: 4439000,
    description: 'Mẫu giày hoàn hảo cho các tiền vệ trung tâm điều phối bóng trên mặt sân cỏ tự nhiên 11 người.',
    images: ['https://cdn.hstatic.net/products/1000061481/222124j1256875856-2-2_7a093a17288247648cdd3a3e5f8171dc.jpg'],
    tier: 'Pro',
    surfaceType: 'FG',
    category: 'Tiempo',
    sizes: [{ size: 40, stock: 14 }, { size: 41, stock: 18 }, { size: 42, stock: 16 }, { size: 43, stock: 10 }],
    isFeatured: false,
    rating: 4.4, numReviews: 19,
    color: 'Limelight Volt', colorHex: '#ccff00',
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
