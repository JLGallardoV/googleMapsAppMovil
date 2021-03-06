//VARIABLE GLOBALES
var map; //representa el mapa
var arregloMarkers = []; //almacena los markers de esta practica
var marker;
var id = 0; //representa un id autoincrementable para cada marker
var pos;//representa la posición actual
var arregloPuntos = [];

//INICIO - FUNCION PARA INICIALIZAR EL MAPA
function initMap() {
  console.log("maps2");
  /*declaramos varibales globales ya que por el tiempo en que se ejecuta la app en angular si añadimos variables globales,
  estas pasan indefinidas por tal motivo las pongo en las funciones para asegurarnos de que los elementos ligados a las variables existen*/
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  var inputOrigen = document.getElementById('idOrigen');//representa la ruta x
  var inputDestino = document.getElementById('idDestino');//representa la ruta y
  var selectTransporte = document.getElementById('mode'); //representa el medio de transaporte

  miUbicacion = {
    lat: 21.113413539067853,
    lng: -101.65079098934316
  } //objeto para especificar mi ubicacion
  //manipulacion del DOM para mostrar el mapa
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15, //nivel de zoom
    center: miUbicacion
  });

  obtenerCoordenadas();

  //agregando marker cuando se inicia el mapa (invocando funcion)
  addMarker(miUbicacion, map);
  //autocompletando inputs (invocando funcion)
  autocompletarInputs();
  //en su momento permite que se muestre la ruta entre el punto a y el punto b
  directionsRenderer.setMap(map);

  //FUNCION PARA DETECTAR Y MANIPULAR LOS CAMBIOS HECHOS POR LA FUNCION INVOCADA EN LOS INPUTS
  var onChangeHandler = function() {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  }

  //invocamos la funcion onChangeHandler al momento de detectar un cambio en los inputs
  inputOrigen.addEventListener('change', onChangeHandler);
  inputDestino.addEventListener('change', onChangeHandler);
  selectTransporte.addEventListener('change', onChangeHandler);


  //esta funcionalidad ejecuta una accion  una vez el usuario clickea el mapa
  /*google.maps.event.addListener(map, 'click', function(event) {
    addMarker(event.latLng, map); //invocamos la funcion de agregar marker
  });*/





  }//FIN - FUNCION PARA INICIALIZAR EL MAPA


  //FUNCION PARA AGREGAR MARCADORES AL MAPA
  function addMarker(location, map) {
    id++;
    var icono ='../assets/icon/carIcon.svg';
    marker = new google.maps.Marker({
      id: id,
      position: location, //posicion del marker
      map: map, //en el mapa en uso
      //animation: google.maps.Animation.DROP,
      draggable: true,
      icon:icono
    });
    arregloMarkers.push(marker); //agregamos los markers a un arreglo para poder manipularlos posteriormente
    console.log("longitud del arreglo contenedor de markers: ", arregloMarkers.length);
  }


  //FUNCION PARA AUTOCOMPLETAR LOS INPUTS
  function autocompletarInputs(){
    //origen
    var autocompleteOrigen = new google.maps.places.Autocomplete(document.getElementById('idOrigen'));
    autocompleteOrigen.bindTo('bounds', map); //restringe los resultados, los hace mas locales
    autocompleteOrigen.setFields(['address_components', 'geometry', 'icon', 'name']);//establece los campos que se van a ver en los detalles del lugar

    //destino
    var autocompleteDestino = new google.maps.places.Autocomplete(document.getElementById('idDestino'));
    autocompleteDestino.bindTo('bounds', map);//restringe los resultados, los hace mas locales
    autocompleteDestino.setFields(['address_components', 'geometry', 'icon', 'name']);//establece los campos que se van a ver en los detalles del lugar
  }


  //FUNCION PARA TRAZAR UNA RUTA SEGUN UN PUNTO x Y UN PUNTO y
  function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    /*declaramos varibales globales ya que por el tiempo en que se ejecuta la app en angular si añadimos variables globales,
    estas pasan indefinidas por tal motivo las pongo en las funciones para asegurarnos de que los elementos ligados a las variables existen*/
    var inputOrigen = document.getElementById('idOrigen');//representa la ruta x
    var inputDestino = document.getElementById('idDestino');//representa la ruta y
    var selectTransporte = document.getElementById('mode'); //representa el medio de transaporte

    /*con este condicional evitaremos que cuando se ejecute esta funcion mande
    un input sin valor y mande un error en la consola por localizacion no especificada */
    if (inputOrigen.value == "" || inputDestino.value == "") {
      console.log("No todos los inputs estan llenos");
      return;
    }

    directionsService.route(
      {
        //recibimos las propiedades necesarias para que pueda trazar la ruta
        origin: {query: inputOrigen.value},
        destination: {query: inputDestino.value},
        travelMode: selectTransporte.value
      },
      (response, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
        } else {
          window.alert('No se pudo generar la ruta: ' + status);
        }
      });
    }

    //FUNCION PARA MOSTRAR UN CUADRADO CON EL OBJETIVO DE SELECCIONAR UN AREA DEL MAPA
    function seleccionarUbicacion(){
      if (navigator.geolocation) {
        /*obtenemos nuestra ubicacion mediante la API de maps
        y almacenamos la actual posicion en el objeto pos*/
        navigator.geolocation.getCurrentPosition(function(position) {
          pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(pos);//centramos el mapa en la actual posicion
          //limites del area del cuadrado
          var bounds = new google.maps.LatLngBounds(pos); //usamos la clase LatLngBounds y pasamos como parametro en su constructor nuestra posicion para poder ubicar el cuadrado en nuestra posicion
          console.log("contenido de bounds: ",bounds);
          //creamos el cuadrado
          var rectangle = new google.maps.Rectangle({
            bounds: {
              north: bounds.Ya.i, //accedemos a las propiedades que contienen coordenadas
              south:bounds.Ya.g + .01, //sumamos una centesima al sur para alargar el cuadrado y tenga forma
              east:bounds.Ta.i + .01, //sumamos una centesima al este para alargar el cuadrado y tenga forma
              west:bounds.Ta.g
            },
            editable: true,
            draggable: true
          });
          //pintamos el cuadrado en el mapa
          rectangle.setMap(map);
        });
      }else {
        alert("tu navegador no soporta geolocalizacion");
      }
    }


    //FUNCION PARA ACTIVAMOS GEOLOCALIZACION EN EL NAVEGADOR
    function activarGeolocalizacion(){
      if (navigator.geolocation) {
        /*obtenemos nuestra ubicacion mediante la API de maps
        y almacenamos la actual posicion en el objeto pos*/
        navigator.geolocation.getCurrentPosition(function(position) {
          console.log("activando geolocalizacion: ",position);
          pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(pos);//centramos el mapa en la actual posicion
        });
      }else {
        alert("tu navegador no soporta geolocalizacion");
      }
    }


    //FUNCION PARA REMOVER MARKERS
    function removerUltimoMarker(){
      arregloMarkers[arregloMarkers.length-1].setMap(null); //ocultamos del mapa el ultimo marker generado
      arregloMarkers.pop(); //extraemos mediante un pop el ultimo elemento del arreglo
    }


    //TRAZAR RUTA SEGUN COORDENADAS PROVENIENTES DESDE UN SERVIDOR EXTERNO
    function obtenerCoordenadas(){
      let variableControl=0; //con esta variable de control nos aseguramos que la ejecucion del setinterval tenga un limite (valor centinela)

      //comienzo de setinterval
      let coordenadas = setInterval(()=>{
        fetch('http://67.205.172.53:4000/getLastCoord/1')
        .then(function(response) {
          return response.json();
        })
        .then(function(myJson) {
          arregloPuntos.push({lat:myJson.data[0].lat,lng:myJson.data[0].lng}); //almacenamos cada coordenada en un arreglo global
          for (var i = 0; i < arregloPuntos.length; i++) {
            if (arregloPuntos[i]!=arregloPuntos[i-1]) {
              var flightPath = new google.maps.Polyline({
                path: arregloPuntos,
                geodesic: true,
                strokeColor: '#3880ff',
                strokeOpacity: 1.0,
                strokeWeight: 2
              });
              flightPath.setMap(map);
              removerUltimoMarker();
              addMarker(arregloPuntos[i], map);
              map.setCenter(arregloPuntos[i]);
            }else {
              console.log("estas en el mismo lugar");
            }
          }
        });
        variableControl++;
        console.log("tu vehiculo avanzo: "+variableControl+" vez(ces)");
        if (variableControl==30) {
          //una vez se llega a 30 ejecuciones del setinterval para con este; nota: son 30 coordenas las que recibo por eso manejo unicamente 30
          clearInterval(coordenadas);
        }
      },1000);

    }
