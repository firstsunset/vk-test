import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import logo from './logo.svg';
import Connection from './assets/Connection.png';
import Wifi from './assets/Wifi.png';
import Battery from './assets/Battery.png';
import Close from './assets/close-icon.png';
import More from './assets/more-icon.png';

import './App.css';
import axios from 'axios';


interface List {
  value: number;
  label: string;
}
function App() {
  const [list, setList] = useState<List[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [checkboxes, setCheckboxes] = useState<Array<boolean>>([]);
  const [isButtonActive, setIsButtonActive] = useState<boolean>(true);
  const ref = useRef<HTMLInputElement>(null);
   
  useEffect(() => {
    if (search && fetching && isButtonActive ) {
      console.log('fetchi');
      
      axios.get(`https://vk-testing-api.vk-mini-apps-dev.magicgophers.com/?query=${search}&take=15&skip=${currentPage}`)
            .then(response => {
              setList([...list, ...response.data.items]);
              setCurrentPage(prev => prev + 15);
            })
            .finally(() => setFetching(false));
    }
  }, [search, fetching, isButtonActive])

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

  const scrollHandler = () => {
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      
      if ((scrollHeight - (scrollTop + clientHeight)) < 100) {
        setFetching(true)
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

  const handleSend = () => {
    setList([]);
    setFetching(true);
    setSearch('');
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
          <div className='content-search-block'>
            <input 
              className='content-search' 
              type="text" 
              placeholder='Имя'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {list.length > 0 && (
            <div className='content-list' ref={ref} onScroll={scrollHandler} >
            {list && (
              list.map(({ label, value }, index) => 
                <div className='content-list-row' key={value}>
                  <input className='checkbox' type="checkbox" onChange={() => handleChecked(index)} />
                  {label}
                </div>)
            )}
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
