import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email:String ="";
  password:String ="";

  constructor(private router: Router) { }

  ngOnInit() {
  }
  

  login(){
    if(this.email=="admin@gmail.com" && this.password=="123"){
      this.router.navigate(['/home'])
    }else{
      alert("TA MALO")
    }
  }
}
