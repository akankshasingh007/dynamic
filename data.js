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

export { vehicles };
