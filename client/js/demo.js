(function(){
	var three = THREE;
	var stats = new Stats();
	var scene, camera, renderer, controls;
	var lastX,lastY;
	showStats();
	init();
	attachEventListner();
	animate();
	
	function showStats(){
		stats.showPanel( 0 );
		document.body.appendChild( stats.dom );
	}

	function init(){
		renderer = new three.WebGLRenderer();
		renderer.setClearColor(0xEEEEEE, 1.);
		renderer.clear();
		renderer.setSize(innerWidth, innerHeight);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = three.PCFSoftShadowMap;
		scene = new three.Scene();
		camera = new three.PerspectiveCamera( 75, innerWidth / innerHeight, 0.1, 1000 );		
		camera.position.set(50, 50, 50);
		camera.lookAt(scene.position);

		document.body.appendChild(renderer.domElement);
		initMap();
		showAxis(10000);
	}

	function initMap(){
		const DEG_2_RAD = 2 * Math.PI / 360;
		//basis
		const material = {
			basicMaterial : new three.MeshBasicMaterial({ color: 0xf0f0f0 }),
			lambertMaterial : new three.MeshLambertMaterial( { color: 0xf0f0f0 } ),
			basePlaneMaterial : new three.MeshLambertMaterial({color: 0xf0f0f0, side: three.DoubleSide })
		}
		const light = new three.AmbientLight(0xffffff,.3);
		scene.add(light);
		var pointLight = new three.PointLight(0xffffff, 1, 100, 2);
		pointLight.position.set(0,50,0);
		pointLight.castShadow = true;
		pointLight.shadow.mapSize.width = 2048;  // default
		pointLight.shadow.mapSize.height = 2048; // default
		pointLight.shadow.camera.near = 0.5;       // default
		pointLight.shadow.camera.far = 500      // default
		pointLight.
		scene.add(pointLight);
		var basePlaneGeometry = new three.PlaneGeometry(100, 50);
		var basePlane = new three.Mesh(basePlaneGeometry, material.basePlaneMaterial);
		basePlane.castShadow = true;
		basePlane.receiveShadow = true;
		basePlane.position.set(0,0,0);
		basePlane.rotation.set(-90 * DEG_2_RAD, 0, 0);
		scene.add(basePlane);		
		//adding more objects;
		var walls = [];
		//buffer, size, mat, pos, rot
		addBox(walls, [10, 10, 20], material.lambertMaterial, [10,25,0], [0,0,0]);
		addBox(walls, [10, 10, 30], material.lambertMaterial, [10,10,10], [0,90 * DEG_2_RAD, 0]);
		// addBox(walls, [10, 10, 30], material.lambertMaterial, [10,0,10], [0,90 * DEG_2_RAD, 0]);
		for(var i = 0; i < walls.length; i++){
			scene.add(walls[i]);
		}
		var helper = new THREE.CameraHelper( pointLight.shadow.camera );
		scene.add(helper);

		function addBox(buffer, size, material, position, rotation){
			var box = new three.Mesh(creatBoxGeo(size), material);
			box.position.set.apply(box.position, position);
			box.rotation.set.apply(box.rotation, rotation);
			box.receiveShadow = true;
			box.castShadow = true;
			buffer.push(box);

			function creatBoxGeo(args){
				// walkaround for .apply() on constructor;
				return new (Function.prototype.bind.apply(three.BoxGeometry, [null].concat(args)));
			}
		}
	}

	function animate() {
		stats.begin();
		render();
		stats.end();
		requestAnimationFrame( animate );
	}
	function render(){
		renderer.render( scene, camera );
	}
	//Camera Control and Reference
	function showAxis(length){
		var colors = [0xff0000, 0x00ff00, 0x0000ff];
		for(var i = 0 ; i < 3; i++){
			var from = [0,0,0];
			var to = [0,0,0];
			var lineGeo = new three.Geometry();
			var lineMat = new THREE.LineBasicMaterial({ color: colors[i]});
			from[i] = length;
			to[i] = -length;
			lineGeo.vertices.push(v3.apply(null, from), v3.apply(null, to));
			var axis = new three.Line(lineGeo, lineMat);
			scene.add(axis);
		}
		function v3(x,y,z){
			return new three.Vector3(x, y, z);
		}
	}
	function attachEventListner(){
		window.addEventListener("resize", onWindowResize);
		renderer.domElement.addEventListener("mousedown", onMouseDown);
		renderer.domElement.addEventListener("mouseup", onMouseUp);
		renderer.domElement.addEventListener("mousewheel", onScroll);
	}
	function onWindowResize() {
		camera.aspect = innerWidth / innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( innerWidth, innerHeight );
		console.log("resized");
	}
	function onMouseDown(e){
		e.preventDefault();
		renderer.domElement.addEventListener("mousemove", onMouseMove);
		lastX = e.clientX;
		lastY = e.clientY;
	}
	function onMouseMove(e){
		e.preventDefault();
		var dx = e.clientX - lastX;
		var dy = e.clientY - lastY;
		lastX = e.clientX;
		lastY = e.clientY;
		rotateAboutY(dx, scene.position);
		camera.position.y += dy;
		camera.lookAt(scene.position);

		function rotateAboutY(dx, target){
			target || (target = scene.position);
			var px = camera.position.x;
			var pz = camera.position.z;
			var magnitude = Math.sqrt(px * px + pz * pz);
			var angle = Math.atan2(pz, px) + dx * 2 * Math.PI / 360;
			camera.position.z = magnitude * Math.sin(angle);
			camera.position.x = magnitude * Math.cos(angle);
			camera.lookAt(target);
		}
	}
	function onMouseUp(e){
		e.preventDefault();
		renderer.domElement.removeEventListener("mousemove", onMouseMove);
	}
	function onScroll(e){
		e.preventDefault();
		var factor = 0.05;
		factor = 1 + (e.wheelDelta > 0 ? -factor : factor);
		camera.position.x *= factor;
		camera.position.y *= factor;
		camera.position.z *= factor;
		camera.lookAt(scene.position);
	}

})();
