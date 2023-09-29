import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  cartItemCount=new BehaviorSubject(0)// to hold cart item count

  searchTerm=new BehaviorSubject('')//to hold search value
  //using behaviour subject to pass stream of data from one 

  constructor(private http:HttpClient) {
    this.cartCount()
   }

  BASE_URL='https://ecart-8mz7.onrender.com'
  //Api call to get all products from the database
  getAllProducts(){
    return this.http.get(`${this.BASE_URL}/products/all-products`)

  }

  //api call for view particular product from the database
  viewProducts(id:any){
    return this.http.get(`${this.BASE_URL}/products/view-product/${id}`)
  }

  //api function to add to the wishlist
  addToWishlist(id:any,title:any,price:any,image:any){
    const body = {
      id,
      title,
      price,
      image
    }
    return this.http.post(`${this.BASE_URL}/wishlists/add-to-wishlist`,body)
  }

  //view all products 
  viewWishlist(){
    return this.http.get(`${this.BASE_URL}/wishlists/view-all-wishlist`)
  }

  //delete wishlist products
  deleteWishlistProducts(id:any){
    return this.http.delete(`${this.BASE_URL}/wishlists/delete-wishlist-product/${id}`)
  }

//add to cart
addToCart(product:any){//product is an object with any propertied
  //get all products details -  id ,title,price,image,quantity
  const body={
    id:product.id,
    title:product.title,
    price:product.price,
    image:product.image,
    quantity:product.quantity
  }
  return this.http.post(`${this.BASE_URL}/carts/add-to-cart`,body)

}
//get cart products
getCart(){
  return this.http.get(`${this.BASE_URL}/carts/get-cart`)
}

//to get cart product count
cartCount(){
  this.getCart().subscribe((result:any)=>{
    this.cartItemCount.next(result.length)
  })
}

//delete product from cart
deleteCartProducts(id:any){
 return this.http.delete(`${this.BASE_URL}/carts/delete-cart-product/${id}`)

}
//increment cart product
incrementProduct(id:any){
  return this.http.get(`${this.BASE_URL}/cart/increment-product/${id}`)
}

//decrement cart product
decrementProduct(id:any){
  return this.http.get(`${this.BASE_URL}/cart/decrement-product/${id}`)
}
}
