import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';
import {User} from '../model/user';

/*
  Generated class for the UserServiceDb provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserServiceDb {

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
    let sql = 'CREATE TABLE IF NOT EXISTS user(' +
        '_id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        'id INTEGER, ' +
        'email TEXT unique, ' +
        'password TEXT, ' +
        'firstname TEXT, ' +
        'lastname TEXT, ' +
        'phone INTEGER, ' +
        'sync INTEGER);';
    return this.db.executeSql(sql, []);
  }

  getAll(){
    let query = 'SELECT * FROM user order by id asc;';
    return this.db.executeSql(query, [])
      .then(response => {
        let users = [];
        for (let index = 0; index < response.rows.length; index++) {
          users.push(response.rows.item(index));
        }
        return Promise.resolve(users);
      })
  }

  getUser(email:string){
    let query = 'SELECT * FROM user where email = ?;';
    return this.db.executeSql(query, [email]).then(user => {
    	console.log('nombre en el query: ' + user );
    	return Promise.resolve(user.rows.item(0));
    	})
  }

  create(user: User){
    let query = 'INSERT INTO user(id, email, password, firstname, lastname, phone, sync) VALUES(?,?,?,?,?,?,?);';
    return this.db.executeSql(query, [user.id, user.email, user.password, user.firstname, user.lastname,
                    user.phone, user.sync]);
  }

  update(user: User){
    let query = 'UPDATE user SET ' +
    'id=?, ' +
    'email=?, ' +
    'password=?, ' +
    'firstname=?, ' +
    'lastname=?, ' +
    'phone=?, ' +
    'sync=?' +
    'WHERE _id=?';
    return this.db.executeSql(query, [user.id, user.email, user.password, user.firstname, user.lastname,
                    user.phone, user.sync, user._id]);
  }

  delete(user: User){
    let query = 'DELETE FROM user where id = ?;';
    return this.db.executeSql(query, [user.id]);
  }

  getSyncRows(){
    let query = 'SELECT * FROM user where sync = 0;';
    return this.db.executeSql(query, [])
      .then(response => {
        let users = [];
        for (let index = 0; index < response.rows.length; index++) {
          users.push(response.rows.item(index));
        }
        return Promise.resolve(users);
      })
  }

}
