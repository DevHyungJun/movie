import React, { useState, useEffect, useRef } from 'react';
import '../componet-styles/search.css';

export const SearchScreen = ({ API_KEY }) => {
  const [movies, setMovies] = useState([]);
  const [baseUrl, setBaseUrl] = useState('');
  const [posterSize, setPosterSize] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState();
  const [detail, setDetail] = useState(false);
  const [genreObj] = useState({
    28: '액션',
    12: '모험',
    16: '애니메이션',
    35: '코미디',
    80: '범죄',
    99: '다큐멘터리',
    18: '드라마',
    10751: '가족',
    14: '판타지',
    36: '역사',
    27: '공포',
    10402: '음악',
    9648: '미스터리',
    10749: '로맨스',
    878: 'SF',
    10770: 'TV 영화',
    53: '스릴러',
    10752: '전쟁',
    37: '서부'
  });
  const [selectedMovieGenre, setSelectedMovieGenre] = useState([]);
  const [homeMode, setHomeMode] = useState('home');

  const setingInputVal = async (e) => { // input값 inputval에 등록
    if (e) e.preventDefault();
    setHomeMode('search');
    const value = e ? e.target.elements[0].value : document.getElementById('search-input').value;
    value ? setInputVal(value) : null;
  }

  useEffect(() => { // inputVal에 값이 등록되면 실행
    const fetchData = async () => { // 이미지를 불러오기 위한 base url 얻기
      try {
        const configResponse = await fetch(`https://api.themoviedb.org/3/configuration?api_key=${API_KEY}`);
        const configData = await configResponse.json();
        setBaseUrl(configData.images.base_url);
        setPosterSize('w500'); // Choose appropriate file size based on your requirements
        getMovieData();
      } catch (error) {
        console.error('Error fetching configuration:', error);
      }
    };

    inputVal ? fetchData() : null // inputVal에 값이 undefined일 때 초기화면 에러방지
  }, [inputVal]);

  const getMovieData = async () => { // 영화 정보 얻기
    try {
      const apiCall = await fetch(`https://api.themoviedb.org/3/search/movie?query=${inputVal}&api_key=${API_KEY}&page=${page}&language=ko-KR`);
      const data = await apiCall.json();
      setMovies(data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      // 스크롤이 페이지의 끝에 도달하면 추가 데이터 가져오기
      if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
        setLoading(true);
        fetchMoreData();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  // 추가 데이터를 가져오는 함수
  const fetchMoreData = async () => {
    try {
      const apiCall = await fetch(`https://api.themoviedb.org/3/search/movie?query=${inputVal}&api_key=${API_KEY}&page=${page + 1}&language=ko-KR`);
      const data = await apiCall.json();
      setMovies(prevMovies => [...prevMovies, ...data.results]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const imgClick = (movie) => {
    setSelectedMovieGenre([...movie.genre_ids]);
    setSelectedMovie(movie);
    setDetail(true);
  };

  const detailRemove = (e) => {
    e.stopPropagation();
    let target = e.target;

    while (target.parentNode) {
      target = target.parentNode;
      if (target.className === 'detail-img-section' || target.className === 'detail-span-section') {
        return;
      }
    }
    setDetail(false);
  }

  return (
    <div>
      <Header setingInputVal={setingInputVal} inputVal={inputVal} />
      <div className='mb'></div>
      {inputVal && movies.length > 0 ? (
        <h1 className='search-h1'>"{inputVal}"의 검색 결과입니다.</h1>
      ) : inputVal && movies.length === 0 ? (
        <h1 className='search-h1'>"{inputVal}" 검색 결과를 찾을 수 없습니다. 새로고침 후 다시 시도해주십시오.</h1>
      ) : null}

      {selectedMovie && detail ? (
        <div className='detail-section' onClick={detailRemove}>
          <div className='detail-img-section'>
            <img
              src={`${baseUrl}${posterSize}${selectedMovie.poster_path}`}
              alt={selectedMovie.title} className='detail-img'
            />
          </div>
          <div className='detail-span-section'>
            <h2>{selectedMovie.title}<br />({selectedMovie.release_date})</h2>
            <p>{
              selectedMovieGenre.map(d => genreObj[d]).join(', ')
            }</p>
            <p>{selectedMovie.overview}</p>
            <p>평점: {Math.floor(selectedMovie.vote_average * 10)} / 100</p>
          </div>
        </div>
      ) : null}

      {homeMode === 'home' ? <HomeScreen API_KEY={API_KEY} genreObj={genreObj} /> : (
        <div className="movie-list">
          {movies.map(movie => (
            <div key={movie.id} className="movie-item">
              {movie.poster_path && (
                <img
                  src={`${baseUrl}${posterSize}${movie.poster_path}`}
                  alt={movie.title} className='movie-img' onClick={() => imgClick(movie)}
                />
              )}
            </div>
          ))}
        </div>
      )}
      <div id="bottom"></div>
    </div>
  )
}

const Header = ({ setingInputVal, inputVal }) => {
  const [inputCount, setInputCount] = useState(false);

  const showInput = () => {
    if (!inputCount) {
      const input = document.querySelector('#search-input');
      input.style.animation = 'showInput 0.5s forwards';
      setInputCount(true);
    } else {
      setingInputVal();
    }
  }

  const reload = () => window.location.reload();

  return (
    <div className='header-container'>
      <div onClick={reload} className='reloadBtn'><h1>MOVIE</h1></div>
      <div className='input-box'>
        <img src="/img/search-icon.png" onClick={showInput} />
        <form id='searchInput' onSubmit={setingInputVal}>
          <input type="text" id='search-input' />
        </form>
      </div>
    </div>
  )
}

const HomeScreen = ({ API_KEY, genreObj }) => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [baseUrl, setBaseUrl] = useState('');

  const endPointObj = {
    popularMovies: 'popular',
    topRatedMovies: 'top_rated',
    nowPlayingMovies: 'now_playing',
    upComingMovies: 'upcoming',
  }

  const fetchIMGData = async () => { // 이미지를 불러오기 위한 base url 얻기
    try {
      const configResponse = await fetch(`https://api.themoviedb.org/3/configuration?api_key=${API_KEY}`);
      const configData = await configResponse.json();
      setBaseUrl(configData.images.base_url);
      fetchData();
    } catch (error) {
      console.error('Error fetching configuration:', error);
    }
  }

  const fetchMovies = async (endPoint) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${endPoint}?api_key=${API_KEY}&language=ko-KR&page=1`);
    const data = await response.json();
    return data;
  };

  const fetchData = async () => {
    const promises = Object.values(endPointObj).map(endPoint => fetchMovies(endPoint));
    const resultAll = await Promise.all(promises);
    setPopularMovies(resultAll[0].results);
    setTopRatedMovies(resultAll[1].results);
    setNowPlayingMovies(resultAll[2].results);
    setUpcomingMovies(resultAll[3].results);
  };

  useEffect(() => {
    fetchIMGData();
  }, []);

  return (
    <>
      <DrawMovie endPoint={popularMovies} baseUrl={baseUrl} sectionTitle='인기 영화' genreObj={genreObj} />
      <DrawMovie endPoint={topRatedMovies} baseUrl={baseUrl} sectionTitle='명작' genreObj={genreObj} />
      <DrawMovie endPoint={nowPlayingMovies} baseUrl={baseUrl} sectionTitle='현재 상영 중' genreObj={genreObj} />
      <DrawMovie endPoint={upcomingMovies} baseUrl={baseUrl} sectionTitle='개봉 예정' genreObj={genreObj} />
    </>
  )
}

const DrawMovie = ({ endPoint, baseUrl, sectionTitle, genreObj }) => {
  const [selectedMovie, setSelectedMovie] = useState();
  const [detail, setDetail] = useState(false);
  const [selectedMovieGenre, setSelectedMovieGenre] = useState([]);
  const movieListRef = useRef(null);

  const imgClick = (movie) => {
    setSelectedMovieGenre([...movie.genre_ids]);
    setSelectedMovie(movie);
    setDetail(true);
  }

  const detailRemove = (e) => {
    e.stopPropagation();
    let target = e.target;

    while (target.parentNode) {
      target = target.parentNode;
      if (target.className === 'detail-img-section' || target.className === 'detail-span-section') {
        return;
      }
    }
    setDetail(false);
  }

  const scrollLeft = () => {
    if (movieListRef.current) {
      movieListRef.current.scrollBy({
        top: 0,
        left: -1450, // Adjust the scroll amount as needed
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (movieListRef.current) {
      movieListRef.current.scrollBy({
        top: 0,
        left: 1450, // Adjust the scroll amount as needed
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {selectedMovie && detail ? (
        <div className='detail-section' onClick={detailRemove}>
          <div className='detail-img-section'>
            <img
              src={`${baseUrl}w500${selectedMovie.poster_path}`}
              alt={selectedMovie.title} className='detail-img'
            />
          </div>
          <div className='detail-span-section'>
            <h2>{selectedMovie.title}<br />({selectedMovie.release_date})</h2>
            <p>{
              selectedMovieGenre.map(d => genreObj[d]).join(', ')
            }</p>
            <p>{selectedMovie.overview}</p>
            <p>평점: {Math.floor(selectedMovie.vote_average * 10)} / 100</p>
          </div>
        </div>
      ) : null}

      {/* 홈화면 렌더링 부분 */}
      <div className='home-screen'>
        <h1 className='home-list-title'>{sectionTitle}</h1>

        <div className='flex-container'>
          <div className="left arrow" onClick={scrollLeft}><img src="/img/left.png" alt="next_left" /></div>
          <div className='home-movie-list' ref={movieListRef}>
            {endPoint.map(movie => (
              <div key={movie.id} className="home-movie-item">
                {movie.poster_path && (
                  <img
                    src={`${baseUrl}w500${movie.poster_path}`}
                    alt={movie.title} className='movie-img' onClick={() => imgClick(movie)}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="right arrow" onClick={scrollRight}><img src="/img/right.png" alt="next_left" /></div>
        </div>
      </div>
    </>
  )
}