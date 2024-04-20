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
            url: 'http://openlibrary.org/search.json',
            params: { q: query, page: pageNumber},
            cancelToken: new axios.CancelToken(c => cancel = c) //cancel on new query
        }).then(result => {
            console.log(result.data)
            setNews(prevNews => {
                return [...new Set([...prevNews, ...result.data.docs.map(article => article.title)])];
            })
            setHasMore(result.data.docs.length > 0)
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