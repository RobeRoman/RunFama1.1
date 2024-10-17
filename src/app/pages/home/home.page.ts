import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service'; // Asegúrate de que esté bien importado

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  usuarioAutenticado: any;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    // Obtener el usuario autenticado al inicializar la página
    this.usuarioAutenticado = this.usuarioService.getUsuarioAutenticado();
  }
}
