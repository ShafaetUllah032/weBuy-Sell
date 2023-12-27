import React from "react";
import ProductItem from "./ProductItem";
interface ProductItemProps {
  isLoading: boolean;
  products: {
    _id: string;
    name: string;
    description: string;
    price: number;
    imagePath: string;
    sellerId: string;
    sellerName: string;
  }[];
}
const ProductsList = ({
  products,
  isLoading,
}: ProductItemProps): JSX.Element => {
  return (
    <ul className="mt-10 p-2 flex flex-col lg:flex-row lg:flex-wrap lg:justify-evenly ">
      {products.map((p, id) => {
        return (
          <ProductItem
            key={p._id ? p._id : id}
            product={p}
            isLoading={isLoading}
          />
        );
      })}
    </ul>
  );
};

export default ProductsList;