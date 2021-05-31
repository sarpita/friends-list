import React from "react";
import './style.css';

const Pagination = (props) => {
  const {
    totalPages,
    onPageChanged,
    onNext,
    onPrev,
    currentPage,
  } = props;
  const createPagesButtons =()=>{
      const paginationList =[];
      for(let i=1;i<=totalPages;i++){
        paginationList.push(<li className={`pagination-page-btn ${parseInt(currentPage) === i? 'active':''}`} onClick={onPageChanged} key={i}>{i}</li>)
      }
      return paginationList;
  }
  return (
      <div>{
        totalPages >1 && <div className="pagination-wrapper">
          <button className={`pagination-button`} onClick={onPrev}>Previous</button>
          {
            createPagesButtons()
          }
          <button className={`pagination-button`} onClick={onNext}>Next</button>
          </div>
        }
      </div>
  )
};

export default Pagination;
