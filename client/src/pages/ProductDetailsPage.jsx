import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useProducts } from '../hooks/useProducts';
import { ImageGallery } from '../components/product/ImageGallery';
import { RentalCalculator } from '../components/product/RentalCalculator';
import { VendorProfileCard } from '../components/product/VendorProfileCard';
import { Specifications } from '../components/product/Specifications';
import { ProductCard } from '../components/marketplace/ProductCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { ArrowLeft, Star, MapPin, Share2, ShieldAlert } from 'lucide-react';
import { useToast } from '../hooks/useToast';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { products } = useProducts();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getById(id);
        if (isMounted) setProduct(data);
      } catch (err) {
        if (isMounted) setError(err.message || 'Product not found');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex items-center justify-center">
        <LoadingSpinner label="Loading equipment details..." size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Equipment Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The requested rental item could not be retrieved or has been removed by the owner.
        </p>
        <Button variant="primary" onClick={() => navigate('/marketplace')} icon={ArrowLeft}>
          Back to Marketplace
        </Button>
      </div>
    );
  }

  // Similar products from same category
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery & Details on Left, Booking Calculator on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column (Images, Info, Specs, Vendor) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Image Gallery */}
          <ImageGallery
            images={product.images}
            name={product.name}
            availability={product.availability}
            condition={product.condition}
          />

          {/* Title & Metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 font-bold uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{product.rating || '4.95'}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount || 24} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{product.location}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-950 tracking-tight leading-tight">
              {product.name}
            </h1>

            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications & Features */}
          <div className="pt-8 border-t border-slate-200">
            <Specifications
              specs={product.specs}
              features={product.features}
              inclusions={product.inclusions}
            />
          </div>

          {/* Vendor Profile Card */}
          <div className="pt-8 border-t border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              About the Equipment Owner
            </h3>
            <VendorProfileCard vendorId={product.vendorId} />
          </div>
        </div>

        {/* Right Column: Sticky Rental Date Selection & Price Calculator */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-28">
          <RentalCalculator product={product} />
        </div>
      </div>

      {/* Similar Equipment Carousel / Grid */}
      {similarProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
                More in {product.category}
              </span>
              <h2 className="text-2xl font-extrabold text-navy-950">
                Similar Rental Equipment
              </h2>
            </div>
            <Link
              to={`/marketplace?category=${product.category}`}
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProducts.map((simProduct) => (
              <ProductCard key={simProduct.id} product={simProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
