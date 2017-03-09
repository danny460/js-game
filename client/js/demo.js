(function(){
	var three = THREE;
	var stats = new Stats();
	var scene, camera, renderer;
	var lastX,lastY;
	showStats();
	init();
	attachEventListner();
	render();
	
	function showStats(){
		stats.showPanel( 0 );
		document.body.appendChild( stats.dom );
	}

	function init(){
		renderer = new three.WebGLRenderer();
		renderer.setClearColor(0xEEEEEE, 1.);
		renderer.clear();
		renderer.setSize(innerWidth, innerHeight);
		scene = new three.Scene();
		camera = new three.PerspectiveCamera( 75, innerWidth / innerHeight, 0.1, 1000 );		
		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = 20;
		camera.lookAt(scene.position);
		
		document.body.appendChild(renderer.domElement);
		initMap();
		showAxis(5000);
	}

	function showAxis(length){
		var colors = [0xff0000, 0x00ff00, 0x0000ff];
		for(var i = 0 ; i < 3; i++){
			var from = [0,0,0];
			var to = [0,0,0];
			var lineGeo = new three.Geometry();
			var lineMat = new THREE.LineBasicMaterial({ color: colors[i] });
			from[i] = length;
			to[i] = -length;
			lineGeo.vertices.push(v3.apply(null, from), v3.apply(null, to));
			var axis = new three.Line(lineGeo, lineMat);
			axis.type = three.Lines;
			scene.add(axis);
		}
		function v3(x,y,z){
			return new three.Vector3(x, y, z);
		}
	}


	function initMap(){
		//mapInfo
		const light = new three.AmbientLight(0x404040, 1);
		const material = {
			basicMaterial : new three.MeshBasicMaterial({ color: 0xf0f0f0 }),
			lambertMaterial : new three.MeshLambertMaterial( { color: 0xf0f0f0 } ),
			basePlaneMaterial : new three.MeshBasicMaterial({color: 0xffffff, side: three.DoubleSide })
		}
		var basePlaneGeometry = new three.PlaneGeometry(10, 10);
		var basePlane = new three.Mesh(basePlaneGeometry, material.basePlaneMaterial);
		basePlane.position.x = 0;
		basePlane.position.y = 0;
		basePlane.position.z = 0;
		
		//add to scene;
		scene.add(light);
		scene.add(basePlane);
	}

	function render() {
		stats.begin();
		renderer.render( scene, camera );
		stats.end();
		requestAnimationFrame( render );
	}

	function attachEventListner(){
		renderer.domElement.addEventListener("mousedown", onMouseDown);
		renderer.domElement.addEventListener("mousewheel", onScroll);
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
		var angle = dx * 0.5 * 2 * Math.Pi / 360;
		rotate()
		function rotate(angle, center){
			//TODO
		}
	}
	function onMouseUp(e){
		e.preventDefault();
		renderer.domElement.removeEventListener("mousemove", onMouseMove);
	}
	function onScroll(e){

	}

})();
