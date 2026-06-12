import * as BABYLON from '@babylonjs/core';
import { GameEngine } from './game/GameEngine.js';
import { UIManager } from './ui/UIManager.js';
import { ResourceManager } from './game/ResourceManager.js';

let gameEngine;
let uiManager;

export function initGame() {
    const canvas = document.getElementById('canvas');
    
    // Create Babylon.js engine
    const engine = new BABYLON.Engine(canvas, true);
    
    // Create scene
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.1, 0.15, 0.2);
    
    // Initialize resource manager
    const resourceManager = new ResourceManager();
    
    // Initialize game engine
    gameEngine = new GameEngine(scene, engine, resourceManager);
    
    // Initialize UI manager
    uiManager = new UIManager(resourceManager, gameEngine);
    
    // Setup camera and rendering
    setupCamera(scene);
    setupLighting(scene);
    
    // Initialize game
    gameEngine.init();
    
    // Render loop
    engine.runRenderLoop(() => {
        gameEngine.updateConstructionQueue();
        gameEngine.produceResources();
        scene.render();
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        engine.resize();
    });
    
    // Update UI every frame
    setInterval(() => {
        uiManager.update();
    }, 100);
}

function setupCamera(scene) {
    const camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(20, 30, -40));
    camera.attachControl(scene.getEngine().getRenderingCanvas(), true);
    
    // Camera settings
    camera.wheelPrecision = 100;
    camera.speed = 0.5;
    camera.inertia = 0.7;
    camera.angularSensibility = 1000;
    
    // Limit camera movement
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 80;
    camera.lowerBetaLimit = 0;
    camera.upperBetaLimit = Math.PI * 0.5;
}

function setupLighting(scene) {
    // Ambient light
    const ambientLight = new BABYLON.HemisphericLight('ambientLight', new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.8;
    ambientLight.diffuse = new BABYLON.Color3(1, 1, 1);
    ambientLight.specular = new BABYLON.Color3(0.2, 0.2, 0.2);
    
    // Directional light (sun)
    const sunLight = new BABYLON.PointLight('sunLight', new BABYLON.Vector3(20, 30, -20), scene);
    sunLight.intensity = 0.7;
    sunLight.range = 200;
    
    // Shadow generator
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, sunLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;
}
