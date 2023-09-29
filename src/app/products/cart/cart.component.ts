import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {


 //paypal variable
  public payPalConfig?: IPayPalConfig;

  showSuccess:boolean=false;

  showpaypalButton:boolean=false;
  
  cartTotalPrice=0;
  allCart:any=[]// to hold cart projects
  name:string='';
  houseNumber:string='';
  streetName:string='';
  state:string='';
  pincode:string='';
  mobileNumber:string='';



  
  proceedToPaymentStatus :boolean=false;//used to hide address from
  offerClick:boolean=false;// used to show offers
  discountStatus:boolean=false//used to hide discount status

  constructor(private api:ApiService,private cartfb:FormBuilder){}

  addressForm = this.cartfb.group({
    name:[''],
    houseNumber:[''],
    streetName:[''],
    state:[''],
    pincode:[''],
    mobileNumber:['']

  })
  submitForm(){
    if(this.addressForm.valid){
      this.proceedToPaymentStatus=true;
      this.name=this.addressForm.value.name||''
      this.houseNumber=this.addressForm.value.houseNumber||''
      this.streetName=this.addressForm.value.streetName||''
      this.state=this.addressForm.value.state||''
      this.pincode=this.addressForm.value.pincode||''
      this.mobileNumber=this.addressForm.value.mobileNumber||''
    }else{
      alert('please enter valid details')
    }
  }

  ngOnInit(): void {
    this.api.getCart().subscribe((result:any)=>{
      console.log(result);
      this.allCart=result
      this.getCartTotal()
      this.initConfig();//paypal function
    },
    (result:any)=>{
      console.log(result.error);
      
    }
    )
  }

  //delete item from cart
  deleteCartItem(id:any){
    this.api.deleteCartProducts(id).subscribe((result:any)=>{
     this.allCart=result
     this.api.cartCount()
     this.getCartTotal()
    
     alert('Product deleted from cart')
    },
    (result:any)=>{
      alert(result.error)
    }
    ) 
  }


  //get cart grand total
  getCartTotal(){
    let total=0;
    this.allCart.forEach((item:any)=>{
       total+=item.grandTotal
       this.cartTotalPrice=Math.ceil(total)
    })
  }

  //increment cart product
  incrementCartProduct(id:any){
    this.api.incrementProduct(id).subscribe((result:any)=>{
    this.allCart=result
    this.getCartTotal()
    },
    (result:any)=>{
      alert(result.error)
    }
    )
  }

  //decrement cart product
  decrementCartProduct(id:any){
    this.api.decrementProduct(id).subscribe((result:any)=>{
      this.allCart=result
      this.getCartTotal()
      this.api.cartCount()
    }
    ,
    (result:any)=>{
      alert(result.error)
    }
    )
  }
  offerClicked(){
   this.offerClick=true
  }
  discountCaculate(value:any){
    this.discountStatus=true;
    this.cartTotalPrice=this.cartTotalPrice*(100-value)/100
  }


  private initConfig(): void {
    this.payPalConfig = {
    currency: 'EUR',
    clientId: 'sb',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: '9.99',
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: '9.99'
              }
            }
          },
          items: [
            {
              name: 'Enterprise Subscription',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'EUR',
                value: '9.99',
              },
            }
          ]
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then((details:any) => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      this.showSuccess = true;
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
    },
    onError: err => {
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }

  makePay(){
    this.showpaypalButton=true;
  }
}
