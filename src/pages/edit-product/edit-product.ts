import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {ProductService} from "../../providers/product-service";
import { Product } from '../../model/product';
import {ProductDetail} from '../product-detail/product-detail';
import {CustomValidators} from '../../validators/custom-validator';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Storage } from '@ionic/storage';
import {ProductServiceDb} from '../../providers/product-service-db';


/*
  Generated class for the EditProduct page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-edit-product',
  templateUrl: 'edit-product.html'
})
export class EditProduct {
	product: Product = new Product();
  productForm: FormGroup;
  id: any;

  constructor(public navCtrl: NavController, private productService: ProductService, private param: NavParams, public alertCtrl: AlertController, 
    public formBuilder: FormBuilder, public storage: Storage, private productServiceDb: ProductServiceDb) {
    this.id = this.param.get('id');
    this.productForm = this.createProductForm();
  }

  ionViewDidLoad() {
    console.log('Hello EditProductPage Page');
   
  }  
  
  ngOnInit()
  {
    this.storage.get("id").then(id => {
      this.productService.getProduct(this.id).subscribe(product=>{this.product=product;
      this.productForm = this.formBuilder.group({
      name: [this.product.name, [Validators.required, Validators.minLength(4)]],
      type: [this.product.type, [Validators.required, Validators.minLength(6)]],
      price: [this.product.price, [Validators.required, Validators.minLength(5)]],
      quantity: [this.product.quantity, [Validators.required, Validators.minLength(1)]],
      latitude: [this.product.latitude, [Validators.required]],
      longitude: [this.product.longitude, [Validators.required]]
    });
      }),
                error => {

                console.log(error);
      }
    });

  }


   public createProductForm() {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      type: ['', [Validators.required, Validators.minLength(6)]],
      price: ['', [Validators.required, Validators.minLength(5)]],
      quantity: ['', [Validators.required, Validators.minLength(1)]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]]
    });
  }

  save(): void {
      let prompt = this.alertCtrl.create({
      title: 'Confirmar Actualización',
      message: "Desea actualizar este producto?",
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Acceptar',
          handler: data => {
            this.product.name = this.productForm.value.name;
            this.product.type = this.productForm.value.type;
            this.product.price = this.productForm.value.price;
            this.product.quantity = this.productForm.value.quantity;
            this.product.latitude = this.productForm.value.latitude;
            this.product.longitude = this.productForm.value.longitude;
            this.productService.update(this.product)
            .subscribe(
                response => {console.log(response);
                  this.productServiceDb.update(this.product)
                  .then(productDb => {
                      this.navCtrl.push(ProductDetail, {id: this.product.id});
                      });
                },
                err => { console.log(err)});
            console.log('Accept clicked');
          }

        }

      ]
    });
    prompt.present();        

    }

}
