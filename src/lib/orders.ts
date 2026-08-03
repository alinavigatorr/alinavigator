import { Order } from '../../types/order';

const defaultAddress = {
  id: 'addr-1',
  fullName: 'علی شمس',
  fullAddress: 'خیابان ولیعصر، کوچه نمونه، پلاک ۱۲، واحد ۴',
  city: 'تهران',
  state: 'تهران',
  postalCode: '1234567890',
  phone: '09123456789',
};

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-99382',
    status: 'PROCESSING',
    date: '1403/05/12',
    items: [
      { id: 'i1', productId: 'p1', name: 'لپ‌تاپ پرو ۱۳ اینچ', price: 45000000, quantity: 1, imageUrl: '/images/laptop.jpg' },
    ],
    shippingAddress: defaultAddress,
    priceSummary: { subtotal: 45000000, shipping: 50000, discount: 0, tax: 4050000, total: 49100000 },
    trackingTimeline: [
      { id: 't1', status: 'PENDING', timestamp: '1403/05/12 - 10:30', description: 'سفارش ثبت شد.' },
      { id: 't2', status: 'CONFIRMED', timestamp: '1403/05/12 - 11:00', description: 'تایید پرداخت و ارجاع به انبار.' },
      { id: 't3', status: 'PROCESSING', timestamp: '1403/05/12 - 14:15', description: 'در حال پردازش و بسته‌بندی.' }
    ]
  },
  {
    id: '2',
    orderNumber: 'ORD-88211',
    status: 'DELIVERED',
    date: '1403/04/28',
    items: [
      { id: 'i2', productId: 'p2', name: 'کیبورد مکانیکی', price: 3200000, quantity: 1, imageUrl: '/images/keyboard.jpg' },
      { id: 'i3', productId: 'p3', name: 'موس گیمینگ', price: 1800000, quantity: 1, imageUrl: '/images/mouse.jpg' },
    ],
    shippingAddress: defaultAddress,
    priceSummary: { subtotal: 5000000, shipping: 0, discount: 500000, tax: 450000, total: 4950000 },
    trackingTimeline: [
      { id: 't4', status: 'PENDING', timestamp: '1403/04/28 - 09:00', description: 'سفارش ثبت شد.' },
      { id: 't5', status: 'SHIPPED', timestamp: '1403/04/29 - 10:00', description: 'تحویل به پست.' },
      { id: 't6', status: 'DELIVERED', timestamp: '1403/04/30 - 18:30', description: 'به گیرنده تحویل داده شد.' }
    ]
  },
  {
    id: '3',
    orderNumber: 'ORD-77102',
    status: 'CANCELLED',
    date: '1403/03/15',
    items: [
      { id: 'i4', productId: 'p4', name: 'هدفون نویز کنسلینگ', price: 8500000, quantity: 1, imageUrl: '/images/headphone.jpg' }
    ],
    shippingAddress: defaultAddress,
    priceSummary: { subtotal: 8500000, shipping: 50000, discount: 0, tax: 765000, total: 9315000 },
    trackingTimeline: [
      { id: 't7', status: 'PENDING', timestamp: '1403/03/15 - 12:00', description: 'سفارش ثبت شد.' },
      { id: 't8', status: 'CANCELLED', timestamp: '1403/03/15 - 15:45', description: 'لغو توسط کاربر.' }
    ]
  },
  {
    id: '4',
    orderNumber: 'ORD-66004',
    status: 'SHIPPED',
    date: '1403/05/10',
    items: [
      { id: 'i5', productId: 'p5', name: 'مانیتور ۲۷ اینچ 4K', price: 18500000, quantity: 1, imageUrl: '/images/monitor.jpg' }
    ],
    shippingAddress: defaultAddress,
    priceSummary: { subtotal: 18500000, shipping: 120000, discount: 0, tax: 1665000, total: 20285000 },
    trackingTimeline: [
      { id: 't9', status: 'PENDING', timestamp: '1403/05/10 - 08:20', description: 'سفارش ثبت شد.' },
      { id: 't10', status: 'PROCESSING', timestamp: '1403/05/10 - 13:00', description: 'در حال بسته‌بندی.' },
      { id: 't11', status: 'SHIPPED', timestamp: '1403/05/11 - 09:30', description: 'تحویل به شرکت تیپاکس.' }
    ]
  },
  {
    id: '5',
    orderNumber: 'ORD-55005',
    status: 'PENDING',
    date: '1403/05/14',
    items: [
      { id: 'i6', productId: 'p6', name: 'هارد اکسترنال ۲ ترابایت', price: 3800000, quantity: 2, imageUrl: '/images/hdd.jpg' }
    ],
    shippingAddress: defaultAddress,
    priceSummary: { subtotal: 7600000, shipping: 50000, discount: 0, tax: 684000, total: 8334000 },
    trackingTimeline: [
      { id: 't12', status: 'PENDING', timestamp: '1403/05/14 - 23:15', description: 'سفارش ثبت شد. منتظر تایید پرداخت.' }
    ]
  }
];