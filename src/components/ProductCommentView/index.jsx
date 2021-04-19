import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import Comment from '../Comment';

const ProductCommentList = ({ product }) => {
  const [activeComments, setActiveComments] = useState(2);
  return product.comments.length ? (
    <div className="product-comment-list-container">
      <div>
        {product.comments.slice(0, activeComments).map((comment) => (
          <Comment key={comment.id} comment={comment} productId={product.id} />
        ))}
      </div>
      {product.comments.length > activeComments
        && (
          <a className="viewAllLink" onClick={() => setActiveComments(activeComments + 5)}>
            View all
            {' '}
            {product.comments.length - activeComments}
            {' '}
            comments
          </a>
        )}
    </div>
  ) : '';
};

ProductCommentList.propTypes = {
  product: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ProductCommentList;
