import React from 'react';
import { Star } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const TestimonialCard = ({ testimonial }) => {
  const photoUrl = testimonial.photo
    ? pb.files.getURL(testimonial, testimonial.photo)
    : null;

  return (
    <div className="bg-muted rounded-xl p-6">
      <div className="flex items-center gap-4 mb-4">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={testimonial.name}
            className="w-12 h-12 rounded-xl object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold text-lg">
              {testimonial.name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <p className="font-semibold">{testimonial.name}</p>
          {testimonial.city && (
            <p className="text-sm text-muted-foreground">{testimonial.city}</p>
          )}
        </div>
      </div>

      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating
                ? 'fill-accent text-accent'
                : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>

      <p className="text-sm leading-relaxed">{testimonial.comment}</p>

      {testimonial.expand?.product && (
        <p className="text-xs text-muted-foreground mt-3">
          Producto: {testimonial.expand.product.name}
        </p>
      )}
    </div>
  );
};

export default TestimonialCard;
