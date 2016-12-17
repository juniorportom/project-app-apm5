import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import {OptionsPage} from '../pages/options/options';
import {Home} from '../pages/home/home';
import {ProfileDetail} from '../pages/profile-detail/profile-detail';
import {ProductServiceDb} from '../providers/product-service-db';
import {UserServiceDb} from '../providers/user-service-db';
import {ProductService} from '../providers/product-service';
import {UserService} from '../providers/user-service';
import {Product} from '../model/product';
import {User} from '../model/user';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;
  products:Product[];
  productsDb:Product[];
  users: User[];
  usersDb: User[];
  productAux: Product;
  userAux: User;


  constructor(public platform: Platform, public storage: Storage, private productServiceDb: ProductServiceDb, private userServiceDb: UserServiceDb, private productService: ProductService, private userService: UserService) {
    //this.sessionActive();
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Page One', component: Page1 },
      { title: 'Page Two', component: Page2 },
      //{ title: 'Opciones', component: OptionsPage },
      { title: 'Home', component: Home },
      { title: 'User Profile', component: ProfileDetail }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
       this.productServiceDb.openDatabase()
        .then(() => this.productServiceDb.createTable())
        .then(() => this.userServiceDb.openDatabase())
        .then(() => this.userServiceDb.createTable())
        .then(()=> {
          this.sessionActive();
          this.fillDataBase();
        })
    });
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  sessionActive(){
    this.storage.get("cookie").then(cookie => {
      console.log('cookie: ' + cookie);       
      if(cookie != null && cookie != ''){
        this.rootPage = Home;
      }else{
        this.rootPage = OptionsPage;
      }
    });
  }

  fillDataBase(){
      this.productService.getProducts()
            .subscribe(
            products => {
                this.products = products;
                console.log('products: '+ this.products);
                this.productServiceDb.getAll()
                .then(productsDb =>(this.productsDb = productsDb))
                .then(value => {
                      console.log('lengt prod: '+ this.productsDb.length);
                      if(this.productsDb.length === 0){
                        this.insertProductsRowsEmpty();
                      }else{
                        this.insertProductsRows();
                      } 
                      this.syncProducts();                    
                    }
                  )
            },
            error => {
                console.log('error fillDataBase: '+error);
            }
        );

       this.userService.getUsers()
            .subscribe(
            users => {
                this.users = users;
                this.userServiceDb.getAll()
                .then(usersDb =>(this.usersDb = usersDb))
                .then(value => {                      
                      if(this.usersDb.length === 0){
                        this.insertUsersRowsEmpty();
                      }else{
                        this.insertUsersRows();
                      }
                      this.syncUsers();
                    }
                  )
            },
            error => {
                console.log(error);
            }
        );
     }

     insertProductsRowsEmpty()
     {
       console.log('insertProductsRowsEmpty');
       for(let i = 0; i < this.products.length ; i++ ){
         this.productAux = this.products[i];
         this.productAux.sync = true;
         this.productServiceDb.create(this.productAux);
       }
     }


     insertUsersRowsEmpty()
     {
       for(let i = 0; i < this.users.length ; i++ ){
         this.userAux = this.users[i];
         this.userAux.sync = true;
         this.userServiceDb.create(this.userAux);
       }
     }

     insertProductsRows(){
       console.log('insertProductsRows');
       for(let i = 0; this.products.length; i++){
         let isInList = false;
         for(let j = 0; this.productsDb.length; j++){
           if(this.products[i].id == this.productsDb[j].id){
             isInList = true;
             j = this.productsDb.length;
           }
         }
         if(!isInList){
           this.productAux = this.products[i];
           this.productAux.sync = true;
           this.productServiceDb.create(this.productAux);
         }
       }
     }

     insertUsersRows(){
       for(let i = 0; this.users.length; i++){
         let isInList = false;
         for(let j = 0; this.usersDb.length; j++){
           if(this.users[i].id == this.usersDb[j].id){
             isInList = true;
             j = this.usersDb.length;
           }
         }
         if(!isInList){
           this.userAux = this.users[i];
           this.userAux.sync = true;
           this.userServiceDb.create(this.userAux);
         }
       }
     }

     syncProducts(){
       console.log('syncProducts');
       this.productServiceDb.getSyncRows()
            .then(producs => {
                this.products = producs;
            }); 

            for(let i = 0; i < this.products.length; i++){
              this.productService.create(this.products[i])
                .subscribe(product => {
                this.productAux = product;
                this.productAux.sync = true;
                this.productAux._id = this.products[i]._id;
                this.productServiceDb.update(this.productAux);
            });
        }            
     }

     syncUsers(){
       this.userServiceDb.getSyncRows()
            .then(users => {
                this.users = users;
            }); 

            for(let i = 0; i < this.users.length; i++){
              this.userService.create(this.users[i])
                .subscribe(user => {
                this.userAux = user;
                this.userAux.sync = true;
                this.userAux._id = this.users[i]._id;
                this.userServiceDb.update(this.userAux);
            });
        }            
     }  
}


