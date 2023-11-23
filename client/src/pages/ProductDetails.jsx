import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Overlay from "../components/Overlay";
import { fetchProduct, addItemToCart, updateCartItem } from "../utils/http";
import { updateCart, updateQuantity } from "../store/cartSlice";
import CartAdd from "../assets/images/addcart.png";
import "boxicons";

import Breadcrumbs from "../components/Breadcrumbs";

export default function ProductDetails({ route }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { userToken, userId, cartId } = useSelector((state) => state.auth); // cart id not saved in state for some reason
  const { cartItems } = useSelector((state) => state.cart);
  // temporarily
  const cartTemp = localStorage.getItem("cartId");

  const [product, setProduct] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalShowing, setIsModalShowing] = useState(false);

  const currentPath = location.pathname;
  console.log(currentPath);
  const pathArray = currentPath.split("/");
  const idFromUrl = pathArray[pathArray.length - 2];
  console.log(idFromUrl);

  useEffect(() => {
    const handleOverlayStyle = () => {
      if (isModalShowing) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    // Call the function when the component mounts or when isOverlayActive changes
    handleOverlayStyle();

    // Cleanup function to remove the style when the component is unmounted
    return () => {
      document.body.style.overflow = ""; // Remove the style to enable scrolling
    };
  }, [isModalShowing]); // Run the effect when isOverlayActive changes

  const handleOverlay = () => {
    setIsModalShowing(!isModalShowing);
  };

  const addToCart = async (productId, quantity) => {
    if (!userToken) {
      console.log("user not logged in");
      handleOverlay();
    }

    const isExists = cartItems.find(
      (item) => item.attributes.product.data.id == idFromUrl
    );

    if (userToken && isExists != undefined) {
      const data1 = {
        data: {
          quantity: isExists.attributes.quantity + 1,
        },
      };
      try {
        const response = await updateCartItem(isExists.id, userToken, data1);
        dispatch(
          updateQuantity({
            cartItemId: isExists.id,
            quantity: isExists.attributes.quantity + 1,
          })
        );
        console.log(response);
      } catch (error) {
        console.log(error);
        if (error.response.status == 403) {
          handleOverlay();
          return;
        }
      }
    } else if (userToken && isExists == undefined) {
      // add to cart as a new cart item
      try {
        const data2 = {
          data: {
            product: productId,
            quantity: quantity,
            cart: cartId,
          },
        };
        const response = await addItemToCart(data2, userToken);
        console.log("test: ", response.data);
        console.log(response.data);
        dispatch(updateCart({ cart: response.data }));
      } catch (error) {
        console.log(error);
        if (error.response.status == 403) {
          handleOverlay();
          return;
        }
      }
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProduct(idFromUrl);
        setProduct(data.data[0]);
        /*const price = data.data[0].attributes.price;
        console.log(price)
        const stringPrice = price.toString();
        const priceSplit = stringPrice.split(".");*/
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getProduct();
    console.log(product);
  }, [isLoading]);

  return (
    <>
      {/*<Breadcrumbs />*/}
      {isModalShowing && (
        <Overlay
          onClose={handleOverlay}
          title="Add this product to cart"
          description="Add this product to your cart and access it anywhere by logging in now."
          icon={CartAdd}
        />
      )}
      <div className="product-info-parent">
        <div className="product-info-container">
          <div className="product-info-img-container">
            {!isLoading && (
              <img
                src={product?.attributes?.image?.data?.attributes?.url || ""}
              />
            )}
          </div>
          <div className="product-info">
            <div className="product-info-title-quantity">
              {!isLoading && (
                <h1 className="product-info-title">
                  {product?.attributes?.title || ""}
                </h1>
              )}
              {!isLoading && (
                <p className="product-info-quantity">
                  {product?.attributes?.weight || ""}
                </p>
              )}

              {/*!isLoading && (
              <p className="product-info-price">
                {product?.attributes?.price || ""}
              </p>
            )*/}

              <div className="product-info-price-button">
                {!isLoading && (
                  <div className="product-info-price-container">
                    <p className="product-info-price-whole">
                      {product.attributes.price.toString().split(".")[0]}.
                    </p>
                    <p className="product-info-price-fraction">
                      {product.attributes.price.toString().split(".")[1]}
                    </p>
                  </div>
                )}

                <div className="product-info-button-container">
                  <button
                    className="solid-button"
                    onClick={addToCart.bind(this, idFromUrl, 1)}
                  >
                    Add To Cart <box-icon name="plus" color="white"></box-icon>
                  </button>
                </div>
              </div>
            </div>

            {!isLoading && (
              <p className="product-info-description">
                {product?.attributes?.description || ""}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
