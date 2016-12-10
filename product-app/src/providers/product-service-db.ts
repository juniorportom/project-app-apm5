import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';
import {Product} from '../model/product';
/*
  Generated class for the ProductServiceDb provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProductServiceDb {

  db: SQLite;
  constructor() {
  	this.db = new SQLite();
  }

  openDatabase(){
    return this.db.openDatabase({
      name: 'data.db',
      location: 'default'
    });
  }

  createTable(){
    let sql = 'CREATE TABLE IF NOT EXISTS product(' +
        '_id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        'id INTEGER , ' +
        'name TEXT, ' +
        'type TEXT, ' + m 
        'quantity INTEGER, ' +
        'price INTEGER, ' +
        'latitude INTEGER, ' +
        'longitude INTEGER, ' +
        'sync INTEGER)';
    return this.db.executeSql(sql, []);
  }

  getAll(){
    let query = 'SELECT * FROM product;';
    return this.db.executeSql(query, [])
      .then(response => {
        let products = [];
        for (let index = 0; index < response.rows.length; index++) {
          products.push(response.rows.item(index));
        }
        return Promise.resolve(products);
      })
  }

  create(product: Product){
    let query = 'INSERT INTO product(id, name, type, quantity, price, latitude, longitude, sync) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
    return this.db.executeSql(query, [product.id, product.name, product.type, product.quantity, product.price, product.latitude, product.longitude, product.sync]);
  }

  update(product: any){
    let query = 'UPDATE product SET ' +
    'id = ?, ' +
	'name = ?, ' +
	'type = ?, ' +
	'quantity = ?, ' +
	'price = ?, ' +
	'latitude = ?,' +
	'longitude = ?, ' +
	'sync = ? ' +
    'WHERE id_PRODUCT=?';
    return this.db.executeSql(query, [product.id, product.name, product.type, product.quantity, product.price, product.latitude, product.longitude, product.sync, product.idProduct]);
  }


  getUser(id:number){
  	console.log('nombre en el query antes: ' + id );
    let query = 'SELECT * FROM user where id = ?;';

    return this.db.executeSql(query, [id]).then(user => {
    	console.log('nombre en el query: ' + user );
    	return Promise.resolve(user.rows.item(0));
    	})
  }

  create1(user: User){
    let query = 'INSERT INTO user(name, phone, email) VALUES(?,?,?)';
    return this.db.executeSql(query, [user.firstname, user.phone, user.email]);
  }

  update1(user: User){
    let query = 'UPDATE user SET name=?,' +
    'phone=?,' +
    'email=?' +
    'WHERE id=?';
    return this.db.executeSql(query, [user.firstname, user.phone, user.email ,user.id]);
  }

  delete(user: User){
    let query = 'DELETE FROM user where id = ?;';
    return this.db.executeSql(query, [user.id]);
  }







}
