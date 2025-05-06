import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { GoStar } from "react-icons/go";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Heart from "../assets/heart.png"

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [sizesArray, setSizesArray] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [reviewData, setReviewData] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewImage, setReviewImage] = useState(null);
  const [reviewImagePreview, setReviewImagePreview] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editedRating, setEditedRating] = useState(0);
  const [editedComment, setEditedComment] = useState("");
  const [editedImage, setEditedImage] = useState(null);
  const [editedImagePreview, setEditedImagePreview] = useState("");
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const fetchProductData = async () => {
    axios
      .get(`http://localhost:5000/api/product/${productId}`)
      .then((res) => {
        console.log("res.data is =====> ", res.data);
        setProductData(res.data);
        setImage(res.data.variants[0].imageUrl);
        setSizesArray(res.data.variants[0].sizes);
        setSelectedVariantId(res.data.variants[0]._id);
        setSelectedColor(res.data.variants[0].color);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  const onClickImage = (index) => {
    setImage(productData.variants[index].imageUrl);
    setSizesArray(productData.variants[index].sizes);
    setSelectedVariantId(productData.variants[index]._id);
    setSelectedColor(productData.variants[index].color);
  };

  const onClickSize = (item) => {
    setSelectedSize(item.size);
    setSelectedSizeId(item._id);
  };

  const handleAddToCart = () => {
    if (!selectedSizeId) {
      toast.error("Please select a size", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!isAuthenticated || !user) {
      toast.error("Please log in to the system", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/customerlogin");
      return;
    }

    const cartItem = {
      userId: user._id,
      items: [
        {
          brand: {
            brandId: productId,
            brandName: productData.brand,
            modelName: productData.model,
          },
          color: {
            colorId: selectedVariantId,
            colorName: selectedColor,
          },
          size: {
            sizeId: selectedSizeId,
            size: selectedSize,
          },
          quantity: 1,
          imageUrl: image,
          price: productData.price,
        },
      ],
    };

    axios
      .post(`http://localhost:5000/api/cart`, cartItem)
      .then((res) => {
        console.log(res.data);

        if (res.status >= 200 && res.status < 300) {
          toast.success(res.data.message, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        const errorMessage =
          err.response?.data?.message || "Failed to add product to cart";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  const fetchReviewData = async () => {
    axios
      .get(`http://localhost:5000/api/review`)
      .then((res) => {
        const filteredReviews = res.data.filter(
          (review) => review.brandId === productId
        );
        setReviewData(filteredReviews);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  console.log(reviewData);
  useEffect(() => {
    fetchReviewData();
  }, []);

  // Handle image upload for review
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReviewImage(file);
      setReviewImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle image upload for editing review
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedImage(file);
      setEditedImagePreview(URL.createObjectURL(file));
    }
  };

  const handleReviewSubmit = () => {
    if (!isAuthenticated || !user) {
      toast.error("Please log in to the system", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/customerlogin");
      return;
    }
    if (rating === 0 || comment.trim() === "") {
      toast.error("Please provide both a rating and a comment", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Create form data for multipart/form-data submission
    const formData = new FormData();
    formData.append("brandId", productId);
    formData.append("userId", user._id);
    formData.append("userFullName", user.name);
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("profilepicture", user.profilePicture);

    // Append image if exists
    if (reviewImage) {
      formData.append("reviewImage", reviewImage);
    }

    axios
      .post("http://localhost:5000/api/review", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        toast.success("Review submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        // Reset form
        setRating(0);
        setComment("");
        setReviewImage(null);
        setReviewImagePreview("");
        fetchReviewData(); // Re-fetch reviews after submission
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.error || "Failed to submit review";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setEditedRating(review.rating);
    setEditedComment(review.comment);
    setEditedImagePreview(review.imageUrl || "");
    setIsModalOpen(true);
  };

  const handleUpdateReview = () => {
    if (!editingReview || !user) {
      toast.error("You must be logged in to update a review", {
        autoClose: 3000,
      });
      return;
    }
    // Create form data for multipart/form-data submission
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("rating", editedRating);
    formData.append("comment", editedComment);

    // Append image if a new one was selected
    if (editedImage) {
      formData.append("reviewImage", editedImage);
    }
    console.log("Sending FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    axios
      .put(
        `http://localhost:5000/api/review/${editingReview._id}`,
        formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        toast.success("Review updated successfully!", { autoClose: 3000 });
        setIsModalOpen(false);
        // Reset edit form
        setEditingReview(null);
        setEditedRating(0);
        setEditedComment("");
        setEditedImage(null);
        setEditedImagePreview("");
        fetchReviewData(); // Refresh reviews
      })
      .catch((err) => {
        toast.error("Failed to update review", { autoClose: 3000 });
      });
  };

  const handleDeleteClick = (reviewId) => {
    axios
      .delete(`http://localhost:5000/api/review/${reviewId}`)
      .then((res) => {
        toast.success("Review deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        fetchReviewData(); // Re-fetch the reviews after deletion
      })
      .catch((err) => {
        toast.error("Failed to delete review", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  const handleAddToWishlists = () => {
    if (!isAuthenticated || !user) {
      toast.error("Please log in to the system", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/customerlogin");
      return;
    }

    const WishlistItem = {
      userId: user._id,
      items: [
        {
          shoeId: productId,
          brand: productData.brand,
          model: productData.model,
          price: productData.price,
          imageUrl: image,
        },
      ],
    };
    console.log("-------------------------------->", WishlistItem);

    axios
      .post(`http://localhost:5000/api/wishlist`, WishlistItem)
      .then((res) => {
        console.log(res.data);

        if (res.status >= 200 && res.status < 300) {
          toast.success(res.data.message, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        const errorMessage =
          err.response?.data?.message || "Failed to add product to wishlist";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      });
    // console.log(WishlistItem);
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 m-8 font-display">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18.7%] w-full gap-2">
            {productData.variants.map((item, index) => (
              <img
                onClick={() => onClickImage(index)}
                src={item.imageUrl}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>
        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.brand}</h1>
          <p className="mt-5 text-3xl font-medium">{productData.model}</p>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {sizesArray?.map((item, index) => (
                <button
                  onClick={() => onClickSize(item)}
                  className={`py-2 px-4 bg-gray-100 border ${
                    item._id === selectedSizeId
                      ? "border-orange-500"
                      : "border-gray-300"
                  } cursor-pointer`}
                  key={item._id}
                >
                  {item.size}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 cursor-pointer"
          >
            ADD TO CART
          </button>
          <button className="" onClick={handleAddToWishlists}>
          <div className="bg-amber-400 w-10 h-10 ml-16 relative top-2 flex items-center justify-center rounded-full">
              <img src={Heart} alt="Add to Wishlist" className="w-8 h-8" />
          </div>
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product</p>
            <p>Cash on delivery is available on this product</p>
            <p>Easy return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>
      {/* Reviews */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Reviews</b>
          <p className="px-5 py-3 text-sm"></p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          {/*Show reviews in this section*/}
          {reviewData && reviewData.length > 0 ? (
            reviewData.map((review) => {
              const localDate = new Date(review.date).toLocaleDateString(
                "en-GB"
              );

              return (
                <div key={review._id} className="border-b pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.profilepicture}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-bold">{review.userFullName}</p>
                      <p>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`text-sm ${
                                star <= review.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </p>
                      <p className="text-xs text-gray-400">{localDate}</p>
                    </div>
                  </div>

                  <p className="mt-2">{review.comment}</p>

                  {/* Display review image if available */}
                  {review.shoePicture && (
                    <div className="mt-3">
                      <img
                        src={review.shoePicture}
                        alt="Review"
                        className="w-24 h-auto rounded-lg shadow"
                      />
                    </div>
                  )}

                  {/* Show Edit Button Only for Review Author */}
                  {isAuthenticated && user && review.userId === user._id && (
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                        onClick={() => handleEditClick(review)}
                      >
                        Edit
                      </button>

                      <button
                        className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
                        onClick={() => handleDeleteClick(review._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
        <div className="mt-10">
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500 rounded-lg shadow-md">
            <h3 className="text-xl font-medium">Write a Review</h3>
            <div>
              <label className="block mb-2 font-medium">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`cursor-pointer text-2xl ${
                      star <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>
            {/* New Image Upload Field */}
            <div>
              <label className="block mb-2 font-medium">
                Upload Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {reviewImagePreview && (
                <div className="mt-2">
                  <img
                    src={reviewImagePreview}
                    alt="Preview"
                    className="max-w-xs h-32 object-contain rounded"
                  />
                  <button
                    onClick={() => {
                      setReviewImage(null);
                      setReviewImagePreview("");
                    }}
                    className="mt-1 text-red-500 text-xs"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
              onClick={handleReviewSubmit}
            >
              Submit Review
            </button>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full mx-4">
                <h2 className="text-xl font-semibold mb-4">Edit Review</h2>

                {/* Rating Input */}
                <label className="block mb-2 font-medium">Rating (1-5)</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer text-2xl ${
                        star <= editedRating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                      onClick={() => setEditedRating(star)}
                    />
                  ))}
                </div>

                {/* Comment Input */}
                <label className="block mt-4 mb-2 font-medium">Comment</label>
                <textarea
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />

                {/* Edit Image Upload Field */}
                <div className="mt-4">
                  <label className="block mb-2 font-medium">
                    Change Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {(editedImagePreview || editingReview?.imageUrl) && (
                    <div className="mt-2">
                      <img
                        src={editedImagePreview || editingReview?.imageUrl}
                        alt="Preview"
                        className="max-w-xs h-32 object-contain rounded"
                      />
                      {editedImagePreview && (
                        <button
                          onClick={() => {
                            setEditedImage(null);
                            setEditedImagePreview(
                              editingReview?.imageUrl || ""
                            );
                          }}
                          className="mt-1 text-red-500 text-xs"
                        >
                          Reset Image
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleUpdateReview}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
