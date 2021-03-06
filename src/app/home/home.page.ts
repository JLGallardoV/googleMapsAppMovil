import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}
  //ANEXAMOS UN SCRIPT MEDIANTE LA MANIPULACION DEL DOM DESDE TS (SCRIPT DINAMICO)
  public loadScript(url: string) {
    /*crearemos un script,en la constante script inicializamos sus propiedades
    y con la constante body la plasmamos en el dom*/
   const body = <HTMLDivElement> document.body;
   const script = document.createElement('script');
   script.innerHTML = ''; //establecemos sintaxis del html
   script.src = url; //direccion donde cargaremos la fuente del script
   script.async = true; //sin asincronia en la descarga con el html
   script.defer = true; //sin descarga en paralelo con el html
   body.appendChild(script); //añadimos el nodo
 }
 ngOnInit() {
   this.loadScript('../assets/js/maps.js');
   this.loadScript('https://maps.googleapis.com/maps/api/js?key=TU-API-KEY&libraries=places&callback=initMap&&sensor=true');
 }

}
