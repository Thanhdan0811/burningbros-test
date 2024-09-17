import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css';
import { ManageTimeOutTypes, ProductTypes } from './models';
import { getListProducts, searchProducts } from './api';

function App() {
  const [listProduct, setListProduct] = useState<ProductTypes[]>([]);
  const [search, setSearch] = useState<string>("");
  const skipPaginate = useRef(0);
  const timeSetTimeOut = useRef<ManageTimeOutTypes>({
    search: undefined,
    scroll: undefined,
  });

  // call api get products after search.
  const getSearchProducts = useCallback(async (searchValue: string = '') => {
    if (timeSetTimeOut.current.search) clearTimeout(timeSetTimeOut.current.search);
    skipPaginate.current = 0;
    timeSetTimeOut.current.search = setTimeout(async () => {
      const listData = await searchProducts(searchValue);
      skipPaginate.current++;
      setListProduct([...listData]);
    }, 700);
  }, [])

  // call api get products when scroll to bottom.
  const scrollGetMoreProducts = useCallback(() => {
    if (timeSetTimeOut.current.scroll) clearTimeout(timeSetTimeOut.current.scroll);
    timeSetTimeOut.current.scroll = setTimeout(async () => {
      let listData = [];
      if (search === "") {
        listData = await getListProducts(skipPaginate.current);
      } else {
        listData = await searchProducts(search, skipPaginate.current);
      }
      skipPaginate.current++;
      setListProduct((preList: ProductTypes[]) => {
        return [...preList, ...listData];
      });
    }, 300)
  }, [search]);

  useEffect(() => {
    // handler for event scroll of window.
    const scrollHandler = () => {
      if ((document.documentElement.offsetHeight - document.documentElement.clientHeight - document.documentElement.scrollTop) > 50) return;
      scrollGetMoreProducts();
    }
    window.addEventListener('scroll', scrollHandler);

    // call when mounted once, and when search change.
    getSearchProducts(search);


    return () => {
      // clear all timeout and remove event handler.
      clearTimeout(timeSetTimeOut.current.search);
      clearTimeout(timeSetTimeOut.current.scroll);
      window.removeEventListener('scroll', scrollHandler);
    }

  }, [search]);

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
  }

  return (
    <>
      <div className='app'>
        <div className="form-control">
          <input type="text" placeholder='enter product name.' value={search} onChange={handleSearch} />
        </div>
        <div className='product-lists'>
          {
            listProduct.length < 1 ?
              <h4 className='not-found'>{search} product not found!!</h4> 
              :
              listProduct.map((prod) => (
                <div className='product-wrap' key={prod.id}>
                  <div>
                    <img src={prod.thumbnail} alt={prod.title} />
                  </div>
                  <h4 className='title'>{prod.title}</h4>
                  <p className='price'>{prod.price}</p>
                </div>
              ))
          }
        </div>
      </div>
    </>
  )
}

export default App
