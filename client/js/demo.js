(function(){
	var three = THREE;
	var stats = new Stats();
	var scene, camera, renderer;
	var lastX,lastY;
	showStats();
	init();
	render();
	
	function showStats(){
		stats.showPanel( 0 );
		document.body.appendChild( stats.dom );
	}

	function init(){
		scene = new three.Scene();
		camera = new three.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );		
		renderer = new three.WebGLRenderer();
		camera.position.z = 20;
		camera.lookAt(new three.Vector3(0,0,0));
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		initMap();
		showAxis();
	}

	function showAxis(){
		const length = 1000;
		var colors = [0xff0000, 0x00ff00, 0x0000ff];
		var from = to = [0,0,0];
		for(var i = 0 ; i < 3; i++){
			var lineGeo = new three.Geometry();
			var lineMat = new THREE.LineBasicMaterial({ color: colors[i], lineWidth: 1 });
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
			basePlaneMaterial : new three.MeshBasicMaterial({color: 0xf0f0f0, side: three.DoubleSide })
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

	function onMouseDown(e){
		render.domElement.addEventListener("mousemove", onMouseMove);
		lastX = e.clientX;
		lastY = e.clientY;
	}
	function onMouseMove(e){
		var dx = e.clientX - lastX;
		var dy = e.clientY - lastY;
		
	}
	function onMouseUp(e){
		render.domElement.removeEventListener("mousemove", onMouseMove);
	}
	function onScroll(e){

	}

})();
