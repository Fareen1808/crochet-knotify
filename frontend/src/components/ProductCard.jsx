import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiHeart,
} from "react-icons/hi";
import { formatPrice } from "../utils/formatPrice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";
import { addToCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";

const FALLBACK_IMAGE =
  "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/accessories-bag.jpg";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.wishlist);

  const wishlistItem = items.find(
    (item) => item.product.id === product.id
  );

  const isWishlisted = !!wishlistItem;

  const categoryColors = {
    Amigurumi: "from-pink-200 to-hotpink-200",
    Bags: "from-lavender-200 to-lavender-300",
    Clothing: "from-rose-200 to-rose-300",
    "Home Decor": "from-sage-200 to-sage-300",
    Accessories: "from-cream-200 to-cream-300",
  };

  const bgGradient =
    categoryColors[product.category] ||
    "from-hotpink-100 to-pink-200";

  const isOutOfStock =
    product.stock !== undefined && product.stock <= 0;

  const isLowStock =
    product.stock > 0 && product.stock <= 5;

  const handleWishlist = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlist(wishlistItem.id));
      toast.success("Removed from wishlist ❤️");
    } else {
      dispatch(addToWishlist(product.id));
      toast.success("Added to wishlist ❤️");
    }
  };
  const handleAddToCart = (e) => {
  e.preventDefault();

  if (!user) {
    toast.error("Please login first");
    return;
  }

  dispatch(
    addToCart({
      productId: product.id,
      quantity: 1,
    })
  );

  toast.success("Added to cart 🛍️");
};

  return (
    <Link
      to={`/products/${product.id}`}
      className="group"
    >
      <div className="card card-hover overflow-hidden p-0 border-2 border-pink-100 hover:border-hotpink-300">

        {/* Image */}
        <div
          className={`relative h-56 bg-gradient-to-br ${bgGradient} flex items-center justify-center overflow-hidden`}
        >
          <img
            src={product.imageUrl || FALLBACK_IMAGE}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = FALLBACK_IMAGE;
            }}
          />

          {/* Category */}
          <span className="absolute top-3 left-3 badge bg-white/90 text-hotpink-600 font-bold shadow-md">
            {product.category}
          </span>

          {/* Stock */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full text-sm">
                Out of Stock
              </span>
            </div>
          )}

          {isLowStock && !isOutOfStock && (
            <span className="absolute top-3 right-14 badge bg-red-100 text-red-600 font-bold shadow-md text-xs">
              Only {product.stock} left!
            </span>
          )}

          {/* Wishlist */}
          {!isOutOfStock && (
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-hotpink-100 shadow-md"
            >
              {isWishlisted ? (
                <HiHeart className="w-5 h-5 text-red-500" />
              ) : (
                <HiOutlineHeart className="w-5 h-5 text-hotpink-500" />
              )}
            </button>
          )}

          {/* Quick Add */}
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-hotpink-500 hover:text-white"
            >
              <HiOutlineShoppingBag className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 group-hover:text-hotpink-500 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-3">
            <span className="font-serif text-xl font-bold text-hotpink-500">
              {formatPrice(product.price)}
            </span>

            <span className="text-xs text-hotpink-400 font-medium bg-hotpink-50 px-2 py-1 rounded-full">
              Handmade
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}