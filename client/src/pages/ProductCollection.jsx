import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductFilter from "../components/ProductFilter";
import Breadcrumbs from "../components/Breadcrumbs";
import Pagination from "../components/Pagination";
import {
  fetchVendorCatsProducts,
  fetchAllProducts,
  searchProducts,
  filterProducts,
} from "../utils/http";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function ProductCollection() {
  const location = useLocation();

  const { userToken, userId } = useSelector((state) => state.auth);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");
  const [path, setPath] = useState();
  const [allUnselected, setAllUnselected] = useState(null);

  const currentPath = location.pathname;
  const pathArray = currentPath.split("/");
  // check if search query
  //console.log(pathArray);

  let isQuery = pathArray.includes("search");
  let tempSearchText;
  //console.log(isQuery);



  const idFromUrl = pathArray[pathArray.length - 2];

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPageSize, setMaxPageSize] = useState(8);
  const [pageSize, setpageSize] = useState(0);
  const [totalProducts, setTotalProducts] = useState();
  const [pageCount, setPageCount] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const updatePage = () => {
    if (page < pageCount) {
      let pageNum = page + 1;
      setPage(pageNum);
    }
  };



  useEffect(() => {
    const getSearchedProducts = async (searchText) => {
      try {
        const data = await searchProducts(searchText);
        console.log("search response: ", data);
        setProducts(data.data);
        //setProducts(data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    //isQuery = pathArray.includes("search");
    //console.log(isQuery);

    if (isQuery) {
      console.log('WE ARE IN LESGO QUERY');
      setSearchText(searchParams.get("query"));
      tempSearchText = searchParams.get('query');
      console.log("search text: ", searchParams.get('query'));
      setSearchText(searchParams.get('query'));
      getSearchedProducts(tempSearchText);
    }
  }, [isQuery, searchParams.get('query')]);

  useEffect(() => {
    console.log('PRODUTCS EYO: ', products);
    console.log(isLoading)
  }, [products]);

  const updateProductsByPrice = () => {
    console.log("do nothing");
  }

  const updateProducts = async (selectedFilters) => {
    console.log(
      "temp but update products in ProductCollection from ProductFilter"
    );
    console.log("SELECTEDFILTERS FROM PRODUCT COLLECTION: ", selectedFilters);

    if (selectedFilters.length > 0) {
      setAllUnselected("false");
      try {
        const data = await filterProducts(selectedFilters);
        console.log("EHY THE FUCK AM I BEING CALLED")
        console.log(data);
        let filteredProducts = [];
        for (let i = 0; i < data.data.length; i++) {
          console.log("filtered products loop, ", filteredProducts);
          filteredProducts = [
            ...filteredProducts,
            ...data.data[i].attributes.products.data,
          ];
        }
        console.log("FILTERED PRODUCTS ", filteredProducts);
        setProducts(filteredProducts);

        // bit of a eeeeeeh
      } catch (error) {
        console.log(error);
      }
    } else {
      setAllUnselected("true");
    }
  };

  // separate get products and load more products
  useEffect(() => {
    const getProducts = async () => {
      setPage((prevPage) => 1);
      setProducts([]);
      setTotalProducts();
      setPageCount();
      setpageSize(0);

      try {
        const data = await fetchVendorCatsProducts(idFromUrl, "1", maxPageSize);
        setProducts(data.data);
        setTotalProducts(data.meta.pagination.total);
        setPageCount(data.meta.pagination.pageCount);
        setpageSize((prevPageSize) => prevPageSize + data.data.length);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    if (allUnselected === "true") {
      getProducts();
    }

    let isQuery = pathArray.includes("search"); 
    if (!isQuery) getProducts();
    //console.log("from get products using id: ", page);
  }, [idFromUrl]);

  useEffect(() => {
    const getProducts = async () => {
      setPage((prevPage) => 1);
      setProducts([]);
      setTotalProducts();
      setPageCount();
      setpageSize(0);

      try {
        const data = await fetchVendorCatsProducts(idFromUrl, "1", maxPageSize);
        setProducts(data.data);
        setTotalProducts(data.meta.pagination.total);
        setPageCount(data.meta.pagination.pageCount);
        setpageSize((prevPageSize) => prevPageSize + data.data.length);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (allUnselected === "true") getProducts();
  }, [allUnselected]);

  // load more products
  useEffect(() => {
    const loadMoreProducts = async () => {
      try {
        const data = await fetchVendorCatsProducts(
          idFromUrl,
          page,
          maxPageSize
        );
        setProducts((prevProducts) => [...prevProducts, ...data.data]);
        setTotalProducts(data.meta.pagination.total);
        setPageCount(data.meta.pagination.pageCount);
        setpageSize((prevPageSize) => prevPageSize + data.data.length);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    if (page > 1) loadMoreProducts();
    //console.log("from load more: ", page);
  }, [page]);

  return (
    <>
      {!searchText && <Breadcrumbs />}
      <div className="product-collection-page">
        <div className="product-filter-container">
          <ProductFilter
            updateCollection={updateProducts}
            updateByPrice={updateProductsByPrice}
          />
        </div>
        <div>
          <div className="product-list-container">
            <ul>
              {!isLoading &&
                products.map((product) => (
                  <li key={product.id}>
                    <ProductCard
                      id={product.id}
                      title={product.attributes.title}
                      price={product.attributes.price}
                      quantity={product.attributes.weight}
                      imageUrl={
                        product.attributes.image.data
                          ? product.attributes.image.data.attributes.url
                          : null
                      }
                    />
                  </li>
                ))}
            </ul>
          </div>
          <div className="product-pagination-container">
            {allUnselected !== "false" && (
              <Pagination
                newPage={updatePage}
                currentNum={pageSize}
                totalNum={totalProducts}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
