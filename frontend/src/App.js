import logo from './logo.svg';
import React, { useState, useRef, useCallback, useEffect } from 'react'
import './css/App.css';
import Modal from './components/Modal'
import NewSearch from './components/NewSearch';

function App() {
  const [openModal, setOpenModal] = useState(false);
  const [selection, setSelection] = useState('');

  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const {
    news,
    hasMore,
    loading,
    error
  } = NewSearch(query, pageNumber);

  // load more at last element
  const observer = useRef();
  const lastArticleElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) { observer.current.disconnect(); }
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // search function
  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = 'hidden'; //disable scrolling on open modal
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto'; //reset to default when modal closes
    }
  }, [openModal])

  return (
    <div>
      <h1>skim-it</h1>
        <input type='text' calue={query} onChange={handleSearch}></input>
        <div className='articleContainer'>
          {news.map((article, index) => {
            if (news.length === index + 1) {
              return (<button ref = {lastArticleElementRef} key={article} className='modalBtn' onClick={() => {setOpenModal(true); setSelection(article);}}>
                {article}
              </button>)
            } else {
              return (<button key={article} className='modalBtn' onClick={() => {setOpenModal(true); setSelection(article);}}>
                {article}
              </button>)
            }
          }
          )}
        </div>
        <div>{loading && 'Loading...'}</div>
        <div>{error && 'Error'}</div>
        <Modal open={openModal} onClose={() => setOpenModal(false)} title={selection}/>
    </div>
  );
}

export default App;
