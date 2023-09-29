import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit{

  allWishlist:any=[]
  constructor(private api:ApiService){}
  ngOnInit(): void {
    this.api.viewWishlist().subscribe((result:any)=>{
      console.log(result);
      this.allWishlist=result
    },
    (result:any)=>{
      console.log(result.error);
      
    }
    )
  }

  //delete wishlist item from wishlist
  deleteWishlistItem(id:any){
    this.api.deleteWishlistProducts(id).subscribe((result:any)=>{
      this.allWishlist=result //remaing product in the wishlist after deleting
      alert('Product removed successfully')
    })
  }


}
