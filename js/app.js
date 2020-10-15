//3 THINGS THAT WE NEED: SCENE, CAMERA, AND RENDER

let clock = new THREE.Clock();
let time = 0;
let delta = 0;
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
    75, //Field of View
    window.innerWidth / window.innerHeight, //Aspect Ratio
    0.1, //Near
    1000 //Far
);

let renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setClearColor(0x101010);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//stars
let starGeometry  = new THREE.SphereGeometry( 30, 30, 30)
let starMaterial  = new THREE.MeshBasicMaterial()
starMaterial.map   = THREE.ImageUtils.loadTexture('imgs/Stars.jpg')
starMaterial.side  = THREE.BackSide
let stars  = new THREE.Mesh(starGeometry, starMaterial)
scene.add(stars)

//sphereSkin
let texture = new THREE.TextureLoader().load( 'imgs/SaturnTexture.jpg' );

//sphere
let saturnSys = new THREE.Group();
let saturnSysAxis = new THREE.Vector3( 0, 1, 0);
let saturnGeometry = new THREE.SphereGeometry( 4.5, 32, 32 );
let saturnMaterial = new THREE.MeshPhongMaterial( {map: texture} );
let saturn = new THREE.Mesh( saturnGeometry, saturnMaterial );

//ring
let saturnRingGeometry = new THREE.Geometry();
let vertices = [];
for (let i = 0; i < 7000; i++) {
  let r = THREE.Math.randFloat(5, 9);
  let angle = THREE.Math.randFloat(0, Math.PI * 2);
  let v = new THREE.Vector3(
    Math.cos(angle) * r,
    0,
    Math.sin(angle) * r
  );
  v.angularVelocity = THREE.Math.randFloat(0.1, Math.PI);
  vertices.push(v);
}

saturnRingGeometry.vertices = vertices;

let saturnRing = new THREE.Points(saturnRingGeometry, new THREE.PointsMaterial({
  size: 0.1,
  color: "#d3dd81"
}));
saturn.add(saturnRing);

scene.add(saturn);


//Camera
camera.position.set(0, 5, 10);
camera.lookAt(scene.position);


//"sun's Light"
let spotLightOne = new THREE.SpotLight( 0xffffff, 0.9 );
spotLightOne.position.set( -15, 0, 5 );
spotLightOne.castShadow = true;

spotLightOne.shadow.mapSize.width = 512;
spotLightOne.shadow.mapSize.height = 512;

spotLightOne.shadow.camera.near = 0.5;
spotLightOne.shadow.camera.far = 50;
spotLightOne.shadow.camera.focus = 1;

let helper = new THREE.CameraHelper( spotLightOne.shadow.camera)

scene.add( spotLightOne );

//equalLighting
let ambLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.6 );
scene.add( ambLight );

render();

function render(){
    requestAnimationFrame(render);

    //animation
    delta = clock.getDelta();
    time += delta * 0.1;

    //saturn's Ring
    saturnRing.geometry.vertices.forEach(v => {
        v.applyAxisAngle(saturnSysAxis, v.angularVelocity * delta);
    });
    saturnRing.geometry.verticesNeedUpdate = true;

    //saturn
    saturn.rotation.y = 0.25;
    saturn.rotation.z = 0.5;
    
    //stars
    stars.rotation.y += -0.01;
    
    renderer.render(scene, camera);
}