const TILE_SIZE = 64;
const GRID_WIDTH = 5;
const GRID_HEIGHT = 5;

let playerData = loadPlayerData();

const config = {
  type: Phaser.AUTO,
  width: GRID_WIDTH * TILE_SIZE,
  height: GRID_HEIGHT * TILE_SIZE + 50,
  scene: {
    preload,
    create,
    update,
  }
};

let game = new Phaser.Game(config);

function preload() {
  this.load.image('soil', 'assets/soil.png');
  this.load.image('wheat', 'assets/wheat.png');
}

function create() {
  this.tiles = [];
  this.growing = {};
  this.trigoText = this.add.text(10, GRID_HEIGHT * TILE_SIZE + 10, `Trigo: ${playerData.trigo}`, { fontSize: '16px', fill: '#000' });

  this.plantarOuColher = (x, y) => {
    const coord = `${x},${y}`;
    const tile = this.tiles.find(t => t.x === x && t.y === y);
    const data = this.growing[coord];

    if (!data) {
      this.growing[coord] = { plantedAt: Date.now(), ready: false };
    } else if (data.ready) {
      playerData.trigo++;
      savePlayerData(playerData);
      this.trigoText.setText(`Trigo: ${playerData.trigo}`);

      if (tile.crop) tile.crop.destroy();
      delete this.growing[coord];
    }
  };

  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const tile = this.add.image(x * TILE_SIZE, y * TILE_SIZE, 'soil').setOrigin(0);
      tile.setInteractive();
      tile.on('pointerdown', () => this.plantarOuColher(x, y));

      this.tiles.push({ x, y, tile, planted: false });
    }
  }
}

function update() {
  const now = Date.now();
  for (let coord in this.growing) {
    const data = this.growing[coord];

    if (!data.ready && now - data.plantedAt >= 10000) {
      data.ready = true;
      const [x, y] = coord.split(',').map(Number);
      const tile = this.tiles.find(t => t.x === x && t.y === y);

      tile.crop = this.add.image(
        x * TILE_SIZE + TILE_SIZE / 2,
        y * TILE_SIZE + TILE_SIZE / 2,
        'wheat'
      ).setDisplaySize(64, 64).setOrigin(0.5);
    }
  }
}
