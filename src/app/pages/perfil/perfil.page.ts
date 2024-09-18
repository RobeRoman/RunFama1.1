import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service'; // Ajusta la ruta según tu estructura

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any = {
    nombre: '',
    correo: '',
    rut: ''
  };

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.cargarUsuario();
  }

  cargarUsuario() {
    const usuarioAutenticado = this.usuarioService.getUsuarioAutenticado();
    if (usuarioAutenticado) {
      this.usuario = usuarioAutenticado;
      if (this.usuario.foto_perfil && this.usuario.foto_perfil instanceof File) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.usuario.foto_perfil = e.target.result;
        };
        reader.readAsDataURL(this.usuario.foto_perfil);
      }
      console.log('Usuario cargado:', this.usuario);
    }
  }
}