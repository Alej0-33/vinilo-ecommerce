import React, { useState, useEffect } from 'react';
import { Star, User, CheckCircle, Loader2, Lock } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';

const ReviewForm = ({ productId }) => {
  const { user, isAuthenticated } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', comment: '', rating: 0 });
  const [hoverRating, setHoverRating] = useState(0); 
  const [isFormOpen, setIsFormOpen] = useState(false);

  // --- LÓGICA DE NOMBRE COMPLETO ---
  useEffect(() => {
    if (isAuthenticated && user) {
        const firstName = user.first_name || '';
        const lastName = user.last_name || '';
        let fullName = `${firstName} ${lastName}`.trim();

        if (!fullName) {
            fullName = user.email ? user.email.split('@')[0] : 'Usuario';
        }

        setFormData(prev => ({ ...prev, name: fullName }));
    } else {
        setFormData(prev => ({ ...prev, name: '' }));
    }
  }, [isAuthenticated, user]);

  // --- CARGAR RESEÑAS EXISTENTES ---
  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/store/reviews/?product=${productId}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            }
        } catch (error) {
            console.error("Error cargando reseñas:", error);
        } finally {
            setLoadingReviews(false);
        }
    };

    fetchReviews();
  }, [productId]);

  // --- ENVIAR RESEÑA ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
        alert("Por favor selecciona una calificación de estrellas.");
        return;
    }

    setIsSubmitting(true);

    try {
        const payload = {
            product: productId,
            author_name: formData.name, 
            rating: formData.rating,
            comment: formData.comment
        };

        const response = await fetch('http://127.0.0.1:8000/api/store/reviews/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const newReview = await response.json();
            setReviews([newReview, ...reviews]);
            setFormData(prev => ({ 
                name: isAuthenticated ? prev.name : '', 
                comment: '', 
                rating: 0 
            })); 
            setIsFormOpen(false); 
        } else {
            const errorData = await response.json();
            console.log("Error Backend:", errorData);
            alert(`Error: ${JSON.stringify(errorData)}`); 
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión con el servidor.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 animate-fade-in">
      
      {/* Header Sección */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-100 pb-6 mb-8 gap-4">
        <div>
            <h3 className="font-serif text-2xl text-vinilo-black italic">Reseñas de Clientes</h3>
            <div className="flex items-center gap-2 mt-2">
                <div className="flex text-vinilo-red">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" />)}
                </div>
                <span className="text-xs font-sans text-gray-500 font-bold uppercase tracking-widest">
                    ({reviews.length} Opiniones)
                </span>
            </div>
        </div>
        
        <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="text-xs font-bold uppercase tracking-widest text-vinilo-black border-b border-vinilo-black pb-1 hover:text-vinilo-red hover:border-vinilo-red transition-colors"
        >
            {isFormOpen ? 'Cancelar Reseña' : 'Escribir una Reseña'}
        </button>
      </div>

      {/* Formulario */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-sm mb-10 border border-gray-100 animate-fade-in-down">
            <h4 className="font-sans text-sm font-bold uppercase tracking-widest mb-4 text-gray-700 flex items-center gap-2">
                Comparte tu experiencia 
                {isAuthenticated && user && (
                    <span className="text-vinilo-red normal-case font-normal border-l border-gray-300 pl-2">
                        como {user.first_name} {user.last_name}
                    </span>
                )}
            </h4>
            
            {/* Estrellas */}
            <div className="mb-4">
                <span className="block text-[10px] uppercase font-bold text-gray-400 mb-2">
                    Calificación
                </span>
                <div className="flex gap-1" role="group" aria-label="Calificación en estrellas">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            aria-label={`Calificar con ${star} estrellas`} 
                            onClick={() => setFormData({...formData, rating: star})}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                        >
                            <Star 
                                size={24} 
                                className={star <= (hoverRating || formData.rating) ? "text-vinilo-red fill-current" : "text-gray-300"} 
                                strokeWidth={1.5}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    {/* INPUT NOMBRE CORRECTAMENTE ETIQUETADO */}
                    <label htmlFor="review_author" className="block text-[10px] uppercase font-bold text-gray-400 mb-2">
                        Tu Nombre
                    </label>
                    <div className="relative group">
                        <input 
                            id="review_author"    
                            name="author_name"    
                            autoComplete="name"   
                            required
                            type="text" 
                            placeholder="Tu Nombre Completo" 
                            value={formData.name} 
                            readOnly={isAuthenticated} 
                            onChange={(e) => !isAuthenticated && setFormData({...formData, name: e.target.value})}
                            className={`
                                w-full border p-3 text-sm focus:outline-none transition-colors
                                ${isAuthenticated 
                                    ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed pl-9 font-bold' 
                                    : 'bg-white border-gray-200 focus:border-vinilo-black'
                                }
                            `}
                        />
                        {isAuthenticated && (
                            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        )}
                    </div>
                </div>
                <div>
                    {/* TEXTAREA CORRECTAMENTE ETIQUETADO */}
                    <label htmlFor="review_comment" className="block text-[10px] uppercase font-bold text-gray-400 mb-2">
                        Tu Opinión
                    </label>
                    <textarea 
                        id="review_comment"    
                        name="comment"         
                        required
                        rows="3"
                        placeholder="Cuéntanos qué te pareció el producto..." 
                        value={formData.comment}
                        onChange={(e) => setFormData({...formData, comment: e.target.value})}
                        className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors resize-none"
                    />
                </div>
                <Button variant="primary" size="full" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Publicando...' : 'Publicar Opinión'}
                </Button>
            </div>
        </form>
      )}

      {/* Lista de Reseñas */}
      {loadingReviews ? (
          <div className="flex justify-center py-8 text-gray-400">
              <Loader2 className="animate-spin" />
          </div>
      ) : reviews.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-8">
              Aún no hay reseñas. ¡Sé el primero en opinar sobre este producto!
          </p>
      ) : (
        <div className="space-y-8">
            {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-50 pb-8 last:border-0 animate-fade-in">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                <User size={16} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-vinilo-black uppercase tracking-wider flex items-center gap-1">
                                    {review.author_name} 
                                    <CheckCircle size={10} className="text-vinilo-black" />
                                </p>
                                <span className="text-[10px] text-gray-400">{review.date_formatted}</span>
                            </div>
                        </div>
                        <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    size={12} 
                                    fill={i < review.rating ? "currentColor" : "none"} 
                                    className={i < review.rating ? "" : "text-gray-200"} 
                                />
                            ))}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 font-sans leading-relaxed pl-10">
                        "{review.comment}"
                    </p>
                </div>
            ))}
        </div>
      )}

    </div>
  );
};

export default ReviewForm;