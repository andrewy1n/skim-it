import logo from './logo.svg';
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import './css/App.css';
import Modal from './components/Modal'
import NewSearch from './components/NewSearch';

function App() {
  const [openModal, setOpenModal] = useState(false);
  const [selection, setSelection] = useState('');
  const [tldr, setTldr] = useState('');
  const [content, setContent] = useState('');

  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const handleRefresh = () => {
    window.location.reload();
  };

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
      <div className='headerBlock'>
        <div className='hero' onClick={handleRefresh}>
          <img className='logo' src={logo} alt="Skim-It Logo"></img>
          <h1>skim-it</h1>
        </div>
          <Form.Control 
            className='searchField'
            type="text" 
            placeholder="Search" 
            spellCheck="false"
            value={query} 
            onChange={handleSearch}
          />
      </div>
        <div className='articleContainer'>
          {news.map((article, index) => {
            if (news.length === index + 1) {
              return (
                <button 
                  ref = {lastArticleElementRef}
                  key={article.title} 
                  className='modalBtn' 
                  onClick={() => {setOpenModal(true); 
                  setSelection(article.title);
                  setTldr(article.author);
                  setContent(article.content);
                  }}>
                    <div className='fishing'>
                      <div className='hook'>{article.title}</div>
                      <img className='bait' src={'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png'}></img>
                    </div>
                  </button>
              )
            } else {
              return (
                <button 
                  key={article.title} 
                  className='modalBtn' 
                  onClick={() => {setOpenModal(true); 
                  setSelection(article.title);
                  setTldr(article.author);
                  setContent(article.content);
                  }}>
                    <div className='fishing'>
                      <div className='hook'>{article.title}</div>
                      <img className='bait' src={'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png'}></img>
                    </div>
                  </button>
                      )
                    }
                  }
                  )}
        </div>
        <div>{loading && 'Loading...'}</div>
        <div>{error && 'Error'}</div>
        <Modal 
          open={openModal} 
          onClose={() => setOpenModal(false)} 
          title={selection}
          tldr={tldr}
          content={content}/>
      </div>
  );
}

export default App;
