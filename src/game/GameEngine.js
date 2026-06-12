import * as BABYLON from '@babylonjs/core';
import { BuildingFactory } from './BuildingFactory.js';
import { GridManager } from './GridManager.js';

/**
 * GameEngine - Motor principal del juego
 */
export class GameEngine {
    constructor(scene, engine, resourceManager) {
        this.scene = scene;
        this.engine = engine;
        this.resourceManager = resourceManager;
        
        this.gridManager = new GridManager(scene);
        this.buildingFactory = new BuildingFactory(scene);
        
        this.buildings = [];
        this.constructionQueue = [];
        this.selectedTile = null;
        
        this.level = 1;
        this.townHallHealth = 100;
        
        this.setupInput();
    }
    
    init() {
        // Crear grid base
        this.gridManager.createGrid();
        
        // Crear Town Hall inicial en el centro
        const townHall = this.buildingFactory.createTownHall(0, 0);
        this.buildings.push({
            type: 'townHall',
            mesh: townHall,
            x: 0,
            y: 0,
            level: 1,
            health: 100,
            maxHealth: 100,
            construction: null
        });
        
        // Agregar algunas minas de oro iniciales
        this.addInitialBuildings();
    }
    
    addInitialBuildings() {
        // Gold Mines
        this.addBuilding('goldMine', -4, -4);
        this.addBuilding('goldMine', 4, -4);
        
        // Elixir Collectors
        this.addBuilding('elixirCollector', -4, 4);
        this.addBuilding('elixirCollector', 4, 4);
        
        // Defenses
        this.addBuilding('cannon', -8, 0);
        this.addBuilding('cannon', 8, 0);
        this.addBuilding('archerTower', 0, -8);
    }
    
    addBuilding(type, x, y) {
        const buildingConfig = this.buildingFactory.getBuildingConfig(type);
        const mesh = this.buildingFactory.createBuilding(type, x, y);
        
        this.buildings.push({
            type: type,
            mesh: mesh,
            x: x,
            y: y,
            level: 1,
            health: buildingConfig.maxHealth,
            maxHealth: buildingConfig.maxHealth,
            construction: null,
            production: {
                lastTime: Date.now(),
                rate: buildingConfig.production || 0
            }
        });
    }
    
    buildBuilding(type) {
        const config = this.buildingFactory.getBuildingConfig(type);
        
        // Check resources
        if (!this.resourceManager.hasEnoughResources(
            config.cost.gold,
            config.cost.elixir,
            config.cost.gems
        )) {
            console.log('No hay suficientes recursos');
            return false;
        }
        
        // Deduct resources
        this.resourceManager.deductResources(
            config.cost.gold,
            config.cost.elixir,
            config.cost.gems
        );
        
        // Add to construction queue
        const construction = {
            type: type,
            timeRemaining: config.buildTime,
            totalTime: config.buildTime,
            x: this.getNextBuildingPosition().x,
            y: this.getNextBuildingPosition().y
        };
        
        this.constructionQueue.push(construction);
        return true;
    }
    
    getNextBuildingPosition() {
        // Simple grid positioning
        const usedPositions = this.buildings.map(b => ({ x: b.x, y: b.y }));
        
        for (let x = -10; x <= 10; x += 2) {
            for (let y = -10; y <= 10; y += 2) {
                const isUsed = usedPositions.some(p => p.x === x && p.y === y);
                if (!isUsed && !(x === 0 && y === 0)) {
                    return { x, y };
                }
            }
        }
        
        return { x: 0, y: -15 };
    }
    
    updateConstructionQueue() {
        const deltaTime = 0.016; // ~60fps
        
        this.constructionQueue = this.constructionQueue.filter(construction => {
            construction.timeRemaining -= deltaTime;
            
            if (construction.timeRemaining <= 0) {
                // Building complete
                this.addBuilding(construction.type, construction.x, construction.y);
                return false;
            }
            
            return true;
        });
    }
    
    produceResources() {
        const now = Date.now();
        
        this.buildings.forEach(building => {
            if (building.type === 'goldMine') {
                const deltaTime = (now - building.production.lastTime) / 1000;
                if (deltaTime >= 1) {
                    this.resourceManager.addResources(10 * building.level, 0, 0);
                    building.production.lastTime = now;
                }
            } else if (building.type === 'elixirCollector') {
                const deltaTime = (now - building.production.lastTime) / 1000;
                if (deltaTime >= 1) {
                    this.resourceManager.addResources(0, 8 * building.level, 0);
                    building.production.lastTime = now;
                }
            }
        });
    }
    
    setupInput() {
        this.scene.onPointerDown = (evt, pickResult) => {
            if (pickResult && pickResult.hit) {
                const pickedMesh = pickResult.pickedMesh;
                
                // Highlight selected building
                this.buildings.forEach(building => {
                    if (building.mesh === pickedMesh || 
                        (building.mesh && building.mesh.getChildren().includes(pickedMesh))) {
                        console.log(`Seleccionado: ${building.type} en (${building.x}, ${building.y})`);
                        this.selectBuilding(building);
                    }
                });
            }
        };
    }
    
    selectBuilding(building) {
        // Clear previous selection
        this.buildings.forEach(b => {
            if (b.mesh && b.mesh.material) {
                b.mesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
            }
        });
        
        // Highlight selected
        if (building.mesh && building.mesh.material) {
            building.mesh.material.emissiveColor = new BABYLON.Color3(0.3, 0.8, 0.2);
        }
        
        this.selectedTile = building;
    }
    
    getConstructionQueue() {
        return this.constructionQueue;
    }
}
