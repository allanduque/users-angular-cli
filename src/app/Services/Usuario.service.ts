import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {SuccessResponse} from '../models/SucessResponse';
import { Observable, of, pluck, take } from 'rxjs';
import { User } from '../models/User';

const httpOptions = {
  headers: new HttpHeaders({
  'Content-Type':  'application/json',
  accept: '*/*'
})
};

@Injectable({
  providedIn: 'root'
})


export class UsuarioService {
  
constructor(private http:HttpClient) {
  
}

  public BuscarUsuarios(): Observable<User[]>{
    return this.http.get<User[]>(`${environment.BaseUrl}/Usuario/BuscarTodosUsuarios`);
  }

  public CadastrarUsuario(user: User): Observable<any>{
    console.log('post:')
    console.log(user)
    return this.http.post(`${environment.BaseUrl}/Usuario/CadastrarUsuario`, user);
  }

}
