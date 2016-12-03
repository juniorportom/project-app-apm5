import { Component } from '@angular/core';
import { Product } from '../../model/product';
import { NavController, NavParams } from 'ionic-angular';
import { ProductService } from "../../providers/product-service";
import { ProductList} from '../product-list/product-list';
/*
  Generated class for the ProductDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
  providers: [ProductService]
})
export class ProductDetail {
 	product: Product;
  	constructor(public navCtrl: NavController, public productService: ProductService, public navParams: NavParams) {}

  	getDetailProduct() {
            let id = this.navParams.get('id');
            this.productService.getProduct(id)
            .subscribe(product => this.product = product);
        
    }

  	ionViewDidLoad() {
    	console.log('Hello ProductDetailPage Page');
    	this.getDetailProduct(); 
  	}

  	save(): void {
        /*this.productService.update(this.product)
            .subscribe(
                response => {console.log(response); this.navCtrl.push(ProductListPage)},
                err => { console.log(err)});*/
    }

    delete(): void {
        /*this.productService.delete(this.product)
        .subscribe(
                response => {console.log(response); this.navCtrl.push(ProductListPage)},
                err => { console.log(err)}); */          
    }

}
