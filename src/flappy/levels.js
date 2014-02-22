/*jshint multistr: true */

// todo - i think our prepoluated code counts as LOCs

var Direction = require('./tiles').Direction;

var tb = function(blocks) {
  return '<xml id="toolbox" style="displastartY: none;">' + blocks + '</xml>';
};

var category = function (name, blocks) {
  return '<category id="' + name + '" name="' + name + '">' + blocks + '</category>';
};

var flapBlock = '<block type="flappy_flap"></block>';
var flapHeightBlock = '<block type="flappy_flap_height"></block>';
var endGameBlock = '<block type="flappy_endGame"></block>';
var playSoundBlock =  '<block type="flappy_playSound"></block>';
var incrementScoreBlock = '<block type="flappy_incrementPlayerScore"></block>';

var setSpeedBlock = '<block type="flappy_setSpeed"></block>';
var setBackgroundBlock = '<block type="flappy_setBackground"></block>';
var setGapHeightBlock = '<block type="flappy_setGapHeight"></block>';
var setPlayerBlock = '<block type="flappy_setPlayer"></block>';
var setObstacleBlock = '<block type="flappy_setObstacle"></block>';
var setGroundBlock = '<block type="flappy_setGround"></block>';

var COL_WIDTH = 240;
var COL1 = 20;
var COL2 = 20 + COL_WIDTH;

var ROW_HEIGHT = 120;
var ROW1 = 20;
var ROW2 = ROW1 + ROW_HEIGHT;
var ROW3 = ROW2 + ROW_HEIGHT;

var CATEGORY_BUFFER = 0;

var eventBlock = function (type, x, y, child) {
  return '<block type="' + type + '" deletable="false"' +
    ' x="' + x + '"' +
    ' y="' + y + '">' +
    (child ? '<next>' + child + '</next>' : '') +
    '</block>';
};

/*
 * Configuration for all levels.
 */

module.exports = {
  '1': {
    'requiredBlocks': [
      [{'test': 'flap', 'type': 'flappy_flap'}]
    ],
    'obstacles': false,
    'ground': false,
    'defaultSpeed': 0,
    'score': false,
    'infoText': true,
    'freePlay': false,
    'tickLimit': 80,
    // top/left coordinate of goal (better would be if we gave center)
    'goal': {
      startX  : 100,
      startY: 0,
      validation: function () {
        return (Flappy.avatarY  <= 20);
      }
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb(flapBlock + playSoundBlock),
    'startBlocks':
      eventBlock('flappy_whenClick', COL1, ROW1)
  },

  '2': {
    'requiredBlocks': [
      [{'test': 'endGame', 'type': 'flappy_endGame'}]
    ],
    'obstacles': false,
    'ground': true,
    'defaultSpeed': 0,
    'score': false,
    'infoText': true,
    'freePlay': false,
    'tickLimit': 80, // how long it takes to fly just past first obstacle
    'goal': {
      startX: 100,
      startY: 400 - 48 - 56 / 2,
      validation: function () {
        // this only happens after avatar hits ground, and we spin him because of
        // game over
        return (Flappy.avatarY  === 322 && Flappy.avatarX === 110);
      }
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb(flapBlock + endGameBlock + playSoundBlock),
    'startBlocks':
      eventBlock('flappy_whenClick', COL1, ROW1, flapBlock) +
      eventBlock('flappy_whenCollideGround', COL1, ROW2)
  },

  '3': {
    'requiredBlocks': [
      [{'test': 'setSpeed', 'type': 'flappy_setSpeed'}]
    ],
    'obstacles': false,
    'ground': true,
    'defaultSpeed': 0,
    'score': false,
    'infoText': true,
    'freePlay': false,
    'tickLimit': 80, // todo - think about this
    'goal': {
      startX: 400 - 55,
      startY: 0,
      moving: true,
      validation: function () {
        var avatarCenter = {
          x: (Flappy.avatarX + Flappy.AVATAR_WIDTH) / 2,
          y: (Flappy.avatarY + Flappy.AVATAR_HEIGHT) / 2
        };
        var goalCenter = {
          x: (Flappy.goalX + Flappy.GOAL_SIZE) / 2,
          y: (Flappy.goalY + Flappy.GOAL_SIZE) / 2
        };

        var diff = {
          x: Math.abs(avatarCenter.x - goalCenter.x),
          y: Math.abs(avatarCenter.y - goalCenter.y)
        };

        console.log("diff: " + diff.x + " " + diff.y);

        return diff.x < 15 && diff.y < 15;
      }
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb(flapBlock + playSoundBlock + setSpeedBlock),
    'startBlocks':
      eventBlock('flappy_whenClick', COL1, ROW1, flapBlock) +
      eventBlock('flappy_whenRunButtonClick', COL1, ROW2)
  },

  '4': {
    'requiredBlocks': [
      [{'test': 'endGame', 'type': 'flappy_endGame'}]
    ],
    'obstacles': true,
    'ground': true,
    'defaultSpeed': 0,
    'score': false,
    'infoText': true,
    'freePlay': false,
    'tickLimit': 140,
    'goal': {
      startX: 600 - (56 / 2),
      startY: 400 - 48 - 56 / 2,
      moving: true,
      validation: function () {
        return Flappy.obstacles[0].hitAvatar &&
          Flappy.gameState === Flappy.GameStates.OVER;
      }
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb(flapBlock + endGameBlock + playSoundBlock + setSpeedBlock),
    'startBlocks':
      eventBlock('flappy_whenClick', 20, 20, flapBlock) +
      eventBlock('flappy_whenRunButtonClick', COL1, ROW2, setSpeedBlock) +
      eventBlock('flappy_whenCollideObstacle', COL2, ROW2)
  },

  '5': {
    'requiredBlocks': [
      [{'test': 'incrementPlayerScore', 'type': 'flappy_incrementPlayerScore'}]
    ],
    'obstacles': true,
    'ground': true,
    'defaultSpeed': 0,
    'score': true,
    'infoText': true,
    'freePlay': false,
    'tickLimit': 140,
    'goal': {
      validation: function () {
        // avatar got into first obstacle and has score of 1
        return (Flappy.obstacles[0].x < Flappy.avatarX &&
          Flappy.playerScore === 1);
      }
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb(flapBlock + endGameBlock + incrementScoreBlock + playSoundBlock + setSpeedBlock),
    'startBlocks':
      eventBlock('flappy_whenClick', COL1, ROW1, flapBlock) +
      eventBlock('flappy_whenCollideGround', COL1, ROW2, endGameBlock) +
      eventBlock('flappy_whenCollideObstacle', COL2, ROW2, endGameBlock) +
      eventBlock('flappy_whenEnterObstacle', COL2, ROW1) +
      eventBlock('flappy_whenRunButtonClick', COL1, ROW3, setSpeedBlock)
  },

  '6': {
    'requiredBlocks': [
      [{'test': 'flap', 'type': 'flappy_flap_height'}]
    ],
    'obstacles': true,
    'ground': true,
    'defaultSpeed': 4,
    'score': true,
    'infoText': true,
    'freePlay': false,
    'tickLimit': 140,
    'goal': {
      validation: function () {
        // avatar got into first obstacle and has score of 1
        return (Flappy.obstacles[0].x < Flappy.avatarX &&
          Flappy.playerScore === 1);
      }
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb(flapHeightBlock + endGameBlock + incrementScoreBlock + playSoundBlock + setSpeedBlock),
    'startBlocks':
      eventBlock('flappy_whenClick', COL1, ROW1) +
      eventBlock('flappy_whenCollideGround', COL1, ROW2, endGameBlock) +
      eventBlock('flappy_whenCollideObstacle', COL2, ROW2, endGameBlock) +
      eventBlock('flappy_whenEnterObstacle', COL2, ROW1, incrementScoreBlock) +
      eventBlock('flappy_whenRunButtonClick', COL1, ROW3, setSpeedBlock)
  },

  '7': {
    'requiredBlocks': [
      [{'test': 'setBackground', 'type': 'flappy_setBackground'}]
    ],
    'obstacles': true,
    'ground': true,
    'defaultSpeed': 4,
    'score': true,
    'infoText': true,
    'freePlay': false,
    'goal': {
      validation: function () {
        return (Flappy.gameState === Flappy.GameStates.OVER);
      }
    },
    'scale': {
      'snapRadius': 2
    },
    'toolbox':
      tb(flapHeightBlock + endGameBlock + incrementScoreBlock + playSoundBlock +
        setSpeedBlock + setBackgroundBlock),
    'startBlocks':
      eventBlock('flappy_whenClick', COL1, ROW1, flapHeightBlock) +
      eventBlock('flappy_whenCollideGround', COL1, ROW2, endGameBlock) +
      eventBlock('flappy_whenCollideObstacle', COL2, ROW2, endGameBlock) +
      eventBlock('flappy_whenEnterObstacle', COL2, ROW1, incrementScoreBlock) +
      eventBlock('flappy_whenRunButtonClick', CATEGORY_BUFFER + COL1, ROW3)
  },

  '11': {
    'requiredBlocks': [
    ],
    'obstacles': true,
    'ground': true,
    'defaultSpeed': 4,
    'score': true,
    'infoText': true,
    'freePlay': true,
    'scale': {
      'snapRadius': 2
    },
    'freePlay': true,
    'toolbox':
      tb(
        flapHeightBlock +
        playSoundBlock +
        incrementScoreBlock +
        endGameBlock +
        setSpeedBlock +
        setGapHeightBlock +
        setBackgroundBlock +
        setPlayerBlock +
        setObstacleBlock +
        setGroundBlock
      ),
    'startBlocks':
      eventBlock('flappy_whenClick', CATEGORY_BUFFER + COL1, ROW1) +
      eventBlock('flappy_whenCollideGround', CATEGORY_BUFFER + COL1, ROW2) +
      eventBlock('flappy_whenCollideObstacle', CATEGORY_BUFFER + COL2, ROW2) +
      eventBlock('flappy_whenEnterObstacle', CATEGORY_BUFFER + COL2, ROW1) +
      eventBlock('flappy_whenRunButtonClick', CATEGORY_BUFFER + COL1, ROW3)
  }
};
