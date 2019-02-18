import React from "react";
import "./ProductTile.css";

const ProductTile = props => {
  const { name, department, price, imgURL, id } = props;
  return (
    <div className="card">
      <div className="img-container">
        <img alt={name} src={imgURL} />
      </div>
      <div className="content">
        <ul>
          <li>
            <strong>{name}</strong>
          </li>
          <li>
            <strong>{department}</strong>
          </li>
          <li>
            <strong>$ {price}</strong>
          </li>
          <li>
            <button onClick={() => props.purchaseItem(id, name)}>Add to Cart</button>
          </li>
        </ul>

      </div>
    </div>
  );
}

export default ProductTile;
