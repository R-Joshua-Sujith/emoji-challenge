
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const itemsPerPage = 10;
const pagesToShow = 10;
function App() {
  const [data, setEmojiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const getData = async () => {
      await axios.get("https://emojihub.yurace.pro/api/all")
        .then((res) => {
          setEmojiData(res.data);

          const arr = res.data.map((item) => item.category);
          arr.unshift('All');
          const set = new Set(arr);
          const newArr = Array.from(set);
          setCategory(newArr);
        })
    }
    getData();

  }, [])


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredData = selectedCategory === 'All' ? data : data.filter((item) => item.category === selectedCategory);
  const totalItems = filteredData.length;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);

  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (currentPage <= pagesToShow - 3) {
    for (let i = 1; i <= Math.min(totalPages, pagesToShow); i++) {
      pageNumbers.push(
        <button key={i} onClick={() => handlePageChange(i)}>
          {i}
        </button>
      );
    }
    if (totalPages > pagesToShow) {
      pageNumbers.push(
        <span key="ellipsis">...</span>
      );
    }
    pageNumbers.push(
      <button key={totalPages} onClick={() => handlePageChange(totalPages)}>
        {totalPages}
      </button>
    );
  } else if (currentPage >= totalPages - (pagesToShow - 2)) {
    pageNumbers.push(
      <button key={1} onClick={() => handlePageChange(1)}>
        1
      </button>
    );
    if (totalPages > pagesToShow) {
      pageNumbers.push(
        <span key="ellipsis">...</span>
      );
    }
    for (let i = totalPages - (pagesToShow - 2); i <= totalPages; i++) {
      pageNumbers.push(
        <button key={i} onClick={() => handlePageChange(i)}>
          {i}
        </button>
      );
    }
  } else {
    pageNumbers.push(
      <button key={1} onClick={() => handlePageChange(1)}>
        1
      </button>
    );
    if (totalPages > pagesToShow) {
      pageNumbers.push(
        <span key="ellipsis">...</span>
      );
    }
    for (let i = currentPage - Math.floor((pagesToShow - 3) / 2); i <= currentPage + Math.floor((pagesToShow - 3) / 2); i++) {
      pageNumbers.push(
        <button key={i} onClick={() => handlePageChange(i)}>
          {i}
        </button>
      );
    }
    if (totalPages > pagesToShow) {
      pageNumbers.push(
        <span key="ellipsis">...</span>
      );
    }
    pageNumbers.push(
      <button key={totalPages} onClick={() => handlePageChange(totalPages)}>
        {totalPages}
      </button>
    );
  }



  return (
    <div>
      <div className="filter">
        <select
          className="filter-Select"
          value={selectedCategory}

          onChange={handleCategoryChange}
        >
          {category.map((option, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}

        </select>
      </div>

      <div className='emojiList'>
        {
          currentItems.map((emoji) => (
            <div className='emoji'>
              <div className='icon'> <span className='icon' dangerouslySetInnerHTML={{ __html: emoji.htmlCode[0] }}></span></div>
              <div class="hover-content">
                <div>Name: {emoji.name}</div>
                <div>Category: {emoji.category}</div>
                <div>Group: {emoji.group}</div>
              </div>
            </div>
          ))
        }


      </div>
      <div className='buttons'>
        {pageNumbers.map((number) => (
          <span className='button' key={number}>{number}</span>
        ))}
      </div>
    </div >
  );
}

export default App;
