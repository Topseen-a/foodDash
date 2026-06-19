import { useState,useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { getMenu } from '../api/endpoints'; 
import { useAuth } from '../context/AuthContext'; 
// import { useCart } from '../context/CartContext'; 


export default function MenuPage(){ 
    const {user} =useAuth(); 
    // const { refreshCart } = useCart();
    const navigate = useNavigate(); 
    const [menu,setMenu] = useState([]);
    const [activeTab,setTab] = useState(null); 
    const [adding,setAdding] = useState(null); 
    
    useEffect(()=> { 
        getMenu().then(({data}) => {
            setMenu(data.data); 
            if(data.data.length>0) setTab(data.data[0].id);
            });
        }, []);


    const handleAdd = async(menuItemId)=>{
        if (!user) { navigate('/login'); return; }
        setAdding(menuItemId);
        try{
            await addToCart({menu_item_id:menuItemId,quantity:1 });
            // await refreshCart();
        } catch(err) {
            alert(err.response?.data?.error||'Could not add to cart');
        } finally{
            setAdding(null);
        }
    };


    const activeCategory = menu.find(c=> c.id===activeTab);
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Our Menu</h1>
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {" "}
          {menu.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setTab(cat.id)}
              className={`px-4 py-2  rounded-full whitespace-nowrap ${activeTab === cat.id ? "bg-orange-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              {cat.name}{" "}
            </button>
          ))}{" "}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {" "}
          {activeCategory?.items?.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col gap-3"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}{" "}
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {item.description}
                </p>
              </div>{" "}
              <div className="flex justify-between items-center">
                <span className="text-orange-500 font-bold text-lg">
                  ₦{item.price?.toFixed(2)}
                </span>
                <button
                  onClick={() => handleAdd(item.id)}
                  disabled={adding === item.id}
                  className="bg-orange-500 text-white px-4 py-1.5 rounded-lg hover:bg-orange-600 disabled:opacity-50 text-sm"
                >
                  {" "}
                  {adding === item.id ? "Adding..." : "+Add"}{" "}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}