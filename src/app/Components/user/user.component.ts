import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { UsuarioService } from 'src/app/Services/Usuario.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public modo = 'listar';
  public Users: User[] = [];
  public title: string ='Cadastro de Usuários';
  public form!: FormGroup;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {
    this.Validacoes();
  }
  
  Validacoes(){
    this.form = this.fb.group({
      nome: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required,
      ])],
      sobrenome: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required,
      ])],
      email: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(60),
        Validators.email,
        Validators.required,
      ])],
      dataNascimento: ['',Validators.compose([
        Validators.required,
        this.validaData,
        Validators.minLength(8)])],
      escolaridade: ['', Validators.required],
    })
  }
  
  ngOnInit() {
    this.BuscarUsuariosCadastrados();
  }

  BuscarUsuariosCadastrados(){
    this.usuarioService.BuscarUsuarios().subscribe({
      next: (event) => {
        this.Users = event as User[];
      },
      error: (err) => {
        console.log(err);
      }
    })
    console.log('Usuarios buscados!')
  }
  AdicionarMascaraData(data: string): string{
    let dt = data.substr(4,4) + '-' + data.substr(2,2) +'-'+ data.substr(0,2) 
    return dt
  }

  CadastrarUsuario(){
    let usuarioCadastrado = new User(this.Users.length+1,this.form.get('nome')?.value, this.form.get('sobrenome')?.value, this.form.get('email')?.value, this.AdicionarMascaraData(this.form.get('dataNascimento')?.value), this.form.get('escolaridade')?.value);
    
    this.usuarioService.CadastrarUsuario(usuarioCadastrado).subscribe(() =>
    {
      alert('Cadstrado com sucesso!');
    },
    () => {
      alert('Erro ao cadastrar!');
    });
    
    this.BuscarUsuariosCadastrados();
    this.AlterarModo('listar');
    this.limpar();
  }

  RemoverUsuario(user: User){
    const index = this.Users.indexOf(user);
    if(index !== -1){
      if(confirm("Deseja remover o usuário "+ user.nome)) {
        this.Users.splice(index, 1);
      }
    }    
  }

  validaData(input: FormControl){
    // Ex: 10/01/1985
    if(input.value=='' || input.value?.length < 8) return { obrigatoriedade: true}

    // Checks for dd/mm/yyyy format.
    var dtDay: number = +input.value?.substr(0, 2);
    var dtMonth: number = +input.value?.substr(2, 2);
    var dtYear: number = +input.value?.substr(4, 4);

    if (dtMonth < 1 || dtMonth > 12)
        return { obrigatoriedade: true};
    else if (dtDay < 1 || dtDay> 31)
        return { obrigatoriedade: true};
    else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
        return { obrigatoriedade: true};
    else if (dtMonth == 2)
    {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay> 29 || (dtDay ==29 && !isleap))
            return { obrigatoriedade: true};
    }

    if((new Date(dtYear+'-'+dtMonth+'-'+dtDay) > new Date(Date.now()))) return { obrigatoriedade: true};
    
    return null;
}


  limpar(){
    this.form.reset()
  }
  AtualizarUsuario(){
    
  }

  AlterarModo(modo: string){
    this.modo = modo;
  }

}
