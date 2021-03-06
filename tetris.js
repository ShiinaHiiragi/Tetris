// tetris.js: JavaScript and Node.JS enviornment
const fs = require("fs");

// Setting: data that can be changed by user
var Setting = fs.readFileSync("src/code/setting.json");
Setting = JSON.parse(Setting);

// System: important logic data, which cannot be changed by user
var System =
{
  pieces:
    [
      null,
      [[[1, 0], [1, -1], [0, -1]], [[0, -1], [-1, -1], [-1, 0]],
        [[-1, 0], [-1, 1], [0, 1]], [[0, 1], [1, 1], [1, 0]]],
      [[[0, 1], [0, -1], [-1, 1]], [[1, 0], [-1, 0], [1, 1]],
        [[0, -1], [0, 1], [1, -1]], [[-1, 0], [1, 0], [-1, -1]]],
      [[[0, 1], [0, -1], [-1, -1]], [[1, 0], [-1, 0], [-1, 1]],
        [[0, -1], [0, 1], [1, 1]], [[-1, 0], [1, 0], [1, -1]]],
      [[[0, 1], [0, -1], [-1, 0]], [[1, 0], [-1, 0], [0, 1]],
        [[0, -1], [0, 1], [1, 0]], [[-1, 0], [1, 0], [0, -1]]],
      [[[0, -1], [-1, 0], [-1, 1]], [[-1, 0], [0, 1], [1, 1]],
        [[0, 1], [1, 0], [1, -1]], [[1, 0], [0, -1], [-1, -1]]],
      [[[0, 1], [-1, -1], [-1, 0]], [[1, 0], [-1, 1], [0, 1]],
        [[0, -1], [1, 1], [1, 0]], [[-1, 0], [1, -1], [0, -1]]],
      [[[0, 1], [0, -1], [0, -2]], [[1, 0], [-1, 0], [-2, 0]],
        [[0, -1], [0, 1], [0, 2]], [[-1, 0], [1, 0], [2, 0]]]
    ],
  // kickWall = [I_clock, I_counter, JLSTZ_clock, JLSTZ_counter]
  kickWall:
  [
    [[[0, 1], [0, -2], [2, 1], [-1, -2]], [[0, -2], [0, 1], [1, -2], [-2, 1]],
      [[0, -1], [0, 2], [-2, -1], [1, 2]], [[0, 2], [0, -1], [-1, 2], [2, -1]]],
    [[[0, 2], [0, -1], [-1, 2], [2, -1]], [[0, 1], [0, -2], [2, 1], [-1, -2]],
      [[0, -2], [0, 1], [1, -2], [-2, 1]], [[0, -1], [0, 2], [-2, -1], [1, 2]]],
    [[[0, -1], [1, -1], [-2, 0], [-2, -1]], [[0, -1], [-1, -1], [2, 0], [2, -1]],
      [[0, 1], [1, 1], [-2, 0], [-2, 1]], [[0, 1], [-1, 1], [2, 0], [2, 1]]],
    [[[0, 1], [1, 1], [-2, 0], [-2, 1]], [[0, -1], [-1, -1], [2, 0], [2, -1]],
      [[0, -1], [1, -1], [-2, 0], [-2, -1]], [[0, 1], [-1, 1], [2, 0], [2, 1]]]
  ],
  // type: 1 ~ 7; O, L, J, T, S, Z, I
  sidePieces:
  [
    null, [6, 7, 8, 9], [2, 3, 4, 5], [0, 3, 4, 5],
    [1, 3, 4, 5], [1, 2, 3, 4], [0, 1, 4, 5], [10, 11, 12, 13]
  ],
  align: [[1, 0], [0, -1], [-1, 0], [0, 1], [1, 0], [0, -1]],
  positionInit: [null, [2, 5], [3, 4], [3, 4], [3, 4], [3, 4], [3, 4], [3, 5]],
  cellEachLine: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  accord: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ranking: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  sideCount: [6, 4, 4],
  holdPiece: ["hold-piece-other", "hold-piece-o", "hold-piece-i"],
  bgmList: [null, "classic.mp3", "piano.mp3", "t99.mp3",
            "t99_50.mp3", "t99_chip.mp3", "ppt_folk.mp3", "ppt_swap.mp3"],
  seList: ["b2b.mp3", "click.mp3", "count.mp3", "erase.mp3",
           "fail.mp3", "hold.mp3", "hover.mp3", "nil.mp3",
           "normal.mp3", "put.mp3", "special.mp3", "start.mp3",
           "success.mp3"],
  infoList: [null, "Tetris", "T-Spin Mini", "T-Spin Single",
             "T-Spin Double", "T-Spin Triple", "Prevented: Locking Down"],
  allowChange: true,
  lastSpin: false,
  lastSpecial: 0,
  perfectClear: false,
  gameStart: false,
  bgm: null,
  se: [],
  falldownClock: null,
  lockdownClock: null,
  comboClock: null,
  perfectClock: null,
  infoClock: null,
  timerClock: null,
  firstBag: null,
  secondBag: null,
  shuffle: null,
  shufflePointer: 0,
  shuffleInit: function ()
  {
    this.shufflePointer = 0;
    this.firstBag = [1, 2, 3, 4, 5, 6, 7].sort(() => { return 0.5 - Math.random(); });
    this.secondBag = [1, 2, 3, 4, 5, 6, 7].sort(() => { return 0.5 - Math.random(); });
    this.shuffle = this.firstBag.concat(this.secondBag);
  },
  shuffleRefresh: function()
  {
    this.shufflePointer = 0;
    this.firstBag = this.secondBag;
    this.secondBag = null;
    this.secondBag = [1, 2, 3, 4, 5, 6, 7].sort(() => { return 0.5 - Math.random(); });
    this.shuffle = this.firstBag.concat(this.secondBag);
  },
  loadBGM: function()
  {
    if (Setting.bgm > 0)
    {
      this.bgm = document.createElement("audio");
      this.bgm.src = "src/bgm/" + this.bgmList[Setting.bgm];
      this.bgm.volume = 0.5;
      this.bgm.loop = true;
      this.bgm.play();
    }
  },
  loadSE: function()
  {
    for (var index = 0; index < this.seList.length; index += 1)
    {
      this.se.push(document.createElement("audio"));
      this.se[index].src = "src/se/" + this.seList[index];
      this.se[index].load();
    }
  },
  asyncTimer: function(delay, execute)
  {
    return new Promise(function (resolve)
    {
      setTimeout(function ()
      {
        execute();
        resolve();
      }, delay);
    });
  },
  gameOver: function(message, success)
  {
    if (Setting.bgm > 0) this.bgm.pause();
    if (success) System.se[12].cloneNode().play();
    else System.se[4].cloneNode().play();
    System.timerClock = window.clearInterval(System.timerClock);
    document.removeEventListener('keydown', Game.keyboardEvent);
    document.addEventListener('keydown', Game.lastKeyboardEvent);
    if (this.falldownClock != undefined)
      this.falldownClock = window.clearTimeout(this.falldownClock);
    if (this.lockdownClock != undefined)
      this.lockdownClock = window.clearTimeout(this.lockdownClock);
    Cite.rankingTitle.innerText = message;
    for (var index = 0; index < 15; index += 1)
      Cite.rankingRecord.rows[index].cells[1].innerText = System.ranking[index].toString();
    Cite.rankingPanel.style.display = "block";
  },
  printTimer: function(panel, cite)
  {
    if (panel < 10) cite.innerText = "0" + panel.toString();
    else cite.innerText = panel.toString();
  },
  refreshTimer: function()
  {
    Panel.second += 1;
    if (Panel.second == 60) Panel.second = 0, Panel.minute += 1;
    if (Panel.minute == 60) Panel.minute = 0, Panel.hour += 1;
    System.printTimer(Panel.second, Cite.second);
    System.printTimer(Panel.minute, Cite.minute);
    System.printTimer(Panel.hour, Cite.hour);
  },
  printCombo: function()
  {
    if (System.comboClock != undefined)
      System.comboClock = window.clearTimeout(System.comboClock);
    Cite.combo.innerText = "Combo\n" + Panel.combo.toString();
    System.comboClock = window.setTimeout(function()
    {
      System.comboClock = window.clearTimeout(System.comboClock);
      Cite.combo.innerText = "";
    }, Setting.infoTime);
  },
  printPerfect: function()
  {
    if (System.perfectClock != undefined)
      System.perfectClock = window.clearTimeout(System.perfectClock);
    Cite.perfectClear.innerText = "Perfect Clear";
    System.perfectClock = window.setTimeout(function()
    {
      System.perfectClock = window.clearTimeout(System.perfectClock);
      Cite.perfectClear.innerText = "";
    }, Setting.infoTime);
  },
  printInfo: function(message, b2b)
  {
    if (System.infoClock != undefined)
    System.infoClock = window.clearTimeout(System.infoClock);
    Cite.tinfo.innerText = (b2b ? "B2B " : "") + System.infoList[message];
    Cite.info.style.display = "block";
    System.infoClock = window.setTimeout(function()
    {
      System.infoClock = window.clearTimeout(System.infoClock);
      Cite.tinfo.innerText = "";
      Cite.info.style.display = "none";
    }, Setting.infoTime);
  },
  countDown: async function()
  {
    await System.asyncTimer(Setting.countDown, () => 
    {
      System.se[2].cloneNode().play();
      Cite.tinfo.innerText = "3";
    });
    await System.asyncTimer(Setting.countDown, () => 
    {
      System.se[2].cloneNode().play();
      Cite.tinfo.innerText = "2";
    });
    await System.asyncTimer(Setting.countDown, () => 
    {
      System.se[2].cloneNode().play();
      Cite.tinfo.innerText = "1";
    });
    await System.asyncTimer(Setting.countDown, () =>
    {
      initialize();
      System.se[11].cloneNode().play();
      Cite.tinfo.innerText = "Start";
    });
    await System.asyncTimer(Setting.countDown, () =>
    {
      Cite.tinfo.innerText = "";
      Cite.info.style.display = "none";
    });
  },
  countBlock: function()
  {
    var res = 0;
    var xIndex = Pieces.last.position[0], yIndex = Pieces.last.position[1];
    [1, -1].forEach((xOffset) =>
    {
      [1, -1].forEach((yOffset) =>
      {
        if ((xIndex + xOffset >= 0) && (xIndex + xOffset <= 23) &&
            (yIndex + yOffset >= 0) && (yIndex + yOffset <= 9) &&
            Panel.cells[xIndex + xOffset][yIndex + yOffset])
          res += 1;
      });
    });
    return res;
  },
  specialJudge: function(eraseLine)
  {
    // [No, Tetris, TSM, TSS, TSD, TST]
    if (Pieces.last.type == 4 && System.lastSpin && System.countBlock() > 2)
      return Math.min(5, 2 + eraseLine);
    else if (eraseLine > 3) return 1;
    else return 0;
  },
  countScore: function(eraseLine, thisSpecial)
  {
    var score = eraseLine;
    switch (thisSpecial)
    {
      case 1: score += 4; break;
      case 2: score += 0; break;
      case 3: score += 2; break;
      case 4: score += 4; break;
      case 5: score += 6; break;
      default:
        switch (eraseLine)
        {
          case 0: score += 0; break;
          case 1: score += 0; break;
          case 2: score += 1; break;
          case 3: score += 2; break;
        }
        break;
    }
    if (System.lastSpecial && thisSpecial) score += 1;
    if (System.perfectClear) score += 10, System.ranking[14] += 1;
    if (Panel.combo > System.ranking[0]) System.ranking[0] = Panel.combo;
    if (Panel.combo < 2) score += 0;
    else if (Panel.combo < 4) score += 1;
    else if (Panel.combo < 6) score += 2;
    else if (Panel.combo < 8) score += 3;
    else if (Panel.combo < 11) score += 4;
    else score += 5;
    // getting ranking data
    if (thisSpecial)
      System.ranking[thisSpecial + 3 + (System.lastSpecial ? 5 : 0)] += 1;
    else if (eraseLine)
      System.ranking[eraseLine] += 1;
    return score;
  },
  setColor: function(event, element)
  {
    if (System.lockdownClock == undefined)
    {
      if (System.gameStart) Pieces.preview.draw(false, false, false);
      var offset = 0, bias = 1, str = element.id.split("-");
      var xIndex = Number(str[1]) + 4, yIndex = Number(str[2]);
      var rawIndex = Panel.cells[xIndex][yIndex];
      if (event.button == 0) offset = 1;
      else if (event.button == 1) offset = (rawIndex ? 8 - rawIndex : 1);
      else offset = 7;
      var colorIndex = (Panel.cells[xIndex][yIndex] = (rawIndex + offset) % 8);
      if (colorIndex && !rawIndex) System.cellEachLine[xIndex] += 1;
      else if (!colorIndex && rawIndex) System.cellEachLine[xIndex] -= 1;
      element.style.backgroundColor = Setting.color[colorIndex];
      if (System.gameStart)
      {
        while (Pieces.next.shift(Pieces.previewNext, [bias, 0])) bias += 1;
        Pieces.next.shift(Pieces.previewNext, [bias - 1, 0]);
        Pieces.previewNext.draw(true, false, true);
        Pieces.preview.copy(Pieces.previewNext);
        Pieces.now.draw(true, false, false);
      }
    }
    else System.printInfo(6, false);
  }
}
System.loadSE();
System.se[7].cloneNode().play();

// Cite: the element in the HTML DOM
var Cite =
{
  field: document.getElementById("field"),
  hour: document.getElementById("hour"),
  minute: document.getElementById("minute"),
  second: document.getElementById("second"),
  line: document.getElementById("line"),
  score: document.getElementById("score"),
  info: document.getElementById("info"),
  tinfo: document.getElementById("tinfo"),
  combo: document.getElementById("combo"),
  rightSide: document.getElementById("right-side"),
  perfectClear: document.getElementById("perfect-clear"),
  debugButton: document.getElementById("debug-button"),
  rankingPanel: document.getElementById("ranking-panel"),
  rankingTitle: document.getElementById("ranking-title"),
  rankingRecord: document.getElementById("ranking-record"),
  rankingButton: document.getElementById("ranking-button"),
  pausePanel: document.getElementById("pause-panel"),
  pauseMenu: document.getElementById("pause-menu"),
  pauseText: document.getElementById("pause-title"),
  // button: Start, Continue, Retry, Back to Menu
  spawnButton: function(self, type)
  {
    var newButton = document.createElement("button");
    newButton.className = "ui basic button";
    newButton.style.borderRadius = "0";
    newButton.style.fontSize = "2.4vh";
    newButton.style.setProperty("color", "rgba(255, 255, 255, 0.8)", "important");
    switch (type)
    {
      case 1:
        newButton.innerText = "Start";
        newButton.setAttribute("onclick", "initialize()");
        break;
      case 2:
        newButton.innerText = "Continue";
        newButton.setAttribute("onclick", "Game.continue()");
        break;
      case 3:
        newButton.innerText = "Retry";
        newButton.setAttribute("onclick", "location.reload()");
        break;
      case 4:
        newButton.innerText = "Back to Menu";
        newButton.setAttribute("onclick", "document.location.href='menu.html'");
        break;
    }
    self.append(newButton);
  },
  // cells: a two-dimension array citing the 10 × 20 grid
  cells: new Array(20),
  sides: new Array(7)
}
document.body.style.backgroundImage = `url('${Setting.bg}')`;
document.body.style.backgroundSize = "cover";
for (var index = 0; index < 20; index += 1)
  Cite.cells[index] = new Array(10).fill(null);
for (var index = 0; index < 7; index += 1)
  Cite.sides[index] = new Array(14).fill(null);
// add button in the game
var eachOne = [2, 3, 4];
[1, 4].forEach((type) => { Cite.spawnButton(Cite.debugButton, type); });
eachOne.forEach((type) => { Cite.spawnButton(Cite.pauseMenu, type); });
[3, 4].forEach((type) => { Cite.spawnButton(Cite.rankingButton, type); });
Cite.debugButton.childNodes[0].style.borderRightWidth = "0.8px";
Cite.debugButton.childNodes[1].style.borderLeftWidth = "0.8px";
// process the raw element in the DOM
for (var index = 0; index < 20; index += 1)
  for (var subIndex = 0; subIndex < 10; subIndex += 1)
  {
    Cite.cells[index][subIndex] = document.createElement("div");
    Cite.cells[index][subIndex].className = "cell";
    Cite.cells[index][subIndex].id = "cell-" + index.toString() + "-" + subIndex.toString();
    if (Setting.debugMode)
      Cite.cells[index][subIndex].setAttribute("onmousedown", "System.setColor(event, this)");
    Cite.field.append(Cite.cells[index][subIndex]);
  }
Cite.rightSide.style.border = "1.6px solid rgb(255, 255, 255)";
Cite.rightSide.style.borderLeftWidth = "0.6px";
for (var index = 1; index <= 6; index += 1)
{
  var newDiv = document.createElement("div");
  newDiv.className = "next";
  newDiv.id = "show-" + index.toString();
  newDiv.style.top = (12 * (index - 1) + 8).toString() + "vh";
  Cite.rightSide.append(newDiv);
}
for (var parentIndex = 0; parentIndex < 7; parentIndex += 1)
{
  var tempPointer = 0;
  var showIndex = document.getElementById("show-" + parentIndex.toString());
  for (var index = 0; index < 3; index += 1)
  {
    var showTag = document.createElement("div");
    showTag.className = System.holdPiece[index];
    for (var subIndex = 0; subIndex < System.sideCount[index]; subIndex += 1)
    {
      Cite.sides[parentIndex][tempPointer] = document.createElement("div");
      Cite.sides[parentIndex][tempPointer].className = "hold-cell";
      showTag.append(Cite.sides[parentIndex][tempPointer++]);
    }
    showIndex.append(showTag);
  }
}

// Panel: The cell and the data of Tetris
var Panel = {
  cells: new Array(24), hold: 0, 
  score: 0, line: 0, combo: 0,
  hour: 0, minute: 0, second: 0
}
// process raw panel data
for (var index = 0; index < 24; index += 1)
  Panel.cells[index] = new Array(10).fill(0);

// Piece: The block available for manipupating
class Piece
{
  constructor(pos, type, direct)
  {
    // the position of top left corner is [4, 0]
    this.position = pos;
    // type: 1 ~ 7; O, L, J, T, S, Z, I
    this.type = type;
    // direction: 0 ~ 3
    this.direction = direct;
  }

  init(index, saveLast)
  {
    if (saveLast) Pieces.last.copy(this);
    this.type = index;
    this.direction = 0;
    this.position = [System.positionInit[index][0], System.positionInit[index][1]];
    return this.check();
  }

  copy(right)
  {
    this.position = [right.position[0], right.position[1]];
    this.type = right.type;
    this.direction = right.direction;
  }

  // draw the piece on the panel and the array
  // clear: true: print, false: clear
  // heap: true: solid, false: not solid
  draw(clear, heap, transparent)
  {
    var high = true;
    var center = [this.position[0] - 4, this.position[1]];
    var bias = System.pieces[this.type][this.direction];
    if (center[0] >= 0)
    {
      Cite.cells[center[0]][center[1]].style.backgroundColor = Setting.color[clear ? this.type : 0];
      if (transparent) Cite.cells[center[0]][center[1]].style.opacity = "0.5";
      else Cite.cells[center[0]][center[1]].style.opacity = "1";
      high = false;
    }
    Panel.cells[center[0] + 4][center[1]] = (clear && heap ? this.type : 0);
    if (heap) System.cellEachLine[center[0] + 4] += 1;
    for (var index = 0; index < 3; index += 1)
    {
      var bias = System.pieces[this.type][this.direction][index];
      Panel.cells[center[0] + bias[0] + 4][center[1] + bias[1]] = (clear && heap ? this.type : 0);
      if (heap) System.cellEachLine[center[0] + bias[0] + 4] += 1;
      if (center[0] + bias[0] >= 0)
      {
        Cite.cells[center[0] + bias[0]][center[1] + bias[1]].style.backgroundColor =
          Setting.color[clear ? this.type : 0];
        if (transparent) Cite.cells[center[0] + bias[0]][center[1] + bias[1]].style.opacity = "0.5";
        else Cite.cells[center[0] + bias[0]][center[1] + bias[1]].style.opacity = "1";
        high = false;
      }
    }
    return high;
  }

  // check if there is any collision
  // out of the panel or existed pieces
  check()
  {
    var center = [this.position[0] - 4, this.position[1]];
    var bias = System.pieces[this.type][this.direction];
    if (center[0] < -4 || center[0] > 19 || center[1] < 0 || center[1] > 9) return false;
    if (Panel.cells[center[0] + 4][center[1]]) return false;
    for (var index = 0; index < 3; index += 1)
    {
      var bias = System.pieces[this.type][this.direction][index];
      if (center[0] + bias[0] < -4 || center[0] + bias[0] > 19 ||
        center[1] + bias[1] < 0 || center[1] + bias[1] > 9) return false;
      if (Panel.cells[center[0] + bias[0] + 4][center[1] + bias[1]]) return false;
    }
    return true;
  }

  // pos: a bias array (down: [1, 0])
  shift(next, pos)
  {
    next.position = [this.position[0] + pos[0], this.position[1] + pos[1]];
    next.type = this.type;
    next.direction = this.direction;
    return next.check();
  }

  // direct: 1(90) / 2(180) / 3(-90)
  // right: true: clockwise, false: counterclockwise
  rotate(next, direct, right)
  {
    var kickType = null;
    next.position = [this.position[0], this.position[1]];
    next.type = this.type;
    next.direction = (this.direction + direct) % 4;
    if (this.type == 1 || this.type == 7)
      for (var index = 0; index < direct; index += 1)
      {
        next.position[0] += System.align[this.direction + index][0];
        next.position[1] += System.align[this.direction + index][1];
      }
    if (next.check()) return true;
    else if (this.type == 7) kickType = (right ? System.kickWall[0] : System.kickWall[1]);
    else kickType = (right ? System.kickWall[2] : System.kickWall[3]);
    for (var index = 0; index < 4; index += 1)
    {
      next.shift(Pieces.try, kickType[next.direction][index]);
      if (Pieces.try.check())
      {
        next.copy(Pieces.try);
        return true;
      }
    }
    return false;
  }
}
var Pieces =
{
  now: new Piece(), next: new Piece(), try: new Piece(),
  preview: new Piece(), previewNext: new Piece(), last: new Piece()
}

var Game =
{
  // clear: true: print, false: clear
  drawSide: function(pos, type, clear)
  {
    for (index = 0; index < 4; index += 1)
    {
      Cite.sides[pos][System.sidePieces[type][index]].style.backgroundColor = 
      (clear ? Setting.color[type] : "");
      Cite.sides[pos][System.sidePieces[type][index]].style.border =
      (clear ? "1px solid rgb(240, 240, 240)" : "");
    }
    return true;
  },
  chooseTimeInterval: function()
  {
    if (Pieces.now.shift(Pieces.next, [1, 0]))
      System.falldownClock = window.setTimeout(Game.falldownDelay, Setting.fallTime);
    else System.lockdownClock = window.setTimeout(Game.lockdownDelay, Setting.lockTime);
  },
  updatePieceNow: function ()
  {
    Pieces.now.draw(false, false, false);
    Pieces.next.draw(true, false, false);
    Pieces.now.copy(Pieces.next);
  },
  // mode: true: next, clear, false: Pieces.now, not clear
  updatePreviewNow: function(mode)
  {
    var bias = 1;
    if (mode)
    {
      while (Pieces.next.shift(Pieces.previewNext, [bias, 0])) bias += 1;
      Pieces.next.shift(Pieces.previewNext, [bias - 1, 0]);
      Pieces.preview.draw(false, false, false);
      Pieces.now.draw(false, false, false);
      Pieces.previewNext.draw(true, false, true);
      Pieces.next.draw(true, false, false);
      Pieces.preview.copy(Pieces.previewNext);
      Pieces.now.copy(Pieces.next);
    }
    else
    {
      while (Pieces.now.shift(Pieces.preview, [bias, 0])) bias += 1;
      Pieces.now.shift(Pieces.preview, [bias - 1, 0]);
      Pieces.preview.draw(true, false, true);
      Pieces.now.draw(true, false, false);
    }
  },
  updateLine: function()
  {
    for (var index = 23; index >= 0; index -= 1)
      if (index != System.accord[index] && System.accord[index] >= 0)
      {
        for (var subIndex = 0; subIndex < 10; subIndex += 1)
          Panel.cells[index][subIndex] = Panel.cells[System.accord[index]][subIndex];
        System.cellEachLine[index] = System.cellEachLine[System.accord[index]];
        if (index >= 4)
          for (var subIndex = 0; subIndex < 10; subIndex += 1)
            Cite.cells[index - 4][subIndex].style.backgroundColor =
            Setting.color[Panel.cells[System.accord[index]][subIndex]];
      }
      else if (index != System.accord[index])
      {
        for (var subIndex = 0; subIndex < 10; subIndex += 1)
          Panel.cells[index][subIndex] = 0;
        System.cellEachLine[index] = 0;
        if (index >= 4)
          for (var subIndex = 0; subIndex < 10; subIndex += 1)
            Cite.cells[index - 4][subIndex].style.backgroundColor = Setting.color[0];
      }
  },
  keyboardEvent: function(event)
  {
    if (event.keyCode == Setting.keyDownCode.leftQuarter ||
        event.keyCode == Setting.keyDownCode.leftHalf ||
        event.keyCode == Setting.keyDownCode.rightHalf ||
        event.keyCode == Setting.keyDownCode.rightQuarter)
    {
      // used for judging T-Spin
      System.lastSpin = true;
      // reset lockdownClock
      if (System.falldownClock == undefined)
      {
        System.lockdownClock = window.clearTimeout(System.lockdownClock);
        Game.chooseTimeInterval();
      }
      var second;
      if (event.keyCode == Setting.keyDownCode.rightQuarter) second = 1;
      else if (event.keyCode == Setting.keyDownCode.leftQuarter) second = 3;
      else second = 2;
      var third = (event.keyCode == Setting.keyDownCode.rightHalf ||
                  event.keyCode == Setting.keyDownCode.rightQuarter);
      if (Pieces.now.rotate(Pieces.next, second, third))
      {
        Game.updatePreviewNow(true);
        System.se[8].cloneNode().play();
      }
    }
    else if (event.keyCode == Setting.keyDownCode.left ||
            event.keyCode == Setting.keyDownCode.right)
    {
      System.lastSpin = false;
      if (System.falldownClock == undefined)
      {
        System.lockdownClock = window.clearTimeout(System.lockdownClock);
        Game.chooseTimeInterval();
      }
      if (Pieces.now.shift(Pieces.next, [0, (event.keyCode == Setting.keyDownCode.left ? -1 : 1)]))
      {
        Game.updatePreviewNow(true);
        System.se[8].cloneNode().play();
      }
    }
    else if (event.keyCode == Setting.keyDownCode.hold ||
            event.keyCode == Setting.keyDownCode.softDrop ||
            event.keyCode == Setting.keyDownCode.hardDrop)
    {
      System.lastSpin = false;
      if (event.keyCode == Setting.keyDownCode.softDrop && Pieces.now.shift(Pieces.next, [1, 0]))
      {
        Game.updatePieceNow();
        if (System.falldownClock != undefined)
        {
          System.falldownClock = window.clearTimeout(System.falldownClock);
          Game.chooseTimeInterval();
        }
      }
      else if (event.keyCode == Setting.keyDownCode.hardDrop)
      {
        Pieces.next.copy(Pieces.preview);
        Game.updatePieceNow();
        System.falldownClock = window.clearInterval(System.falldownClock);
        Game.lockdownDelay();
      }
      else if (event.keyCode == Setting.keyDownCode.hold && System.allowChange)
      {
        System.allowChange = false;
        Pieces.now.draw(false, false, false);
        if (System.falldownClock != undefined)
            System.falldownClock = window.clearTimeout(System.falldownClock);
        if (System.lockdownClock != undefined)
          System.lockdownClock = window.clearTimeout(System.lockdownClock);
        if (Panel.hold)
        {
          // Piece.now.type  Panel.hold
          var tempNow = Pieces.now.type;
          Game.drawSide(0, Panel.hold, false);
          Game.drawSide(0, Pieces.now.type, true);
          if (Pieces.now.init(Panel.hold, false))
          {
            Pieces.preview.draw(false, false, false);
            Game.updatePreviewNow(false);
            Game.chooseTimeInterval();
          }
          Panel.hold = tempNow;
        }
        else
        {
          Game.drawSide(0, Pieces.now.type, true);
          Panel.hold = Pieces.now.type;
          if (Pieces.now.init(System.shuffle[++System.shufflePointer], false))
          {
            Pieces.preview.draw(false, false, false);
            Game.updatePreviewNow(false);
            Game.chooseTimeInterval();
            for (var index = 1; index <= 6; index += 1)
            {
              Game.drawSide(index, System.shuffle[System.shufflePointer + index - 1], false);
              Game.drawSide(index, System.shuffle[System.shufflePointer + index], true);
            }
            if (System.shufflePointer == 7) System.shuffleRefresh();
          }
        }
        System.se[5].cloneNode().play();
      }
    }
    // if ESC is pressed
    else if (event.keyCode == 27)
    {
      Cite.pausePanel.style.display = "block";
      if (Setting.bgm > 0) System.bgm.pause();
      document.removeEventListener('keydown', Game.keyboardEvent);
      document.addEventListener('keydown', Game.pauseKeyboardEvent);
      System.timerClock = window.clearInterval(System.timerClock);
      if (System.falldownClock != undefined)
        System.falldownClock = window.clearTimeout(System.falldownClock);
      if (System.lockdownClock != undefined)
        System.lockdownClock = window.clearTimeout(System.lockdownClock);
    }
  },
  continue: function()
  {
    Cite.pausePanel.style.display = "none";
    if (Setting.bgm > 0) System.bgm.play();
    document.removeEventListener('keydown', Game.pauseKeyboardEvent);
    document.addEventListener('keydown', Game.keyboardEvent);
    Game.chooseTimeInterval();
  },
  pauseKeyboardEvent: function() { if (event.keyCode == 27) Game.continue(); },
  lastKeyboardEvent: function() { if (event.keyCode == 27) document.location.href='menu.html'; },
  falldownDelay: function()
  {
    System.falldownClock = window.clearTimeout(System.falldownClock);
    if (Pieces.now.shift(Pieces.next, [1, 0]))
    {
      Game.updatePieceNow();
      Game.chooseTimeInterval();
    }
    else System.lockdownClock = window.setTimeout(Game.lockdownDelay, Setting.lockTime);
  },
  lockdownDelay: function()
  {
    System.lockdownClock = window.clearTimeout(System.lockdownClock);
    if (Pieces.now.shift(Pieces.next, [1, 0]))
    {
      Game.updatePieceNow();
      Game.chooseTimeInterval();
    }
    else if (Pieces.now.draw(true, true, false)) System.gameOver("LOCK OUT", false);
    else if (Pieces.now.init(System.shuffle[++System.shufflePointer], true))
    {
      var sum = 0, ptr = 23, fullLine = new Array(), thisSpecial;
      for (var index = 0; index < 24; index += 1)
      {
        sum += System.cellEachLine[index];
        if (System.cellEachLine[index] == 10) fullLine.push(index);
      }
      System.perfectClear = (sum == fullLine.length * 10);
      if (fullLine.length)
      {
        Panel.combo += 1;
        if (Panel.combo > 1) System.printCombo();
        if (Setting.sprintMode) Panel.line -= fullLine.length;
        else Panel.line += fullLine.length;
        Cite.line.innerText = Panel.line.toString();
      }
      else Panel.combo = 0;
      if (System.perfectClear) System.printPerfect();
      thisSpecial = System.specialJudge(fullLine.length);
      if (fullLine.length && thisSpecial && System.lastSpecial) System.se[0].cloneNode().play();
      else if (fullLine.length && thisSpecial) System.se[10].cloneNode().play();
      else if (fullLine.length) System.se[3].cloneNode().play();
      else System.se[9].cloneNode().play();
      if (thisSpecial) System.printInfo(thisSpecial, System.lastSpecial);
      Panel.score += System.countScore(fullLine.length, thisSpecial);
      Cite.score.innerText = Panel.score.toString();
      if (fullLine.length || thisSpecial) System.lastSpecial = thisSpecial;
      // erase the full lines
      for (var index = 23; index >= 0; index -= 1, ptr -= 1)
      {
        while (fullLine.includes(ptr)) ptr -= 1;
        System.accord[index] = ptr;
      }
      Game.updateLine();
      Game.updatePreviewNow(false);
      System.allowChange = true;
      Game.chooseTimeInterval();
      for (var index = 1; index <= 6; index += 1)
      {
        Game.drawSide(index, System.shuffle[System.shufflePointer + index - 1], false);
        Game.drawSide(index, System.shuffle[System.shufflePointer + index], true);
      }
      if (System.shufflePointer == 7) System.shuffleRefresh();
      if (Setting.sprintMode && Panel.line <= 0) System.gameOver("ACCOMPLISHED", true);
    }
    else System.gameOver("BLOCK OUT", false);
  }
};
System.shuffleInit();
Cite.pausePanel.style.display = "none";
Cite.pauseText.innerHTML = "Pause";
if (Setting.sprintMode)
{
  Panel.line = Setting.sprintLine;
  Cite.line.innerText = Setting.sprintLine.toString();
}
Pieces.now.init(System.shuffle[System.shufflePointer], false);
document.oncontextmenu = function(event) { event.preventDefault(); };

if (Setting.debugMode) Cite.info.style.display = "none";
else
{
  Cite.debugButton.style.display = "none";
  Cite.tinfo.innerText = "Ready";
  window.setTimeout(System.countDown, Setting.countDown);
}

function initialize()
{
  if (Setting.debugMode) Cite.debugButton.style.display = "none";
  System.gameStart = true;
  System.loadBGM();
  Game.updatePreviewNow(false);
  for (var index = 1; index <= 6; index += 1)
    Game.drawSide(index, System.shuffle[System.shufflePointer + index], true);
  Game.chooseTimeInterval();
  System.timerClock = window.setInterval(System.refreshTimer, 1000); 
  document.addEventListener('keydown', Game.keyboardEvent);
}

// jQuery: add button hover SE
$(document).ready(function()
{
  $("button.ui.basic.button").mouseover(function() {
    System.se[6].cloneNode().play();
  });
});