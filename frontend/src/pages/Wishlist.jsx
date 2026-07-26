import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";
import { addToCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";
import { formatPrice } from "../utils/formatPrice";

export default function Wishlist() {
  const dispatch = useDispatch();

  const { items, isLoading } = useSelector(
    (state) => state.wishlist
  );

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id))
      .unwrap()
      .then(() => toast.success("Removed from wishlist"))
      .catch(() => toast.error("Failed to remove"));
  };

  const handleMoveToCart = (item) => {
    dispatch(
      addToCart({
        productId: item.product.id,
        quantity: 1,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(removeFromWishlist(item.id));
        toast.success("Moved to cart");
      })
      .catch(() => toast.error("Failed to move to cart"));
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-10 text-center">
        Loading wishlist...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">
        My Wishlist ❤️
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-6">
            Your wishlist is empty.
          </p>

          <Link
            to="/products"
            className="btn-primary"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-full h-64 object-cover"
              />

              <div className="p-4">
                <h2 className="font-semibold text-lg">
                  {item.product.name}
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  {item.product.description}
                </p>

                <p className="text-hotpink-500 font-bold text-xl mt-3">
                  {formatPrice(item.product.price)}
                </p>

                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="btn-primary flex-1"
                  >
                    Move to Cart
                  </button>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="px-4 py-2 rounded-lg border border-red-300 text-red-500 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}