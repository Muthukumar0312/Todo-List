import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import { useState ,useEffect} from 'react';
import AddItem from "./AddItem";
import SearchItem from "./SearchItem";
import apiRequest from "./apiRequest";

function App(){

  const API_URL = 'http://localhost:3500/items';
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('')
  const [search, setSearch] = useState('')
  const [fetchError, setFetchError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try{
        const response = await fetch(API_URL);
        if(!response.ok) throw Error("Data not received");
        const listItems = await response.json();
        console.log(listItems)
        setItems(listItems);
        setFetchError(null)
      } catch (err){
        setFetchError(err.message)
      } finally{
        setIsLoading(false)
      }
    }
    setTimeout(() => {
      (async () => await fetchItems())()
    }, 1000)
    
  },[])

  const addItem = (item) => {
    const id=items.length ? items[items.length-1].id+1 : 1;
    const addNewItem = {id, checked:false, item}
    const listItems=[...items, addNewItem]
    setItems(listItems)

    const postOptions={
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(addNewItem)
    }
    const result=apiRequest(API_URL,postOptions)
    if(result) setFetchError(result)
  }

  const handleCheck=(id) => {
    const listItems = items.map((item)=> item.id===id ? {...item,checked:!item.checked} : item)
    setItems(listItems)
  }

  const handleDelete=(id) => {
    const listItems = items.filter((item) => item.id!==id)
    setItems(listItems)
  }

  const handleSubmit=(e) => {
    e.preventDefault()
    if(!newItem) return;
    console.log('submitted')
    addItem(newItem)
    setNewItem('')
  }

  return(
    <div className="App">
      <Header title="To-do Lists"/>
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem
        search={search}
        setSearch={setSearch}
      />
      <main>
        {isLoading && <p>Loading Items..</p>}
        {fetchError && <p>{`Error: ${fetchError}`}</p>}
      {!isLoading && !fetchError && <Content
         items={items.filter(item => ((item.item).toLowerCase()).includes(search.toLowerCase()))}
         handleCheck={handleCheck}
         handleDelete={handleDelete}
      />}
      </main>
      <Footer
        length={items.length}
      />
    </div>
  );
}
export default App;
