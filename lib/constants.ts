export const SITE_NAME = 'PalmGrass Pro';
export const SITE_TAGLINE = 'Synthetic Thatch Roofing B2B Manufacturer';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8617843803954';
export const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'sales@palmgrasspro.com';
export const CONTACT_PHONE = '+86 178 4380 3954';
export const CONTACT_ADDRESS = 'No. 88 Industrial Park Road, Guangzhou, Guangdong, China';
export const PRODUCTS_PER_PAGE = 12;

export function getWhatsAppUrl(message?: string) {
  const text = message ?? 'Hello, I would like to inquire about synthetic thatch products.';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
