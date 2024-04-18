import { useEffect, useState, useRef } from 'react';
import Connection from './assets/Connection.png';
import Wifi from './assets/Wifi.png';
import Battery from './assets/Battery.png';
import Close from './assets/close-icon.png';
import More from './assets/more-icon.png';

import './App.css';
import axios from 'axios';
import useDebounce from './hooks/useDebounce';
import List from './components/List/List';
import Search from './components/Search/Search';


interface ListItem {
  value: number;
  label: string;
}
function App() {
  const [list, setList] = useState<ListItem[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [checkboxes, setCheckboxes] = useState<Array<boolean>>([]);
  const [isButtonActive, setIsButtonActive] = useState<boolean>(true);
  const ref = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(search, 500);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearch) {
        try {
          setLoading(true);
          const response = await axios.get(`https://vk-testing-api.vk-mini-apps-dev.magicgophers.com/?query=${debouncedSearch}&take=15&skip=${currentPage}`);
          setList([...list, ...response.data.items]);
          setLoading(false);
  
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      } else {
        setList([]);
      }}

    fetchSearchResults();

  }, [debouncedSearch, currentPage])

  useEffect(() => {
    if (list.length) {
      const arrCheck = new Array(list.length).fill(false);
      setCheckboxes(arrCheck);      
    }
  }, [list]);

  useEffect(() => {
    if (!list.length) {
      setIsButtonActive(true);
    }
  }, [list.length]);

  useEffect(() => {
    if (!search) {
      setCurrentPage(0);      
    } else {
      setCurrentPage(0);   
      setList([]);
    }
  }, [search]);

  const scrollHandler = () => {
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      
      if ((scrollHeight - (scrollTop + clientHeight)) < 10) {
        setCurrentPage(page => page + 15);
      }      
    };
  }

  const handleChecked = (index: number) => {
    const updatedCheckboxes = [...checkboxes];
    updatedCheckboxes[index] = !updatedCheckboxes[index];
    setCheckboxes(updatedCheckboxes);
    if (updatedCheckboxes.some((checkbox) => checkbox)) {
      setIsButtonActive(false);
    } else {
      setIsButtonActive(true);
    }
  };

  const handleSend = (e: { preventDefault: () => void; }) => {
    setList([]);
    setSearch('');
    e.preventDefault();
  };

  return (
    <div className='layout'>
      <div className='main'>
        <div className='status-bar'>
          <p>12:48</p>
          <div className='status-bar-icons'>
            <img src={Connection} alt='icon'/> 
            <img src={Wifi} alt='icon'/> 
            <img src={Battery} alt='icon'/> 
          </div>
        </div>
        <div className='header'>
          <div className='header-buttons'>
            <img src={More} alt='button-icon' /> 
            <div className='header-buttons-line' />
            <img src={Close} alt='button-icon'/> 
          </div>
        </div>
        <h1>Mini App</h1>
        <div className='content'>
          <Search value={search} handleSearch={(e) => setSearch(e.target.value)} />
          {list.length > 0 && (
            <div className='content-list' ref={ref} onScroll={scrollHandler} >
            <List list={list} handleChecked={handleChecked} />
          </div>
          )}
          <button 
            className={isButtonActive ? 'content-button-active' : 'content-button'} 
            disabled={isButtonActive}
            onClick={handleSend}
          >Отправить</button>
        </div>
      </div>
    </div>
  );
}

export default App;
