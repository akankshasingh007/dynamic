// Import vehicle data
const vehicles = [
    {
        id: 1,
        name: "SEA 1.0",
        fullName: "Safeena E Aabdoz (SEA) 1.0",
        model: "First Generation",
        status: "Legacy",
        year: 2015,
        description: "The pioneering AUV from AUV-ZHCET. Achieved single plane motion and remote WiFi operation.",
        
        attributes: {
            depth: { value: 50, max: 300, label: "Max Depth (m)" },
            speed: { value: 1.2, max: 3, label: "Max Speed (m/s)" },
            battery: { value: 4, max: 10, label: "Battery Life (hrs)" },
            endurance: { value: 2, max: 10, label: "Range (km)" }
        },
        
        components: [
            "Arduino Controller",
            "DC Motors",
            "Wireless Module",
            "Basic Sensors",
            "Aluminum Frame",
            "Buoyancy Tank"
        ],
        
        specifications: {
            "Weight": "15 kg",
            "Dimensions": "1.2 x 0.8 x 0.7 m",
            "Thrusters": "4x DC Motors",
            "Control": "WiFi Remote",
            "Battery": "LiPo 4S",
            "Sensors": "Compass, Pressure"
        }
    },
    {
        id: 2,
        name: "SEA 2.0",
        fullName: "Safeena E Aabdoz (SEA) 2.0",
        model: "Second Generation",
        status: "Retired",
        year: 2017,
        description: "Enhanced version with improved propulsion and autonomous capabilities using ROS integration.",
        
        attributes: {
            depth: { value: 100, max: 300, label: "Max Depth (m)" },
            speed: { value: 1.8, max: 3, label: "Max Speed (m/s)" },
            battery: { value: 6, max: 10, label: "Battery Life (hrs)" },
            endurance: { value: 3.5, max: 10, label: "Range (km)" }
        },
        
        components: [
            "Raspberry Pi",
            "BLDC Motors",
            "ROS Framework",
            "IMU Sensor",
            "Pressure Sensor",
            "Thruster ESC",
            "Li-ion Battery",
            "Servo Control"
        ],
        
        specifications: {
            "Weight": "20 kg",
            "Dimensions": "1.5 x 0.9 x 0.8 m",
            "Thrusters": "6x BLDC Motors",
            "Autonomy": "ROS-based",
            "Battery": "Li-ion 6S",
            "Processor": "Raspberry Pi 3B"
        }
    },
    {
        id: 3,
        name: "SEA 3.0",
        fullName: "Safeena E Aabdoz (SEA) 3.0",
        model: "Third Generation",
        status: "Active",
        year: 2019,
        description: "Advanced AUV with sophisticated autonomy system and competition-grade specifications.",
        
        attributes: {
            depth: { value: 200, max: 300, label: "Max Depth (m)" },
            speed: { value: 2.2, max: 3, label: "Max Speed (m/s)" },
            battery: { value: 7, max: 10, label: "Battery Life (hrs)" },
            endurance: { value: 5, max: 10, label: "Range (km)" }
        },
        
        components: [
            "Nvidia Jetson",
            "BLDC Thrusters",
            "Advanced Vision",
            "Dual IMU",
            "Depth Sensor",
            "ESC Array",
            "LiPo Battery",
            "Water Detection"
        ],
        
        specifications: {
            "Weight": "28 kg",
            "Dimensions": "1.6 x 1.0 x 0.9 m",
            "Thrusters": "8x BLDC Thrusters",
            "Processor": "Nvidia Jetson TX2",
            "Battery": "LiPo 6S (5000mAh)",
            "Vision": "USB Cameras",
            "Depth Rating": "200m"
        }
    },
    {
        id: 4,
        name: "SEA 4.0",
        fullName: "Safeena E Aabdoz (SEA) 4.0",
        model: "Fourth Generation",
        status: "Active",
        year: 2022,
        description: "High-performance AUV with optimized design for SAUVC and international competition standards.",
        
        attributes: {
            depth: { value: 250, max: 300, label: "Max Depth (m)" },
            speed: { value: 2.5, max: 3, label: "Max Speed (m/s)" },
            battery: { value: 8, max: 10, label: "Battery Life (hrs)" },
            endurance: { value: 6.5, max: 10, label: "Range (km)" }
        },
        
        components: [
            "Jetson Orin Nano",
            "T200 Thrusters",
            "4K Camera",
            "Triaxial Magnetometer",
            "Bar30 Depth",
            "Smart ESC",
            "Lithium Battery",
            "Leak Detector",
            "DVL Sonar"
        ],
        
        specifications: {
            "Weight": "32 kg",
            "Dimensions": "1.7 x 1.1 x 0.95 m",
            "Thrusters": "8x Blue Robotics T200",
            "Processor": "Jetson Orin Nano",
            "Battery": "LiPo 6S (18Ah)",
            "Depth Rating": "250m",
            "Frame": "Aluminum Profile"
        }
    },
    {
        id: 5,
        name: "SEA 5.0",
        fullName: "Safeena E Aabdoz (SEA) 5.0",
        model: "Latest Generation",
        status: "Active",
        year: 2024,
        description: "Latest advanced AUV equipped with high-performance thrusters, cutting-edge electronics, and advanced autonomy. Competing at SAUVC 2025.",
        
        attributes: {
            depth: { value: 300, max: 300, label: "Max Depth (m)" },
            speed: { value: 3.0, max: 3, label: "Max Speed (m/s)" },
            battery: { value: 10, max: 10, label: "Battery Life (hrs)" },
            endurance: { value: 8.5, max: 10, label: "Range (km)" }
        },
        
        components: [
            "Jetson Orin AGX",
            "T500 Thrusters",
            "8K Stereo Vision",
            "9-DOF IMU",
            "Advanced Sonar",
            "Next-gen ESC",
            "Graphene Battery",
            "Smart Ballast",
            "Fault Detection"
        ],
        
        specifications: {
            "Weight": "38 kg",
            "Dimensions": "1.8 x 1.2 x 1.0 m",
            "Thrusters": "8x Blue Robotics T500",
            "Processor": "Jetson Orin AGX",
            "Battery": "Graphene LiPo 6S (20Ah)",
            "Depth Rating": "300m",
            "Speed": "3.0 m/s",
            "Autonomy": "Full Mission Planning"
        }
    }
];

let currentVehicle = null;
let scene, camera, renderer;
let vehicleModel;
let autoRotate = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    init3DScene();
    selectVehicle(0);
});

// ===== UI INITIALIZATION =====
function initializeUI() {
    const vehicleList = document.getElementById('vehicleList');
    
    vehicles.forEach((vehicle, index) => {
        const item = document.createElement('div');
        item.className = 'vehicle-item';
        if (index === 0) item.classList.add('active');
        
        item.innerHTML = `
            <div class="vehicle-item-name">${vehicle.name}</div>
            <div class="vehicle-item-model">${vehicle.model}</div>
        `;
        
        item.addEventListener('click', () => selectVehicle(index));
        vehicleList.appendChild(item);
    });
    
    // Control buttons
    document.getElementById('rotateBtn').addEventListener('click', toggleAutoRotate);
    document.getElementById('resetBtn').addEventListener('click', resetView);
    document.getElementById('upgradeBtn').addEventListener('click', () => {
        alert(`${currentVehicle.fullName}\n\n${currentVehicle.description}`);
    });
}

// ===== VEHICLE SELECTION =====
function selectVehicle(index) {
    currentVehicle = vehicles[index];
    
    // Update active state
    document.querySelectorAll('.vehicle-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    // Update info panel
    updateInfoPanel();
    
    // Update 3D model
    if (vehicleModel) {
        scene.remove(vehicleModel);
    }
    create3DModel(currentVehicle);
}

// ===== UPDATE INFO PANEL =====
function updateInfoPanel() {
    document.getElementById('vehicleName').textContent = currentVehicle.fullName;
    document.getElementById('vehicleModel').textContent = `Model: ${currentVehicle.model} (${currentVehicle.year})`;
    document.getElementById('vehicleStatus').textContent = `Status: ${currentVehicle.status}`;
    
    // Update stats
    const depthPercent = (currentVehicle.attributes.depth.value / currentVehicle.attributes.depth.max) * 100;
    const speedPercent = (currentVehicle.attributes.speed.value / currentVehicle.attributes.speed.max) * 100;
    const batteryPercent = (currentVehicle.attributes.battery.value / currentVehicle.attributes.battery.max) * 100;
    const endurancePercent = (currentVehicle.attributes.endurance.value / currentVehicle.attributes.endurance.max) * 100;
    
    document.getElementById('depthStat').style.width = depthPercent + '%';
    document.getElementById('speedStat').style.width = speedPercent + '%';
    document.getElementById('batteryStat').style.width = batteryPercent + '%';
    document.getElementById('enduranceStat').style.width = endurancePercent + '%';
    
    document.getElementById('depthValue').textContent = `${currentVehicle.attributes.depth.value}m`;
    document.getElementById('speedValue').textContent = `${currentVehicle.attributes.speed.value} m/s`;
    document.getElementById('batteryValue').textContent = `${currentVehicle.attributes.battery.value} hrs`;
    document.getElementById('enduranceValue').textContent = `${currentVehicle.attributes.endurance.value} km`;
    
    // Update components
    const componentGrid = document.getElementById('componentGrid');
    componentGrid.innerHTML = '';
    currentVehicle.components.forEach(comp => {
        const item = document.createElement('div');
        item.className = 'component-item';
        item.textContent = comp;
        componentGrid.appendChild(item);
    });
    
    // Update specifications
    const specsList = document.getElementById('specsList');
    specsList.innerHTML = '';
    Object.entries(currentVehicle.specifications).forEach(([key, value]) => {
        const item = document.createElement('div');
        item.className = 'spec-item';
        item.innerHTML = `
            <span class="spec-item-label">${key}</span>
            <span class="spec-item-value">${value}</span>
        `;
        specsList.appendChild(item);
    });
}

// ===== 3D SCENE SETUP =====
function init3DScene() {
    const canvas = document.getElementById('canvas3d');
    
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1428);
    scene.fog = new THREE.Fog(0x0a1428, 100, 500);
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 4);
    camera.lookAt(0, 0, 0);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x6496ff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 15, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xa0d0ff, 0.5);
    pointLight.position.set(-15, 10, -10);
    scene.add(pointLight);
    
    // Grid helper (optional)
    const gridHelper = new THREE.GridHelper(20, 20, 0x6496ff, 0x2a4a8a);
    gridHelper.position.y = -3;
    scene.add(gridHelper);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    animate();
}

// ===== CREATE 3D MODEL =====
function create3DModel(vehicle) {
    const group = new THREE.Group();
    
    // Create a simplified AUV model based on vehicle specs
    const dimensions = vehicle.specifications.Dimensions.split(' x ').map(d => parseFloat(d));
    const length = dimensions[0] * 0.3; // Scale for visualization
    const width = dimensions[1] * 0.3;
    const height = dimensions[2] * 0.3;
    
    // Main body (cylinder)
    const bodyGeometry = new THREE.CylinderGeometry(width / 2, width / 2, length, 32);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.6, 0.7, 0.5),
        shininess: 100,
        wireframe: false
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);
    
    // Front cone (nose)
    const noseGeometry = new THREE.ConeGeometry(width / 2, height * 0.5, 32);
    const noseMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.6, 0.8, 0.6),
        shininess: 120
    });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.z = length / 2 + height * 0.25;
    nose.castShadow = true;
    group.add(nose);
    
    // Thrusters (simplified as small cylinders)
    const thrusterCount = parseInt(vehicle.specifications.Thrusters.match(/\d+/)[0]);
    const thrusterGeometry = new THREE.CylinderGeometry(width * 0.15, width * 0.15, width * 0.8, 16);
    const thrusterMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.1, 0.8, 0.5),
        emissive: 0xFF6600,
        shininess: 80
    });
    
    // Add 4 main thrusters (simplified)
    const thrusterPositions = [
        [width * 0.6, height * 0.3, -length * 0.3],
        [-width * 0.6, height * 0.3, -length * 0.3],
        [width * 0.6, -height * 0.3, -length * 0.3],
        [-width * 0.6, -height * 0.3, -length * 0.3]
    ];
    
    thrusterPositions.forEach(pos => {
        const thruster = new THREE.Mesh(thrusterGeometry, thrusterMaterial.clone());
        thruster.position.set(...pos);
        thruster.rotation.z = Math.PI / 2;
        thruster.castShadow = true;
        group.add(thruster);
    });
    
    // Add some fins/stabilizers
    const finGeometry = new THREE.BoxGeometry(width * 0.2, height, width * 0.1);
    const finMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.55, 0.6, 0.45),
        shininess: 100
    });
    
    const fins = [
        { pos: [0, 0, -length * 0.4], rot: [0, 0, 0] },
        { pos: [0, 0, -length * 0.2], rot: [0, 0, 0] }
    ];
    
    fins.forEach(fin => {
        const finMesh = new THREE.Mesh(finGeometry, finMaterial.clone());
        finMesh.position.set(...fin.pos);
        finMesh.castShadow = true;
        group.add(finMesh);
    });
    
    vehicleModel = group;
    scene.add(vehicleModel);
}

// ===== ANIMATION =====
function animate() {
    requestAnimationFrame(animate);
    
    if (vehicleModel) {
        if (autoRotate) {
            vehicleModel.rotation.y += 0.005;
        }
        vehicleModel.rotation.x += 0.001;
    }
    
    renderer.render(scene, camera);
}

// ===== CONTROLS =====
function toggleAutoRotate() {
    autoRotate = !autoRotate;
    document.getElementById('rotateBtn').style.opacity = autoRotate ? '1' : '0.7';
}

function resetView() {
    if (vehicleModel) {
        vehicleModel.rotation.set(0.3, 0, 0);
    }
    camera.position.set(0, 2, 4);
    camera.lookAt(0, 0, 0);
}

// ===== RESPONSIVE =====
function onWindowResize() {
    const canvas = document.getElementById('canvas3d');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// ===== MOUSE CONTROLS (OPTIONAL) =====
let mouseDown = false;
let mouseX = 0;
let mouseY = 0;

document.getElementById('canvas3d').addEventListener('mousedown', (e) => {
    mouseDown = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
});

document.addEventListener('mousemove', (e) => {
    if (mouseDown && vehicleModel) {
        const deltaX = e.clientX - mouseX;
        const deltaY = e.clientY - mouseY;
        
        vehicleModel.rotation.y += deltaX * 0.005;
        vehicleModel.rotation.x += deltaY * 0.005;
        
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
});

document.addEventListener('mouseup', () => {
    mouseDown = false;
});
