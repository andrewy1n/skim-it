import { useEffect, useState } from 'react'
import axios from 'axios'

function NewSearch(query, pageNumber) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [news, setNews] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setNews([]);
    }, [query])

    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel;
        axios({
            method: 'GET',
            url: 'http://localhost:8000/search',
            params: {page: pageNumber,  q: query},
            cancelToken: new axios.CancelToken(c => cancel = c) //cancel on new query
        }).then(result => {
            setNews(prevNews => {
                return [...new Set([...prevNews, ...result.data.items])];
            })
            setHasMore(result.data.items.length > 0)
            setLoading(false);
        }).catch(e => {
            if (axios.isCancel(e)) return //unless error is a cancel, ignore
            setError(true);
        })
        return () => cancel(); //don't send additional get requests whenever query is changed
    }, [query, pageNumber])
  return { news, hasMore, loading, error }
}

export default NewSearch;