# Clash of Clans Web Game

Un juego de estrategia estilo Clash of Clans construido completamente en web usando Babylon.js 3D.

## 🎮 Características

- **Gráficos 3D Isométricos**: Construidos con Babylon.js para una experiencia visual similar a Clash of Clans
- **Sistema de Recursos**: Oro, Elixir y Gemas que se producen automáticamente
- **Sistema de Construcciones**: Múltiples edificios con diferentes funcionalidades
  - Town Hall (centro de mando)
  - Minas de Oro (producción pasiva)
  - Colectores de Elixir (producción pasiva)
  - Cañones (defensa)
  - Torres de Arquero (defensa avanzada)
  - Almacenes (almacenamiento de recursos)
  - Cuarteles (futuro sistema de ejército)

- **Sistema de Tiempos**: Construcción progresiva de edificios
- **Persistencia**: Los datos se guardan en localStorage
- **Interfaz Intuitiva**: Panel de recursos, construcciones y cola de construcción

## 🚀 Instalación

```bash
npm install
npm start
```

Abre `http://localhost:5173` en tu navegador.

## 📋 Cómo Jugar

1. **Recolecta Recursos**: Los edificios producen automáticamente Oro y Elixir
2. **Construye tu Aldea**: Usa los botones en la parte inferior izquierda
3. **Gestiona Construcciones**: La cola de construcción muestra el progreso
4. **Defiende tu Base**: Construye defensas estratégicamente

## 🏗️ Estructura del Proyecto

```
src/
├── index.js                 # Punto de entrada principal
├── game/
│   ├── GameEngine.js        # Motor principal del juego
│   ├── ResourceManager.js   # Gestión de recursos
│   ├── BuildingFactory.js   # Creación de edificios
│   └── GridManager.js       # Sistema de grid
└── ui/
    └── UIManager.js         # Gestión de interfaz
```

## 🎨 Tecnologías

- **Babylon.js 3D**: Motor de gráficos 3D
- **Vite**: Bundler moderno
- **Vanilla JavaScript**: Sin dependencias externas

## 🎯 Mejoras Futuras

- [ ] Sistema de ejército y combate
- [ ] Multiplayer en tiempo real
- [ ] Sistema de clanes
- [ ] Tienda de gemas
- [ ] Evento de ataques
- [ ] Animaciones mejoradas
- [ ] Efectos de sonido
- [ ] Sistema de batalla en vivo

## 📦 Build para Producción

```bash
npm run build
npm run preview
```

## 📝 Licencia

MIT
