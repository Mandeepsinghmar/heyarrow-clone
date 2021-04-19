/* eslint-disable */
import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import CustomIcon from '../CustomIcon';
import './index.scss';
import ProductComment from '../ProductComment';
import PropTypes from 'prop-types';
import { createProductComment, getProductListComment} from '../../../api/adminProducts';
import {connect} from 'react-redux';
import MentionInput from '../MentionTextBox';
const ProductCommentList = (props) => {
  const [comment, setComment] = useState('');
  const { dispatch, product, productCommentList} = props;
  const addComment = () => {
    dispatch(createProductComment({
        productId: product.id,
        comment: comment,
      })).then(() => {
        setComment('');
    });
  };

  useEffect(() => {
   if(product && product.id){
    dispatch(getProductListComment(product.id));
   }
  }, [product.id]);

  return( 
    <>
      <div className="cardHeader commentHead">
        <h4>Comments</h4>
      </div>
      <div className="Admin-chatboxCon">
        <div className="chatBody">
          <ul>
            {props.product.comments &&
              props.product.comments.map((comment) => (
                <ProductComment key={comment.id}  comment={comment} />
              ))}
          </ul>
        </div>
        <form className="chat-message__footer">
          <MentionInput
            value={comment}
            placeholder="Post a comment or @reply"
            onChange={(e) => setComment(e.target.value)}
          />
          <IconButton
            aria-label="send"
            className="chatSendBtn"
            disabled={!comment}
            onClick={addComment}
          >
            <CustomIcon icon="airplane" />
          </IconButton>
        </form>
      </div>
    </>
  )
}

ProductCommentList.propTypes = {
  classes: PropTypes.object,
  dispatch: PropTypes.func,
  product: PropTypes.object,
  statuses: PropTypes.array,
  selectedValue: PropTypes.bool
};

const mapStateToProps = (state) => ({
  productCommentList: state.adminProduct.productCommentList,
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(ProductCommentList);













// export class ProductCommentList extends React.Component {
//   constructor(props){  
//     super(props);  
//     this.state = {
//       comment: '',
//     };
//   }

//   addComment = () => {
//     const { dispatch, product } = this.props;
//     // dispatch(addProductComment({
//     //     productId: product.id,
//     //     comment: this.state.comment,
//     //   })).then(() => {
//     //   this.setState({
//     //     comment: '',
//     //   });
//     // });
//   };

//   handleInput = ({ target }) => {
//     this.setState({
//       comment: target.value,
//     });
//   };

//   handleChange = (e, value, newValue, newPlainTextValue, mentions) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       this.addComment();
//     }
//     this.setState({
//       comment: value,
//       mentionData: { newValue, newPlainTextValue, mentions },
//     });
//   };
//   render() {
//     const { product, classes } = this.props;
//     return (
//       <>
//         <div className="cardHeader ">
//           <h4>Comments</h4>
//           <p>Comments posted by team members.</p>
//         </div>
//         <div className="Admin-chatboxCon">
//           <div className="chatBody">
//             {/* <ul>
//               {product.comments &&
//                 product.comments.map((comment) => (
//                   <ProductComment key={comment.id} comment={comment} />
//                 ))}
//             </ul> */}
//           </div>
//           <div className="chatFooter">
//             <IconButton
//               aria-label="send"
//               className={styles.sendBtn}
//               disabled={!this.state.comment}
//               onClick={this.addComment}
//             >
//               {this.state.comment ? (
//                 <CustomIcon icon="airplane" />
//               ) : (
//                 <CustomIcon icon="airplane-disabled" />
//               )}
//             </IconButton>
//             <MentionInput
//               value={this.state.comment}
//               handleChange={this.handleChange}
//               placeholder="Post a comment or @reply"
//               submit={this.addComment}
//             />
//           </div>
//         </div>
//       </>
//     );
//   }
// }

// export default ProductCommentList;
