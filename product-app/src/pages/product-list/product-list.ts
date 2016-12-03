import { Component } from '@angular/core';
import { Product } from '../../model/product';
import { ProductService } from "../../providers/product-service";
import { NavController } from 'ionic-angular';
import { ProductDetail } from '../product-detail/product-detail';

/*
  Generated class for the ProductList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-product-list',
  templateUrl: 'product-list.html',
  providers: [ProductService]
})
export class ProductList {

	selected: Product;
    products: Product[];
  	constructor(public navCtrl: NavController, public productService: ProductService) {}

  	ionViewDidLoad() {
    	console.log('Hello ProductList Page');
    	this.getProducts();
  	}

  	getProducts() {
        this.productService.getProducts()
            .subscribe(
            products => {
                this.products = products;
            },

            error => {
                console.log(error);
            }
        );
    }

    onSelect(product: Product){
        this.selected = product;
        this.navCtrl.push(ProductDetail, {
            id: product.id
          });
    }

}
