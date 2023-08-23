function ocultaLeyenda() {
  var x = document.getElementById("state-legend");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

mapboxgl.accessToken = 'pk.eyJ1IjoiaWduYWNpb2FiZSIsImEiOiJsTDV0dWFJIn0.Og513NMky_08_sXUUDsrbA';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/ignacioabe/cl7hqbqis002z15s0yv5kfp5w', // style URL
  center: [-72.463968, -36.745947], // starting position
  zoom: 13 // starting zoom
});


//controles

// zoom y rotación
map.addControl(new mapboxgl.NavigationControl(), "top-left");

//pantalla completa
map.addControl(new mapboxgl.FullscreenControl(), "top-left");

//geolocalización
let geoloc = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
});

map.addControl(geoloc, "top-left");

//capas externas
map.on("load", () => {

  //añade fuente tramos
  map.addSource("tramos", {
    "type": "vector",
    "url": "mapbox://ignacioabe.56fatb0i"
  })


  // añade capa tramos
  map.addLayer({
    "id": "quilln-parcial-2m7l0n",
    "type": "line",
    "source": "tramos",
    "source-layer": "quilln-parcial-2m7l0n",
    "filter": ["match", ["get", "_inválida"], ["1"], false, true],
    "layout": { "line-cap": "square", "line-join": "round" },
    "paint": {
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        12,
        2,
        15,
        5
      ],
      "line-opacity": 0.75,
      "line-color": "#F44336",
    }
  });

  map.on('click', 'quilln-parcial-2m7l0n', (e) => {
    let nombre = e.features[0].properties.NOMBRE;
    let longitud = e.features[0].properties.KM;
    let direccionalidad = e.features[0].properties._tipo;
    let emplazamiento = e.features[0].properties._emplazamiento;
    let ancho = e.features[0].properties._ancho_cm;
    let comuna = e.features[0].properties.COMUNA;
    let videoID = e.features[0].properties.video_id;
    let estado_señalética = e.features[0].properties._señalética_estado;
    
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setMaxWidth("300px")
      .setHTML(`
      <strong>EJE: ${nombre}</strong>
      <p>
      COMUNA: ${comuna}<br>
      LONGITUD (km): ${longitud}<br>
      DIRECCIONALIDAD: ${direccionalidad}<br>
      EMPLAZAMIENTO: ${emplazamiento}<br>
      ANCHO (cm): ${ancho}<br>
      ESTADO SEÑALÉTICA: ${estado_señalética}<br>
      <div class="contenedor-youtube"
      allowfullscreen>
        <iframe id="ytplayer" type="text/html" width="100%" height="100%"
        src="https://www.youtube.com/embed/${videoID}?autoplay=0&origin=https://pedaleable.github.io/"
        frameborder="0"
        allowfullscreen
        />
      </div>
      </p>
      `
      )
      .addTo(map);
  });

  // Change the cursor to a pointer when
  // the mouse is over the states layer.
  map.on('mouseenter', 'quilln-parcial-2m7l0n', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change the cursor back to a pointer
  // when it leaves the states layer.
  map.on('mouseleave', 'quilln-parcial-2m7l0n', () => {
    map.getCanvas().style.cursor = '';
  });

colorSimple()

});


function colorSimple() {
  map.setPaintProperty('quilln-parcial-2m7l0n', 'line-color', "#EF6C00");

  let leyendaSimple = `
  <h5>SIMPLE</h5>
  <div><span style='background-color: #EF6C00'></span>ciclovías</div>
  `

  //cambia contenido de leyenda
  document.getElementById("leyenda-contenidos").innerHTML = leyendaSimple;
};


function colorNorma() {
  map.setPaintProperty('quilln-parcial-2m7l0n', 'line-color',
    [
      "match",
      ["get", "_eval_graduada_pedal_clasif"],
      ["buena"],
      "#8BC34A",
      ["regular"],
      "#ffeb3b",
      ["mala"],
      "#ff9800",
      ["muy mala"],
      "#F44336",
      "#000000"
    ]
  );

  let leyendaNormas = `
  <h5>CUMPLIMIENTO NORMAS DE DISEÑO</h5>
  <div><span style='background-color: #8BC34A'></span>alto</div>
  <div><span style='background-color: #ffeb3b'></span>medio</div>
  <div><span style='background-color: #ff9800'></span>bajo</div>
  <div><span style='background-color: #F44336'></span>muy bajo</div>
  `

  //cambia contenido de leyenda
  document.getElementById("leyenda-contenidos").innerHTML = leyendaNormas;

};

function colorEmplazamiento() {
  map.setPaintProperty('quilln-parcial-2m7l0n', 'line-color',
    [
      "match",
      ["get", "_emplazamiento"],
      ["calzada"],
      "#29B6F6",
      ["parque"],
      "#9CCC65",
      "#EF5350"
    ]
  );

  let leyendaEmplazamiento = `
  <h5>EMPLAZAMIENTO</h5>
  <div><span style='background-color: #29B6F6'></span>por la calle</div>
  <div><span style='background-color: #9CCC65'></span>por un parque</div>
  <div><span style='background-color: #EF5350'></span>por la acera u otro lugar</div>
  `

  //cambia contenido de leyenda
  document.getElementById("leyenda-contenidos").innerHTML = leyendaEmplazamiento;
};

document.getElementById("selector").onchange = changeListener;
 
function changeListener(){
var value = this.value
  console.log(value);
  
  if (value == "simple"){
    // document.body.style.background = "red";
    colorSimple()
  }else if (value == "normas"){
    // document.body.style.background = "red";
    colorNorma()
  }else if (value == "emplazamiento"){
    // document.body.style.background = "blue";
    colorEmplazamiento()
  }
}
