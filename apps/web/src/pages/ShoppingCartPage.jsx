import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext.jsx";
import { Button } from "@/components/ui/button.jsx";

export default function ShoppingCartPage() {
  const cart = useCart();
  const items = cart?.cartItems || [];
  return <><Header/><main className="mf-page"><div className="mf-container py-12"><h1 className="font-display text-4xl font-black">Tu carrito</h1>{items.length === 0 ? <div className="mt-8"><p className="text-muted-foreground">Tu carrito está vacío.</p><Button asChild className="mt-4"><Link to="/store">Explorar tienda</Link></Button></div> : <div className="mt-8 space-y-4">{items.map((item) => <div key={item.id} className="mf-card flex justify-between p-4"><span>{item.name}</span><span>x{item.quantity || 1}</span></div>)}<p className="font-bold">Envío gratis</p><Button asChild><Link to="/checkout">Continuar al checkout</Link></Button></div>}</div></main><Footer/></>;
}
