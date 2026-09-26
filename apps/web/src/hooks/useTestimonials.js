import { useEffect, useState } from "react";
import pb from "@/lib/pocketbaseClient.js";
export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let active = true;
    pb.collection("testimonials").getFullList({ filter: "visible = true", sort: "-created", $autoCancel: false })
      .then((records) => active && setTestimonials(records))
      .catch((err) => active && setError(err?.message || "No fue posible cargar los testimonios"))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);
  return { testimonials, loading, error };
};
