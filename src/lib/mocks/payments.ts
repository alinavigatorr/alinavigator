import { PaymentMethod, BillingAddress } from '../../types/payment';

export const mockPaymentMethods: PaymentMethod[] = [
  { id: 'pm_1', name: 'کارت اعتباری / نقدی', type: 'CREDIT_CARD', icon: 'CreditCard', isAvailable: true, description: 'پرداخت امن از طریق درگاه بانکی' },
  { id: 'pm_2', name: 'Apple Pay', type: 'WALLET', icon: 'Apple', isAvailable: true, description: 'پرداخت سریع با دستگاه اپل' },
  { id: 'pm_3', name: 'Google Pay', type: 'WALLET', icon: 'Smartphone', isAvailable: true, description: 'پرداخت سریع با حساب گوگل' },
  { id: 'pm_4', name: 'کیف پول حساب', type: 'WALLET', icon: 'Wallet', isAvailable: true, description: 'موجودی: ۲,۵۰۰,۰۰۰ تومان' },
  { id: 'pm_5', name: 'پرداخت در محل', type: 'COD', icon: 'Truck', isAvailable: true, description: 'پرداخت هنگام تحویل کالا' },
  { id: 'pm_6', name: 'حواله بانکی', type: 'BANK_TRANSFER', icon: 'Landmark', isAvailable: false, description: 'در حال بروزرسانی سیستم بانکی' },
];

export const mockBillingAddress: BillingAddress = {
  id: 'addr_1',
  fullName: 'علی شمس',
  nationalId: '0012345678',
  fullAddress: 'تهران، خیابان ولیعصر، کوچه نمونه، پلاک ۱۲، واحد ۴',
  postalCode: '1234567890',
  phone: '09123456789'
};