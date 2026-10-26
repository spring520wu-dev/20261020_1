// ==========================================
// 全域變數宣告
// ==========================================
let allQuestionsBank = []; // 儲存 15 題完整花朵題庫
let questions = [];        // 本次隨機抽出的 5 題資料
let options = [];          // 本次對應的 5 個可拖曳花名選項 (隨機打亂)
let confetti = [];         // 彩帶粒子陣列
let submitBtn;             // 交卷按鈕物件
let draggedOption = null;  // 當前拖曳中的選項
let offsetX = 0;           // 拖曳 X 偏移量
let offsetY = 0;           // 拖曳 Y 偏移量
let isSubmitted = false;   // 是否交卷標記
let score = 0;             // 成績總分
let showConfetti = false;  // 彩帶播放標記

// 動畫旋轉與閃爍變數 (讓繪製出的花朵圖像呈現流暢 GIF 效果)
let animAngle = 0;

// ==========================================
// 初始化設定 (Setup)
// ==========================================
function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);

  // 1. 初始化 15 題花朵題庫 (包含花朵特徵、名稱與動畫類型)
  initQuestionBank();

  // 2. 隨機抽出 5 題並洗牌選項
  drawRandomQuestions();

  // 3. 建立「交卷看成績」按鈕
  submitBtn = createButton('交卷看成績');
  submitBtn.style('font-size', '16px');
  submitBtn.style('font-weight', 'bold');
  submitBtn.style('padding', '10px 24px');
  submitBtn.style('background-color', '#2E7D32');
  submitBtn.style('color', '#FFFFFF');
  submitBtn.style('border-radius', '20px');
  submitBtn.style('border', 'none');
  submitBtn.style('cursor', 'pointer');
  submitBtn.style('box-shadow', '0 2px 5px rgba(0,0,0,0.2)');
  submitBtn.mousePressed(calculateScore);
  submitBtn.hide(); // 初始時隱藏

  // 4. 計算響應式佈局
  updateLayout();
}

// ==========================================
// 建立 15 題完整花朵題庫
// ==========================================
function initQuestionBank() {
  allQuestionsBank = [
    { title: "1. 太陽般綻放的花", correctAns: "向日葵", gifType: "sunflower" },
    { title: "2. 杯狀典雅的花", correctAns: "鬱金香", gifType: "tulip" },
    { title: "3. 粉嫩浪漫的花", correctAns: "櫻花", gifType: "sakura" },
    { title: "4. 熱情帶刺的花", correctAns: "玫瑰", gifType: "rose" },
    { title: "5. 純潔優雅的花", correctAns: "百合", gifType: "lily" },
    { title: "6. 紫色夢幻的花", correctAns: "薰衣草", gifType: "lavender" },
    { title: "7. 金黃小巧的花", correctAns: "油菜花", gifType: "sunflower" },
    { title: "8. 華麗高貴庭園花", correctAns: "牡丹", gifType: "rose" },
    { title: "9. 夏日盛開睡蓮", correctAns: "荷花", gifType: "lily" },
    { title: "10. 永恆愛情之花", correctAns: "紫羅蘭", gifType: "lavender" },
    { title: "11. 清香白色花朵", correctAns: "孤挺花", gifType: "tulip" },
    { title: "12. 淡淡清香小白花", correctAns: "茉莉", gifType: "sakura" },
    { title: "13. 金黃耀眼迎春花", correctAns: "黃馨", gifType: "sunflower" },
    { title: "14. 嬌豔紅山茶花", correctAns: "山茶花", gifType: "rose" },
    { title: "15. 浪漫紫色風信子", correctAns: "風信子", gifType: "lavender" }
  ];
}

// ==========================================
// 隨機抽 5 題與選項洗牌
// ==========================================
function drawRandomQuestions() {
  // 洗牌 15 題庫
  let tempBank = [...allQuestionsBank];
  for (let i = tempBank.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    let temp = tempBank[i];
    tempBank[i] = tempBank[j];
    tempBank[j] = temp;
  }

  // 擷取前 5 題
  let selected = tempBank.slice(0, 5);

  questions = [];
  let rawOptions = [];

  for (let i = 0; i < selected.length; i++) {
    questions.push({
      title: selected[i].title,
      correctAns: selected[i].correctAns,
      gifType: selected[i].gifType,
      placedAns: null,
      x: 0,
      y: 0,
      w: 0,
      h: 0
    });
    // 將 5 題的正解放進選項清單
    rawOptions.push(selected[i].correctAns);
  }

  // 洗牌選項順序
  rawOptions = shuffle(rawOptions);

  // 初始化選項物件
  options = [];
  for (let i = 0; i < rawOptions.length; i++) {
    options.push({
      text: rawOptions[i],
      x: 0,
      y: 0,
      homeX: 0,
      homeY: 0,
      w: 150,
      h: 40,
      isPlaced: false
    });
  }
}

// ==========================================
// 響應式佈局計算 (5 宮格排版)
// ==========================================
function updateLayout() {
  let topMargin = 75;
  let bottomHeight = 160;

  let gridWidth = width * 0.92;
  let gridHeight = height - topMargin - bottomHeight;

  let cardW = (gridWidth - 30) / 3;
  let cardH = (gridHeight - 15) / 2;

  // 計算 5 個題目卡片中心位置 (第一列 3 題，第二列 2 題置中)
  for (let i = 0; i < questions.length; i++) {
    let col, row, startX;
    if (i < 3) {
      col = i;
      row = 0;
      startX = (width - gridWidth) / 2 + cardW / 2;
    } else {
      col = i - 3;
      row = 1;
      startX = (width - gridWidth) / 2 + cardW / 2 + cardW / 2 + 10;
    }

    let startY = topMargin + cardH / 2;
    questions[i].x = startX + col * (cardW + 15);
    questions[i].y = startY + row * (cardH + 15);
    questions[i].w = cardW;
    questions[i].h = cardH;
  }

  // 設定底部備選答案區區域
  let areaW = gridWidth;
  let areaH = 115;
  let areaX = width / 2;
  let areaY = height - areaH / 2 - 15;

  let optW = min(cardW * 0.85, 150);
  let totalOptW = 5 * optW + 4 * 12;
  let startOptX = areaX - totalOptW / 2 + optW / 2;

  for (let i = 0; i < options.length; i++) {
    let optX = startOptX + i * (optW + 12);
    let optY = areaY + 5;

    options[i].w = optW;
    options[i].homeX = optX;
    options[i].homeY = optY;

    if (!options[i].isPlaced) {
      options[i].x = optX;
      options[i].y = optY;
    }
  }

  // 交卷按鈕位置
  if (submitBtn) {
    submitBtn.position(width / 2 + areaW / 2 - 150, areaY + areaH / 2 - 45);
  }
}

// ==========================================
// 視窗縮放監聽
// ==========================================
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateLayout();
}

// ==========================================
// 主繪圖迴圈 (Draw Loop)
// ==========================================
function draw() {
  // 淡背景色
  background(248, 243, 245);

  // 更新花朵動態動畫旋轉角度
  animAngle += 0.03;

  // 1. 繪製標題
  drawHeader();

  // 2. 繪製 5 個題目卡片與 GIF 動畫
  drawQuestionCards();

  // 3. 繪製備選區域與選項按鈕
  drawBottomArea();
  drawOptions();

  // 4. 檢查交卷按鈕顯示狀態
  checkShowSubmitButton();

  // 5. 繪製結算視窗
  if (isSubmitted) {
    drawResultModal();
  }

  // 6. 播放彩帶特效
  if (showConfetti) {
    updateAndDrawConfetti();
  }
}

// ==========================================
// 繪製頂部標題
// ==========================================
function drawHeader() {
  noStroke();
  fill(60, 40, 50);
  textSize(20);
  textStyle(BOLD);
  text("🌸 隨機 5 題花朵 GIF 動態認知測驗 🌸", width / 2, 25);

  textSize(12);
  textStyle(NORMAL);
  fill(100, 80, 90);
  text("請觀察上方 5 種花朵 GIF 動畫，將下方正確的花朵名稱拖曳填入圖片下方空格中", width / 2, 48);
}

// ==========================================
// 繪製 5 個題目卡片與花朵 GIF 動畫
// ==========================================
function drawQuestionCards() {
  for (let i = 0; i < questions.length; i++) {
    let q = questions[i];

    // 卡片背景框
    stroke(220, 200, 210);
    strokeWeight(1);
    fill(255);
    rect(q.x, q.y, q.w, q.h, 12);

    // 題目提示標題
    noStroke();
    fill(80, 50, 60);
    textSize(12);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(q.title, q.x - q.w / 2 + 12, q.y - q.h / 2 + 10);
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);

    let animY = q.y - 8;
    let dropY = q.y + q.h / 2 - 25;
    let dropW = q.w - 24;
    let dropH = 32;

    // 繪製該花朵對應的 GIF 動態圖片
    drawFlowerGIF(q.gifType, q.x, animY);

    // 拖曳放置目標框
    stroke(200, 180, 190);
    strokeWeight(1);
    if (q.placedAns !== null) {
      fill(235, 245, 235);
    } else {
      fill(245, 240, 242);
    }
    rect(q.x, dropY, dropW, dropH, 6);

    // 未填入時顯示提示字
    if (q.placedAns === null) {
      noStroke();
      fill(140, 120, 130);
      textSize(11);
      text("請將花名選項拖曳至此", q.x, dropY);
    }
  }
}

// ==========================================
// 繪製花朵 GIF 動態圖片 (完美流暢動畫)
// ==========================================
function drawFlowerGIF(type, x, y) {
  push();
  translate(x, y);

  if (type === "sunflower") {
    // 向日葵：花瓣動態呼吸旋轉
    let s = 1 + sin(animAngle) * 0.08;
    scale(s);
    fill(255, 195, 0);
    noStroke();
    for (let i = 0; i < 12; i++) {
      push();
      rotate(TWO_PI / 12 * i);
      ellipse(0, -18, 10, 22);
      pop();
    }
    fill(90, 50, 20);
    ellipse(0, 0, 20, 20);

  } else if (type === "tulip") {
    // 鬱金香：花朵左右輕搖微風動畫
    let rot = sin(animAngle * 1.5) * 0.1;
    rotate(rot);
    stroke(60, 140, 60);
    strokeWeight(3);
    line(0, 5, 0, 25);
    noStroke();
    fill(230, 50, 80);
    arc(0, -2, 24, 28, 0, PI);
    triangle(-12, -2, -4, -18, 0, -2);
    triangle(0, -2, 4, -18, 12, -2);

  } else if (type === "sakura") {
    // 櫻花：花瓣旋轉飄散動畫
    rotate(animAngle * 0.5);
    fill(255, 185, 205);
    noStroke();
    for (let i = 0; i < 5; i++) {
      push();
      rotate(TWO_PI / 5 * i);
      ellipse(0, -12, 11, 18);
      pop();
    }
    fill(240, 100, 150);
    ellipse(0, 0, 7, 7);

  } else if (type === "rose") {
    // 玫瑰：漸變旋轉開花動畫
    rotate(-animAngle * 0.3);
    noStroke();
    fill(190, 20, 50);
    ellipse(0, 0, 30, 30);
    fill(220, 50, 80);
    ellipse(-2, -2, 20, 20);
    fill(250, 90, 110);
    ellipse(2, 2, 12, 12);

  } else if (type === "lily") {
    // 百合：花瓣放大縮小縮放動畫
    let s = 0.9 + cos(animAngle) * 0.1;
    scale(s);
    fill(255);
    stroke(230);
    strokeWeight(1);
    for (let i = 0; i < 6; i++) {
      push();
      rotate(TWO_PI / 6 * i);
      ellipse(0, -14, 10, 20);
      pop();
    }
    fill(235, 190, 30);
    noStroke();
    ellipse(0, 0, 5, 5);

  } else if (type === "lavender") {
    // 薰衣草：搖曳微風動畫
    let rot = sin(animAngle * 2) * 0.08;
    rotate(rot);
    stroke(70, 130, 70);
    strokeWeight(3);
    line(0, -20, 0, 20);
    noStroke();
    fill(140, 90, 210);
    for (let i = -16; i <= 8; i += 5) {
      ellipse(-4, i, 6, 4);
      ellipse(4, i, 6, 4);
      ellipse(0, i - 2, 6, 4);
    }
  }

  pop();
}

// ==========================================
// 繪製底部【備選答案區】背景卡片
// ==========================================
function drawBottomArea() {
  let areaW = width * 0.92;
  let areaH = 115;
  let areaX = width / 2;
  let areaY = height - areaH / 2 - 15;

  stroke(220, 200, 210);
  strokeWeight(1.5);
  fill(238, 230, 234);
  rect(areaX, areaY, areaW, areaH, 12);

  noStroke();
  fill(70, 50, 60);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("【 花朵名稱備選區 】（請將下方 5 個花名拖曳至上方對應空格中）", areaX - areaW / 2 + 12, areaY - areaH / 2 + 10);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
}

// ==========================================
// 繪製可拖曳選項
// ==========================================
function drawOptions() {
  for (let i = 0; i < options.length; i++) {
    let opt = options[i];

    stroke(200, 170, 185);
    strokeWeight(1);

    if (opt === draggedOption) {
      fill(255, 250, 200); // 拖曳中呈現淺黃高亮
      stroke(220, 150, 30);
    } else {
      fill(255);
    }

    rect(opt.x, opt.y, opt.w, opt.h, 8);

    noStroke();
    fill(50, 40, 45);
    textSize(13);
    text(opt.text, opt.x, opt.y);
  }
}

// ==========================================
// 滑鼠按下 (開始拖曳)
// ==========================================
function mousePressed() {
  if (isSubmitted) return;

  for (let i = options.length - 1; i >= 0; i--) {
    let opt = options[i];
    if (
      mouseX > opt.x - opt.w / 2 &&
      mouseX < opt.x + opt.w / 2 &&
      mouseY > opt.y - opt.h / 2 &&
      mouseY < opt.y + opt.h / 2
    ) {
      draggedOption = opt;
      offsetX = opt.x - mouseX;
      offsetY = opt.y - mouseY;

      for (let q of questions) {
        if (q.placedAns === opt) {
          q.placedAns = null;
        }
      }
      opt.isPlaced = false;
      break;
    }
  }
}

// ==========================================
// 滑鼠拖曳 (跟隨移動)
// ==========================================
function mouseDragged() {
  if (draggedOption) {
    draggedOption.x = mouseX + offsetX;
    draggedOption.y = mouseY + offsetY;
  }
}

// ==========================================
// 滑鼠放開 (吸附判斷)
// ==========================================
function mouseReleased() {
  if (!draggedOption) return;

  let dropped = false;

  for (let q of questions) {
    let dropY = q.y + q.h / 2 - 25;
    let dropW = q.w - 24;
    let dropH = 32;

    if (
      draggedOption.x > q.x - dropW / 2 &&
      draggedOption.x < q.x + dropW / 2 &&
      draggedOption.y > dropY - dropH / 2 &&
      draggedOption.y < dropY + dropH / 2
    ) {
      if (q.placedAns !== null && q.placedAns !== draggedOption) {
        q.placedAns.x = q.placedAns.homeX;
        q.placedAns.y = q.placedAns.homeY;
        q.placedAns.isPlaced = false;
      }

      draggedOption.x = q.x;
      draggedOption.y = dropY;
      draggedOption.isPlaced = true;
      q.placedAns = draggedOption;
      dropped = true;
      break;
    }
  }

  if (!dropped) {
    draggedOption.x = draggedOption.homeX;
    draggedOption.y = draggedOption.homeY;
    draggedOption.isPlaced = false;
  }

  draggedOption = null;
}

// ==========================================
// 檢查顯示交卷按鈕
// ==========================================
function checkShowSubmitButton() {
  if (isSubmitted) {
    submitBtn.hide();
    return;
  }

  let allFilled = questions.every(q => q.placedAns !== null);

  if (allFilled) {
    submitBtn.show();
  } else {
    submitBtn.hide();
  }
}

// ==========================================
// 計算成績與觸發彩帶
// ==========================================
function calculateScore() {
  let correct = 0;

  for (let q of questions) {
    if (q.placedAns && q.placedAns.text === q.correctAns) {
      correct++;
    }
  }

  score = round((correct / questions.length) * 100);
  isSubmitted = true;
  submitBtn.hide();

  if (score >= 60) {
    showConfetti = true;
    initConfetti();
  }
}

// ==========================================
// 繪製測驗結果視窗
// ==========================================
function drawResultModal() {
  fill(0, 160);
  rect(width / 2, height / 2, width, height);

  fill(255);
  stroke(220, 180, 200);
  strokeWeight(2);
  rect(width / 2, height / 2, 360, 220, 15);

  noStroke();
  fill(50, 40, 45);
  textSize(22);
  textStyle(BOLD);
  text("測驗結果結算", width / 2, height / 2 - 70);

  textSize(32);
  if (score >= 60) {
    fill(46, 125, 50);
    text("總分：" + score + " 分", width / 2, height / 2 - 15);
    textSize(16);
    fill(70);
    text("🌸 恭喜過關！太厲害了！", width / 2, height / 2 + 35);
  } else {
    fill(198, 40, 40);
    text("總分：" + score + " 分", width / 2, height / 2 - 15);
    textSize(16);
    fill(70);
    text("💪 還差一點點，重新整理網頁再試一次！", width / 2, height / 2 + 35);
  }
  textStyle(NORMAL);
}

// ==========================================
// 初始化彩帶
// ==========================================
function initConfetti() {
  confetti = [];
  for (let i = 0; i < 120; i++) {
    confetti.push({
      x: random(width),
      y: random(-height, 0),
      size: random(6, 12),
      speedY: random(2, 5),
      speedX: random(-1.5, 1.5),
      color: color(random(255), random(255), random(255)),
      rotation: random(TWO_PI),
      rotSpeed: random(-0.1, 0.1)
    });
  }
}

// ==========================================
// 更新與繪製彩帶
// ==========================================
function updateAndDrawConfetti() {
  noStroke();
  for (let p of confetti) {
    p.y += p.speedY;
    p.x += p.speedX;
    p.rotation += p.rotSpeed;

    if (p.y > height) {
      p.y = -10;
      p.x = random(width);
    }

    push();
    translate(p.x, p.y);
    rotate(p.rotation);
    fill(p.color);
    rect(0, 0, p.size, p.size / 2);
    pop();
  }
}