//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import gsap from 'https://cdn.skypack.dev/gsap';


// SETEADO INICIAL

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Construye el renderizador para que se vea la escena 3D
renderer.setSize(window.innerWidth, window.innerHeight); // se asigna el tamaño de la escena en el navegador
document.body.appendChild(renderer.domElement); // Se le avisa al DOM que renderice (? algo asi pero noo entendi
renderer.setClearColor(0xaaaaaa); // Color de fondo
renderer.shadowMap.enabled = true; // Habilitar sombras
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Tipo de sombreado (suave)

// Escena
const scene = new THREE.Scene(); // Se construye la escena donde se van a ver los obj 3D

// script.js
document.addEventListener("DOMContentLoaded", () => {
  const text =
    "Generar infografía sobre la Inteligencia Artificial Generativa Runway_"; // Cambia esto al texto que quieras mostrar
  const container = document.getElementById("texto-animado");
  let index = 0;

  // Función para escribir el texto letra por letra
  function typeText() {
    if (index < text.length) {
      container.textContent += text.charAt(index);
      index++;
      setTimeout(typeText, 50); // Ajusta el tiempo para la velocidad de escritura
    } else {
      // Añadir parpadeo al último dígito
      const lastChar = container.textContent.slice(-1);
      container.textContent = container.textContent.slice(0, -1); // Quitar último carácter
      const lastSpan = document.createElement("span");
      lastSpan.textContent = lastChar;
      lastSpan.className = "blink";
      container.appendChild(lastSpan);
    }
  }

  // Iniciar la animación al cargar la página
  typeText();
});

// Ocultar el modal al hacer clic en el botón "Ingresar"
const enterButton = document.getElementById("enter-button");
const welcomeModal = document.getElementById("welcome-modal");
enterButton.addEventListener("click", () => {
  // Agregar la clase de transición para ocultar el modal
  welcomeModal.classList.add("fade-out");

  // Esperar a que la transición termine antes de ocultar el modal
  setTimeout(() => {
    welcomeModal.style.display = "none";
  }, 900); // Debe coincidir con la duración de la transición en CSS
});

// Camara
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
); // Se construye la camara y se le asigna un ángulo de amplitud (45), donde se va a mostrar, y los valores de mínimo (0.1) y máx (1000) de distancia de rango para que muestre objetos 3D
camera.position.set(1, 18, 40); // Posición de la cámara (X, Y, Z)
camera.lookAt(0, 2, 0);

// const grid = new THREE.GridHelper(30,30); // Este objeto pone una grilla para orientarse
// scene.add(grid);

// CONFIGURACIONES QUE NO SON INDIPENSABLES, dan un renderizado realista
// renderer.outputEncoding = THREE.sRGBEncoding; // Codifica las texturas para que se vea mejor
// renderer.toneMapping = THREE.ACESFilmicToneMapping; // Le da un filtro cinematico o algo asi, hace un mapeado
// renderer.toneMappingExposure = 1;
// FIN CONFIGURACIONES EXTRA

// CARGA DE MODELOS 3D Y ARCHIVOS EXTERNOS ------------------>
// LO que está en la carpeta static forma parte de assets para el proyecto exportado, por eso la ruta de los archivos es diferente
//Keep the 3D object on a global variable so we can access it later
let object;

//Set which object to render
let objToRender = 'eye';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();
//Load the file
loader.load(
  `models/${objToRender}/taller.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    object.scale.set(1, 1, 1);
  object.position.set(1, -0.5, 8); // Ajusta la posición
  object.rotateY(-0.5);

    scene.add(object);    


  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.000006;  // Ajusta el valor para reducir la exposición global


movFinal();

// Orbit();
function Orbit() {
  // Orbit (interacción y movimiento del usuario)
  const orbit = new OrbitControls(camera, renderer.domElement); // El Orbit es el mecanismo para mover la escena con el click
  orbit.update(); // Actualizar la posicion del Orbit, es decir de la interacción para mover la escena
}

window.addEventListener("resize", function () {
  // Este Listener hace que si se redimensiona el navegador, se redimensiona el canvas
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Crea esferas en zonas y las hace invisibles para que funcionen como botones
const zones = [];
const zoneGeometry = new THREE.SphereGeometry(2, 32, 32);
const zoneMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  visible: false,
});
//BOTON 1
const zone1 = new THREE.Mesh(zoneGeometry, zoneMaterial);
zone1.position.set(-3.5, 3, 9.5); // Ajusta la posición
zone1.lookAtTarget = new THREE.Vector3(-8, 2, 4); // El punto al que la cámara debe mirar para esta zona
zone1.cameraPosition = new THREE.Vector3(0, 8, 18); // Posición personalizada para la cámara en zone1
scene.add(zone1);
zones.push(zone1);
//BOTON 2
const zone2 = new THREE.Mesh(zoneGeometry, zoneMaterial);
zone2.position.set(-1.5, 8, 5); // Ajusta la posición
zone2.lookAtTarget = new THREE.Vector3(-4, 7, -8.5); // El punto al que la cámara debe mirar para esta zona
zone2.cameraPosition = new THREE.Vector3(1, 12, 14); // Posición personalizada para la cámara en zone1
scene.add(zone2);
zones.push(zone2);
//BOTON 3
const zone3 = new THREE.Mesh(zoneGeometry, zoneMaterial);
zone3.position.set(3.5, 5, 7); // Ajusta la posición
zone3.lookAtTarget = new THREE.Vector3(14, 4, 2); // El punto al que la cámara debe mirar para esta zona
zone3.cameraPosition = new THREE.Vector3(-2, 11, 17); // Posición personalizada para la cámara en zone1
scene.add(zone3);
zones.push(zone3);

// El raycaster evalua el click y el hover
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function movFinal() {
  // Animar la cámara hacia la zona clickeada y mostrar botones adicionales
  let zoneButtons = []; // Para almacenar botones adicionales

  // Encuentra los elementos de imagen en el DOM
  const hoverImage1 = document.getElementById("hover-image-1");
  const hoverImage2 = document.getElementById("hover-image-2");
  const hoverImage3 = document.getElementById("hover-image-3");

  // Modifica la función handleMouseMove para manejar múltiples zonas
  function handleMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(zones, true);

    // Ocultar todas las imágenes por defecto
    hoverImage1.style.display = "none";
    hoverImage2.style.display = "none";
    hoverImage3.style.display = "none";

    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;

      // Mostrar la imagen correspondiente dependiendo de la zona
      if (hoveredObject === zone1) {
        hoverImage1.style.display = "block";
        hoverImage1.style.left = `${event.clientX + 10}px`;
        hoverImage1.style.top = `${event.clientY + 10}px`;
      } else if (hoveredObject === zone2) {
        hoverImage2.style.display = "block";
        hoverImage2.style.left = `${event.clientX + 10}px`;
        hoverImage2.style.top = `${event.clientY + 10}px`;
      } else if (hoveredObject === zone3) {
        hoverImage3.style.display = "block";
        hoverImage3.style.left = `${event.clientX + 10}px`;
        hoverImage3.style.top = `${event.clientY + 10}px`;
      }
    }
  }

  let ignoreNextReset = false;

  function handleMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(
      zones.concat(zoneButtons),
      true
    );

    console.log("Intersects:", intersects); // Depura los objetos detectados

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;

      if (zones.includes(clickedObject)) {
        moveToZone(clickedObject);
      } else if (zoneButtons.includes(clickedObject)) {
        moveToButton(clickedObject);
      }

      // Si se hizo clic en un botón, evitar el reseteo
      ignoreNextReset = true;
    } else {
      if (!ignoreNextReset) {
        resetCameraPosition();
      }
      ignoreNextReset = false;
    }
  }

  function onClick(event) {
    handleMouseClick(event);
  }

  function onMouseMove(event) {
    handleMouseMove(event);
  }

  function moveToZone(zone) {
    // Si el clic es sobre un zoneButton generado en zone2
    if (zoneButtons.includes(zone)) {
      // Usar las propiedades cameraPosition y lookAtTarget del botón
      const targetPosition = zone.cameraPosition;
      const targetLookAt = zone.lookAtTarget;

      // Obtener la posición y el lookAt actuales de la cámara
      const initialPosition = camera.position.clone();
      const initialLookAt = camera
        .getWorldDirection(new THREE.Vector3())
        .add(camera.position);

      gsap.to(initialPosition, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 2,
        ease: "power1.inOut",
        onUpdate: function () {
          // Actualizar la posición de la cámara
          camera.position.set(
            initialPosition.x,
            initialPosition.y,
            initialPosition.z
          );

          // Interpolar gradualmente el lookAt
          const lerpedLookAt = new THREE.Vector3().lerpVectors(
            initialLookAt,
            targetLookAt,
            this.progress()
          );
          camera.lookAt(lerpedLookAt); // Actualizamos el lookAt mientras la cámara se mueve
        },
        onComplete: () => {
          // Asegurarse de que la cámara mira exactamente al objetivo final
          camera.lookAt(targetLookAt);
        },
      });
    } else {
      // Lógica para las zonas principales (zone1, zone2, zone3)
      const targetPosition = zone.cameraPosition;
      const targetLookAt = zone.lookAtTarget;

      const initialPosition = camera.position.clone();
      const initialLookAt = camera
        .getWorldDirection(new THREE.Vector3())
        .add(camera.position);

      gsap.to(initialPosition, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 3,
        ease: "power1.inOut",
        onUpdate: function () {
          // Actualizar la posición de la cámara
          camera.position.set(
            initialPosition.x,
            initialPosition.y,
            initialPosition.z
          );

          // Interpolar gradualmente el lookAt
          const lerpedLookAt = new THREE.Vector3().lerpVectors(
            initialLookAt,
            targetLookAt,
            this.progress()
          );
          camera.lookAt(lerpedLookAt);
        },
        onComplete: () => {
          camera.lookAt(targetLookAt);
          createZoneButtons(zone); // Crear botones dentro de la zona, solo para zone2
        },
      });
    }
  }

  function moveToButton(zone) {
    // Actualiza la posición de la cámara
    gsap.to(camera.position, {
      x: zone.cameraPosition.x,
      y: zone.cameraPosition.y,
      z: zone.cameraPosition.z,
      duration: 2,
      onUpdate: () => {
        camera.lookAt(zone.lookAtTarget);
      },
    });

    createZoneButtons(zone);
  }

  function resetCameraPosition() {
    hideInfo(); // Ocultar la información si está visible
    clearZoneButtons(); // Eliminar botones dentro de la zona

    const initialPosition = camera.position.clone(); // Posición actual de la cámara
    const initialLookAt = camera
      .getWorldDirection(new THREE.Vector3())
      .add(camera.position); // Dirección actual de la cámara

    const targetPosition = new THREE.Vector3(1, 18, 40); // Posición inicial de la cámara
    const targetLookAt = new THREE.Vector3(0, 2, 0); // El punto inicial donde debe mirar la cámara

    gsap.to(initialPosition, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 2,
      ease: "power1.Out",
      onUpdate: function () {
        // Actualizar la posición de la cámara
        camera.position.set(
          initialPosition.x,
          initialPosition.y,
          initialPosition.z
        );

        // Interpolar el lookAt de forma progresiva
        const lerpedLookAt = new THREE.Vector3().lerpVectors(
          initialLookAt,
          targetLookAt,
          this.progress()
        );
        camera.lookAt(lerpedLookAt); // Actualizamos el lookAt mientras la cámara se mueve
      },
      onComplete: () => {
        // Al final del movimiento, asegurarse de que la cámara mira exactamente al centro
        camera.lookAt(targetLookAt);
      },
    });
  }

  

  // Variable global para almacenar el botón de imagen
  let imageButton = null;

  // Encuentra el nuevo modal y el botón de cierre
  const imageModal = document.getElementById("image-modal");
  const closeModalButton = document.getElementById("close-modal-button");

  // Función para mostrar el modal de imagen
  function showImageModal() {
    imageModal.style.display = "flex"; // Mostrar el modal
    // Detener la interacción con la escena 3D
    window.removeEventListener("click", handleMouseClick);
  }

  // Función para ocultar el modal de imagen
  function hideImageModal() {
    imageModal.style.display = "none"; // Ocultar el modal
    // Reanudar la interacción con la escena 3D
    window.addEventListener("click", handleMouseClick);
  }

  // Manejar el clic en el botón de cierre del modal
  closeModalButton.addEventListener("click", hideImageModal);


// Lista de imágenes
const images = [
  "../assets/prompt_1.png",
  "../assets/prompt_2.png",
  "../assets/prompt_3.png"
];
let currentImageIndex = 0;

// Encuentra el elemento de imagen en el modal
const modalImage = document.getElementById("modal-image");


// Función para mostrar la siguiente imagen
function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  modalImage.src = images[currentImageIndex];
}

// Manejar clics en los botones de cambio de imagen
document.getElementById("next-image-button").addEventListener("click", showNextImage);

  // Función para crear el botón-imagen en zone2
  function createImageButton() {
    if (!imageButton) {
      // Solo crea el botón si no existe
      imageButton = document.createElement("img");
      imageButton.src = "../assets/acceso_a_modal.png"; // Imagen del botón
      imageButton.style.position = "absolute";
      imageButton.style.cursor = "pointer";
      imageButton.style.zIndex = 2000; // Asegúrate de que esté sobre todo
      imageButton.style.left = "50%"; // Ajustar según sea necesario
      imageButton.style.top = "20%"; // Ajustar según sea necesario
      imageButton.style.transform = "translate(-50%, -50%)"; // Centrar la imagen
      document.body.appendChild(imageButton);

      // Agregar el manejador de clics para el botón-imagen
      imageButton.addEventListener("click", showImageModal);
    } else {
      imageButton.style.display = "block"; // Asegúrate de que el botón esté visible
    }
  }

  let button1 = null;

  function boton1() {
    if (!button1) {
      button1 = document.createElement("img");
      button1.src = "../assets/boton1-1.png"; // Imagen del botón para zone1
      button1.style.position = "absolute";
      button1.style.cursor = "pointer";
      button1.style.width = "70px";
      button1.style.zIndex = 2000; // Asegúrate de que esté sobre todo
      button1.style.left = "35%"; // Ajustar según sea necesario
      button1.style.top = "20%"; // Ajustar según sea necesario
      button1.style.transform = "translate(-50%, -50%)"; // Centrar la imagen
      button1.classList.add("zone-button"); // Añadir una clase para identificarlos
      document.body.appendChild(button1);

      // Agregar el manejador de clics para el botón
      button1.addEventListener("mouseover", () => {
        grafico1("modal-zone1-image.png"); // Mostrar la imagen correspondiente para zone1
        ignoreNextReset = true; // Evitar el reseteo de la cámara
      });

      // Agregar el manejador para cuando el mouse sale del botón
      button1.addEventListener("mouseout", () => {
        image.style.display = "none";
      });
    } else {
      button1.style.display = "block"; // Asegúrate de que el botón esté visible
    }
  }

  let image = null; // Mover la declaración de la imagen fuera de la función grafico1

  // Función para mostrar una imagen
  function grafico1(src) {
    if (!image) {
      image = document.createElement("img");
      image.src = "../assets/grafico1.png";
      image.style.position = "absolute";
      image.style.top = "20%";
      image.style.left = "20%";
      image.style.transform = "translate(-50%, -50%)";
      image.style.zIndex = 1000;
      image.style.maxWidth = "90%";
      image.style.maxHeight = "90%";
      image.style.cursor = "pointer";
      document.body.appendChild(image);

      image.addEventListener("click", () => {
        image.style.display = "none";
        ignoreNextReset = true; // Evitar el reseteo de la cámara
      });
    }
    image.style.display = "block";
  }

  let button2 = null;

  function boton2() {
    if (!button2) {
      button2 = document.createElement("img");
      button2.src = "../assets/boton1-2.png"; // Imagen del botón para zone1
      button2.style.position = "absolute";
      button2.style.cursor = "pointer";
      button2.style.width = "70px";
      button2.style.zIndex = 2000; // Asegúrate de que esté sobre todo
      button2.style.left = "30%"; // Ajustar según sea necesario
      button2.style.top = "60%"; // Ajustar según sea necesario
      button2.style.transform = "translate(-50%, -50%)"; // Centrar la imagen
      button2.classList.add("zone-button"); // Añadir una clase para identificarlos
      document.body.appendChild(button2);

      // Agregar el manejador de clics para el botón
      button2.addEventListener("mouseover", () => {
        grafico2("modal-zone2-image.png"); // Mostrar la imagen correspondiente para zone1
        ignoreNextReset = true; // Evitar el reseteo de la cámara
      });

      // Agregar el manejador para cuando el mouse sale del botón
      button2.addEventListener("mouseout", () => {
        console.log("aaaaaaaa");
        image2.style.display = "none";
      });
    } else {
      button2.style.display = "block"; // Asegúrate de que el botón esté visible
    }
  }

  let image2 = null;

  // Función para mostrar una imagen
  function grafico2(src) {
    if (!image2) {
      image2 = document.createElement("img");
      image2.src = "../assets/grafico2.png";
      image2.style.position = "absolute";
      image2.style.top = "60%";
      image2.style.left = "15%";
      image2.style.transform = "translate(-50%, -50%)";
      image2.style.zIndex = 999; // Un valor más bajo que el botón
      image2.style.maxWidth = "90%";
      image2.style.maxHeight = "90%";
      image2.style.cursor = "pointer";
      document.body.appendChild(image2);

      image2.addEventListener("click", () => {
        image2.style.display = "none";
        ignoreNextReset = true; // Evitar el reseteo de la cámara
      });
    }
    image2.style.display = "block";
  }

  let button3 = null;

  function boton3() {
    if (!button3) {
      button3 = document.createElement("img");
      button3.src = "../assets/boton3-1.png"; // Imagen del botón para zone1
      button3.style.position = "absolute";
      button3.style.cursor = "pointer";
      button3.style.width = "70px";
      button3.style.zIndex = 2000; // Asegúrate de que esté sobre todo
      button3.style.left = "60%"; // Ajustar según sea necesario
      button3.style.top = "20%"; // Ajustar según sea necesario
      button3.style.transform = "translate(-50%, -50%)"; // Centrar la imagen
      button3.classList.add("zone-button"); // Añadir una clase para identificarlos
      document.body.appendChild(button3);

      // Agregar el manejador de clics para el botón
      button3.addEventListener("mouseover", () => {
        grafico3("modal-zone1-image.png"); // Mostrar la imagen correspondiente para zone1
        ignoreNextReset = true; // Evitar el reseteo de la cámara
      });

      // Agregar el manejador para cuando el mouse sale del botón
      button3.addEventListener("mouseout", () => {
        image3.style.display = "none";
      });
    } else {
      button3.style.display = "block"; // Asegúrate de que el botón esté visible
    }
  }

  let image3 = null; // Mover la declaración de la imagen fuera de la función grafico1

  // Función para mostrar una imagen
  function grafico3(src) {
    if (!image3) {
      image3 = document.createElement("img");
      image3.src = "../assets/grafico3.png";
      image3.style.position = "absolute";
      image3.style.top = "20%";
      image3.style.left = "75%";
      image3.style.transform = "translate(-50%, -50%)";
      image3.style.zIndex = 1000;
      image3.style.maxWidth = "90%";
      image3.style.maxHeight = "90%";
      image3.style.cursor = "pointer";
      document.body.appendChild(image3);

      image3.addEventListener("click", () => {
        image3.style.display = "none";
        ignoreNextReset = true; // Evitar el reseteo de la cámara
      });
    }
    image3.style.display = "block";
  }

  
  let button4 = null;

  function boton4() {
    if (!button4) {
      button4 = document.createElement("img");
      button4.src = "../assets/boton3-2.png"; // Imagen del botón para zone1
      button4.style.position = "absolute";
      button4.style.cursor = "pointer";
      button4.style.width = "70px";
      button4.style.zIndex = 2000; // Asegúrate de que esté sobre todo
      button4.style.left = "60%"; // Ajustar según sea necesario
      button4.style.top = "50%"; // Ajustar según sea necesario
      button4.style.transform = "translate(-50%, -50%)"; // Centrar la imagen
      button4.classList.add("zone-button"); // Añadir una clase para identificarlos
      document.body.appendChild(button4);

      // Agregar el manejador de clics para el botón
      button4.addEventListener("mouseover", () => {
        grafico4("modal-zone1-image.png"); // Mostrar la imagen correspondiente para zone1
        ignoreNextReset = true; // Evitar el reseteo de la cámara
      });

      // Agregar el manejador para cuando el mouse sale del botón
      button4.addEventListener("mouseout", () => {
        image4.style.display = "none";
      });
    } else {
      button4.style.display = "block"; // Asegúrate de que el botón esté visible
    }
  }

  let image4 = null; // Mover la declaración de la imagen fuera de la función grafico1

  // Función para mostrar una imagen
  function grafico4(src) {
    if (!image4) {
      image4 = document.createElement("img");
      image4.src = "../assets/grafico4.png";
      image4.style.position = "absolute";
      image4.style.top = "50%";
      image4.style.left = "75%";
      image4.style.transform = "translate(-50%, -50%)";
      image4.style.zIndex = 1000;
      image4.style.maxWidth = "90%";
      image4.style.maxHeight = "90%";
      image4.style.cursor = "pointer";
      document.body.appendChild(image4);

      image4.addEventListener("click", () => {
        image4.style.display = "none";
        ignoreNextReset = true; // Evitar el reseteo de la cámara
      });
    }
    image4.style.display = "block";
  }


  
  let button5 = null;

  function boton5() {
    if (!button5) {
      button5 = document.createElement("img");
      button5.src = "../assets/boton3-3.png"; // Imagen del botón para zone1
      button5.style.position = "absolute";
      button5.style.cursor = "pointer";
      button5.style.width = "70px";
      button5.style.zIndex = 2000; // Asegúrate de que esté sobre todo
      button5.style.left = "60%"; // Ajustar según sea necesario
      button5.style.top = "80%"; // Ajustar según sea necesario
      button5.style.transform = "translate(-50%, -50%)"; // Centrar la imagen
      button5.classList.add("zone-button"); // Añadir una clase para identificarlos
      document.body.appendChild(button5);

      // Agregar el manejador de clics para el botón
      button5.addEventListener("mouseover", () => {
        grafico5("modal-zone1-image.png"); // Mostrar la imagen correspondiente para zone1
        ignoreNextReset = true; // Evitar el reseteo de la cámara
      });

      // Agregar el manejador para cuando el mouse sale del botón
      button5.addEventListener("mouseout", () => {
        image5.style.display = "none";
      });
    } else {
      button5.style.display = "block"; // Asegúrate de que el botón esté visible
    }
  }

  let image5 = null; // Mover la declaración de la imagen fuera de la función grafico1

  // Función para mostrar una imagen
  function grafico5(src) {
    if (!image5) {
      image5 = document.createElement("img");
      image5.src = "../assets/grafico5.png";
      image5.style.position = "absolute";
      image5.style.top = "75%";
      image5.style.left = "75%";
      image5.style.transform = "translate(-50%, -50%)";
      image5.style.zIndex = 2000;
      image5.style.maxWidth = "90%";
      image5.style.maxHeight = "90%";
      image5.style.cursor = "pointer";
      document.body.appendChild(image5);

      image5.addEventListener("click", () => {
        image5.style.display = "none";
        ignoreNextReset = true; // Evitar el reseteo de la cámara
      });
    }
    image5.style.display = "block";
  }



  function createZoneButtons(zone) {
    clearZoneButtons(); // Eliminar botones anteriores

    if (zone === zones[0]) {
      // Crear el botón para zone1
      boton1();
      boton2();
    } else if (zone === zones[1]) {
      // Crear el botón-imagen para zone2
      createImageButton();
    } else if (zone === zones[2]) {
      // Crear el botón para zone3
      boton3();
      boton4();
      boton5();

    }
  }

  // Función para mostrar u ocultar la información al hacer clic en un botón
  function toggleInfo(button) {
    const infoBox = document.getElementById("info-box");

    // Alternar visibilidad
    if (infoBox.style.display === "none" || infoBox.style.display === "") {
      showInfo(button);
    } else {
      hideInfo();
    }
  }

  // Función para limpiar los botones de zona
  function clearZoneButtons() {
    zoneButtons.forEach((button) => {
      if (button instanceof THREE.Mesh) {
        scene.remove(button);
      }
    });
    zoneButtons = [];

    // Ocultar botones específicos si existen
    if (imageButton) {
      imageButton.style.display = "none"; // Solo ocultar el botón
    }
    if (button1) {
      button1.style.display = "none"; // Solo ocultar el botón de zone1
    }
    if (button2) {
      button2.style.display = "none"; // Solo ocultar el botón de zone1
    }
    if (button3) {
      button3.style.display = "none"; // Solo ocultar el botón de zone1
    }
    if (button4) {
      button4.style.display = "none"; // Solo ocultar el botón de zone1
    }
    if (button5) {
      button5.style.display = "none"; // Solo ocultar el botón de zone1
    }


    // if (button3) {
    //   button3.style.display = "none"; // Solo ocultar el botón de zone3
    // }
  }

  // Función para mostrar información
  function showInfo(button) {
    const infoBox = document.getElementById("info-box");
    infoBox.style.display = "block";

    // Agregar botón de cierre dentro del contenedor
    if (!document.getElementById("close-button")) {
      const closeButton = document.createElement("button");
      closeButton.id = "close-button";
      closeButton.textContent = "Cerrar";
      closeButton.style.position = "absolute";
      closeButton.style.top = "10px";
      closeButton.style.right = "10px";
      closeButton.addEventListener("click", hideInfo);

      infoBox.appendChild(closeButton);
    }
  }

  // Función para ocultar información y eliminar el botón de cierre
  function hideInfo() {
    const infoBox = document.getElementById("info-box");
    infoBox.style.display = "none";

    // Eliminar el botón de cierre al ocultar la información
    const closeButton = document.getElementById("close-button");
    if (closeButton) {
      closeButton.remove();
    }
  }

  window.addEventListener("click", handleMouseClick);
  window.addEventListener("mousemove", handleMouseMove);
}

// Encuentra el elemento de la imagen en el DOM
const hoverImage = document.getElementById("hover-image");

renderer.setAnimationLoop(animate); // Se manda al render la animación creada

//------------> esto debería ser lo último del código para no romper nada
function animate(time) {
  renderer.render(scene, camera);
}
