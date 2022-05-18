import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    
    // return sumAmount[product.id] = 1;

    // return 
    const newSumAmmount = {...sumAmount};

    newSumAmmount[product.id] = product.amount;

    return newSumAmmount;  
    
  }, {} as CartItemsAmount)

  console.log(cartItemsAmount);

  useEffect(() => {
    async function loadProducts() {
      
        /// aqui no axios eu poderia passar assim:
        /// api.get<Product[]>() pra indicar que o tipo do elem é Product
        /// dentro do map eu nao precisaria por o tipo e ele já identificaria oque é 

        await api.get('products')
        .then(
            
            response=>{
                
                    // console.log(response.data);
                    // setTransactions(response.data.transactions);
                    const formatado = response.data.map( ( elem : Product ) => ({

                      ...elem,
                      priceFormatted: formatPrice(elem.price)
                      
                    } )
                    );

                    // console.log("formatado:",formatado);

                    setProducts(formatado);
                        
                });
    
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    // TODO

    addProduct(id);

  }

  return (
    <ProductList>

      {

        products.map( product => (

                <li key={product.id}>
                <img src={product.image} alt={product.title} />
                <strong>{product.title}</strong>
                <span>{product.priceFormatted}</span>
                <button
                  type="button"
                  data-testid="add-product-button"
                  onClick={() => handleAddProduct(product.id)}
                >
                  <div data-testid="cart-product-quantity">
                    <MdAddShoppingCart size={16} color="#FFF" />
                    {cartItemsAmount[product.id] || 0}
                  </div>
        
                  <span>ADICIONAR AO CARRINHO</span>
                </button>
              </li>


          )

          )

      }
      

      
    
    
    </ProductList>
  );
};

export default Home;

