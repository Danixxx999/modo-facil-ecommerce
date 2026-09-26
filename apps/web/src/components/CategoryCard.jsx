import { Link } from "react-router-dom";
export default function CategoryCard({ category }) {
  return <Link to={`/category/${category?.slug || category?.id || ""}`} className="mf-card block p-5 transition hover:-translate-y-1"><h3 className="font-display text-xl font-black">{category?.name || "Categoría"}</h3><p className="mt-2 text-sm text-muted-foreground">{category?.description || "Explora productos seleccionados."}</p></Link>;
}
