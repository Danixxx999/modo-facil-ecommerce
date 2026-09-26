import { calculateTieredPrice } from "@/hooks/useProductPricing.js";
const money = (value) => Number(value || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const phone = (settings) => String(settings?.whatsApp || settings?.whatsapp || settings?.phone || "").replace(/[^0-9]/g, "");
const url = (settings, message) => {
  const number = phone(settings);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
export const generateProductInquiry = (product, settings) => url(settings, `Hola, me interesa ${product?.name || "este producto"} por ${money(product?.price)}.`);
export const generateCheckoutMessage = (order, items, settings) => {
  const lines = items.map((item) => `• ${item.name} x${item.quantity || 1} — ${money((item.type === "combo" ? item.finalPrice || item.price : calculateTieredPrice(item, item.quantity || 1)) * (item.quantity || 1))}`);
  return url(settings, [`Pedido ${order?.orderNumber || ""}`, ...lines, "Envío: GRATIS", `Total: ${money(order?.total)}`].join("\n"));
};
export const generateOrderConfirmation = (order, settings) => url(settings, `Quiero consultar el pedido ${order?.orderNumber || ""}.`);
export const generateSimpleSupportMessage = (settings) => url(settings, "Hola, necesito ayuda con un producto de Modo Fácil.");
