/**
 * ResourceManager - Gestiona los recursos del juego (Oro, Elixir, Gemas)
 */
export class ResourceManager {
    constructor() {
        this.resources = {
            gold: 5000,
            elixir: 5000,
            gems: 100
        };
        
        this.maxStorage = {
            gold: 10000,
            elixir: 10000
        };
        
        this.productionRate = {
            gold: 10,
            elixir: 8
        };
        
        this.lastProductionTime = Date.now();
        
        // Load from localStorage
        this.load();
        
        // Auto-produce resources
        this.startProduction();
    }
    
    startProduction() {
        setInterval(() => {
            this.produceResources();
        }, 1000);
    }
    
    produceResources() {
        const now = Date.now();
        const deltaTime = (now - this.lastProductionTime) / 1000;
        
        this.resources.gold = Math.min(
            this.resources.gold + (this.productionRate.gold * deltaTime),
            this.maxStorage.gold
        );
        
        this.resources.elixir = Math.min(
            this.resources.elixir + (this.productionRate.elixir * deltaTime),
            this.maxStorage.elixir
        );
        
        this.lastProductionTime = now;
        this.save();
    }
    
    hasEnoughResources(gold = 0, elixir = 0, gems = 0) {
        return this.resources.gold >= gold && 
               this.resources.elixir >= elixir && 
               this.resources.gems >= gems;
    }
    
    deductResources(gold = 0, elixir = 0, gems = 0) {
        if (this.hasEnoughResources(gold, elixir, gems)) {
            this.resources.gold -= gold;
            this.resources.elixir -= elixir;
            this.resources.gems -= gems;
            this.save();
            return true;
        }
        return false;
    }
    
    addResources(gold = 0, elixir = 0, gems = 0) {
        this.resources.gold = Math.min(
            this.resources.gold + gold,
            this.maxStorage.gold
        );
        this.resources.elixir = Math.min(
            this.resources.elixir + elixir,
            this.maxStorage.elixir
        );
        this.resources.gems += gems;
        this.save();
    }
    
    getResources() {
        return { ...this.resources };
    }
    
    save() {
        localStorage.setItem('clashGameResources', JSON.stringify(this.resources));
    }
    
    load() {
        const saved = localStorage.getItem('clashGameResources');
        if (saved) {
            this.resources = JSON.parse(saved);
        }
    }
}
