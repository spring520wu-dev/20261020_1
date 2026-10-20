// ==========================================
// 全域變數宣告
// ==========================================
let questions = []; // 儲存 6 個花朵題目資料的陣列
let options = []; // 儲存 6 個花朵名稱選項資料的陣列
let confetti = []; // 儲存彩帶粒子的陣列
let submitBtn; // 交卷按鈕物件
let draggedOption = null; // 當前正在被滑鼠拖曳的選項物件
let offsetX = 0; // 滑鼠拖曳時的 X 軸偏移量
let offsetY = 0; // 滑鼠拖曳時的 Y 軸偏移量
let isSubmitted = false; // 是否已經交卷的狀態標記
let score = 0; // 計算後的總成績
let showConfetti = false; // 是否播放彩帶動畫的狀態標記

// 動畫控制變數 (用於讓花朵產生動態效果)
let animAngle = 0;

// ==========================================
// 初始化設定函式 (Setup)
// ==========================================
function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 設定繪製矩形與圖形時以中心點 (CENTER) 為基準
  rectMode(CENTER);
  imageMode(CENTER);
  // 設定文字對齊方式為水平置中與垂直置中
  textAlign(CENTER, CENTER);

  // 初始化花朵題目與花朵名稱選項資料
  initData();

  // 建立「交卷看成績」按鈕
  submitBtn = createButton('交卷看成績');
  // 設定按鈕字體大小與樣式
  submitBtn.style('font-size', '16px');
  submitBtn.style('font-weight', 'bold');
  submitBtn.style('padding', '10px 24px');
  submitBtn.style('background-color', '#2E7D32');
  submitBtn.style('color', '#FFFFFF');
  submitBtn.style('border-radius', '20px');
  submitBtn.style('border', 'none');
  submitBtn.style('cursor', 'pointer');
  // 綁定按鈕點擊事件執行計算成績函式
  submitBtn.mousePressed(calculateScore);
  // 初始狀態下隱藏交卷按鈕
  submitBtn.hide();

  // 根據當前螢幕尺寸計算並更新畫面佈局
  updateLayout();
}

// ==========================================
// 初始化花朵題目與選項資料
// ==========================================
function initData() {
  // 設定 6 個花朵題目
  questions = [
    { title: "1. 太陽般綻放的花", correctAns: "向日葵", flowerType: "sunflower", placedAns: null, x: 0, y: 0, w: 0, h: 0 },
    { title: "2. 杯狀典雅的花", correctAns: "鬱金香", flowerType: "tulip", placedAns: null, x: 0, y: 0, w: 0, h: 0 },
    { title: "3. 粉嫩浪漫的花", correctAns: "櫻花", flowerType: "sakura", placedAns: null, x: 0, y: 0, w: 0, h: 0 },
    { title: "4. 熱情帶刺的花", correctAns: "玫瑰", flowerType: "rose", placedAns: null, x: 0, y: 0, w: 0, h: 0 },
    { title: "5. 純潔優雅的花", correctAns: "百合", flowerType: "lily", placedAns: null, x: 0, y: 0, w: 0, h: 0 },
    { title: "6. 紫色夢幻的花", correctAns: "薰衣草", flowerType: "lavender", placedAns: null, x: 0, y: 0, w: 0, h: 0 }
  ];

  // 設定 6 個備選的花朵名稱選項
  let rawOptions = [
    "玫瑰",
    "向日葵",
    "百合",
    "鬱金香",
    "薰衣草",
    "櫻花"
  ];

  // 清空選項陣列並封裝為選項物件
  options = [];
  for (let i = 0; i < rawOptions.length; i++) {
    options.push({
      text: rawOptions[i],
      x: 0,
      y: 0,
      homeX: 0,
      homeY: 0,
      w: 160,
      h: 42,
      isPlaced: false
    });
  }
}

// ==========================================
// 響應式版面與座標計算
// ==========================================
function updateLayout() {
  let topMargin = 80;
  let bottomHeight = 170;

  let gridWidth = width * 0.92;
  let gridHeight = height - topMargin - bottomHeight;

  let cardW = (gridWidth - 40) / 3;
  let cardH = (gridHeight - 20) / 2;

  // 計算 6 個題目卡片的中心點座標
  for (let i = 0; i < questions.length; i++) {
    let col = i % 3;
    let row = floor(i / 3);

    let startX = (width - gridWidth) / 2 + cardW / 2;
    let startY = topMargin + cardH / 2;

    questions[i].x = startX + col * (cardW + 20);
    questions[i].y = startY + row * (cardH + 20);
    questions[i].w = cardW;
    questions[i].h = cardH;
  }

  // 設定底部備選答案區域 (灰色背景框)
  let areaW = gridWidth;
  let areaH = 130;
  let areaX = width / 2;
  let areaY = height - areaH / 2 - 20;

  // 計算 6 個選項按鈕位置
  let optW = min(cardW * 0.8, 180);
  for (let i = 0; i < options.length; i++) {
    let col = i % 3;
    let row = floor(i / 3);

    let optX = areaX - optW - 20 + col * (optW + 20);
    let optY = areaY - 20 + row * 48;

    options[i].w = optW;
    options[i].homeX = optX;
    options[i].homeY = optY;

    if (!options[i].isPlaced) {
      options[i].x = optX;
      options[i].y = optY;
    }
  }

  // 設定交卷按鈕的位置
  if (submitBtn) {
    submitBtn.position(width / 2 + areaW / 2 - 160, areaY + 15);
  }
}

// ==========================================
// 視窗大小改變監聽
// ==========================================
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateLayout();
}

// ==========================================
// 主繪圖迴圈 (Draw Loop)
// ==========================================
function draw() {
  // 淡粉灰色背景
  background(248, 243, 245);

  // 更新動畫旋轉角度
  animAngle += 0.03;

  // 1. 繪製頂部標題文字
  drawHeader();

  // 2. 繪製 6 個花朵題目卡片及其動態動畫圖形
  drawQuestionCards();

  // 3. 繪製底部備選區與選項
  drawBottomArea();
  drawOptions();

  // 4. 檢查是否顯示交卷按鈕
  checkShowSubmitButton();

  // 5. 若已交卷則顯示成績結算彈窗
  if (isSubmitted) {
    drawResultModal();
  }

  // 6. 播放彩帶慶祝動畫
  if (showConfetti) {
    updateAndDrawConfetti();
  }
}

// ==========================================
// 繪製頂部標題與說明文字
// ==========================================
function drawHeader() {
  noStroke();
  fill(60, 40, 50);
  textSize(22);
  textStyle(BOLD);
  text("🌸 花朵植物認知的動態互動測驗系統 🌸", width / 2, 30);

  textSize(13);
  textStyle(NORMAL);
  fill(100, 80, 90);
  text("請觀察上方 6 種花朵動態動畫，將下方正確的花朵名稱拖曳填入圖片下方空格中", width / 2, 55);
}

// ==========================================
// 繪製 6 個花朵題目卡片及其動畫
// ==========================================
function drawQuestionCards() {
  for (let i = 0; i < questions.length; i++) {
    let q = questions[i];

    // 繪製卡片白色背景與淡粉色邊框
    stroke(220, 200, 210);
    strokeWeight(1);
    fill(255);
    rect(q.x, q.y, q.w, q.h, 12);

    // 繪製卡片標題
    noStroke();
    fill(80, 50, 60);
    textSize(13);
    textStyle(BOLD);
    textAlign(LEFT, TOP);
    text(q.title, q.x - q.w / 2 + 15, q.y - q.h / 2 + 12);
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);

    let animY = q.y - 12;
    let dropY = q.y + q.h / 2 - 30;
    let dropW = q.w - 30;
    let dropH = 36;

    // 繪製動態花朵動畫
    drawAnimatedFlower(q.flowerType, q.x, animY);

    // 繪製圖片下方的放置目標空格
    stroke(200, 180, 190);
    strokeWeight(1);
    if (q.placedAns !== null) {
      fill(235, 245, 235);
    } else {
      fill(245, 240, 242);
    }
    rect(q.x, dropY, dropW, dropH, 6);

    // 若尚未填入答案，顯示提示文字
    if (q.placedAns === null) {
      noStroke();
      fill(140, 120, 130);
      textSize(12);
      text("請將花名選項拖曳至此", q.x, dropY);
    }
  }
}

// ==========================================
// 即時繪製 6 種花朵的動態動畫圖形
// ==========================================
function drawAnimatedFlower(type, x, y) {
  push();
  translate(x, y);

  if (type === "sunflower") {
    let s = 1 + sin(animAngle) * 0.08;
    scale(s);
    fill(255, 195, 0);
    noStroke();
    for (let i = 0; i < 12; i++) {
      push();
      rotate(TWO_PI / 12 * i);
      ellipse(0, -20, 12, 26);
      pop();
    }
    fill(90, 50, 20);
    ellipse(0, 0, 24, 24);

  } else if (type === "tulip") {
    let rot = sin(animAngle * 1.5) * 0.1;
    rotate(rot);
    stroke(60, 140, 60);
    strokeWeight(4);
    line(0, 5, 0, 30);
    noStroke();
    fill(230, 50, 80);
    arc(0, -2, 28, 32, 0, PI);
    triangle(-14, -2, -5, -20, 0, -2);
    triangle(0, -2, 5, -20, 14, -2);

  } else if (type === "sakura") {
    rotate(animAngle * 0.5);
    fill(255, 185, 205);
    noStroke();
    for (let i = 0; i < 5; i++) {
      push();
      rotate(TWO_PI / 5 * i);
      ellipse(0, -14, 13, 22);
      pop();
    }
    fill(240, 100, 150);
    ellipse(0, 0, 8, 8);

  } else if (type === "rose") {
    rotate(-animAngle * 0.3);
    noStroke();
    fill(190, 20, 50);
    ellipse(0, 0, 34, 34);
    fill(220, 50, 80);
    ellipse(-2, -2, 24, 24);
    fill(250, 90, 110);
    ellipse(2, 2, 14, 14);

  } else if (type === "lily") {
    let s = 0.9 + cos(animAngle) * 0.1;
    scale(s);
    fill(255);
    stroke(230);
    strokeWeight(1);
    for (let i = 0; i < 6; i++) {
      push();
      rotate(TWO_PI / 6 * i);
      ellipse(0, -16, 11, 24);
      pop();
    }
    fill(235, 190, 30);
    noStroke();
    ellipse(0, 0, 6, 6);

  } else if (type === "lavender") {
    let rot = sin(animAngle * 2) * 0.08;
    rotate(rot);
    stroke(70, 130, 70);
    strokeWeight(3);
    line(0, -25, 0, 25);
    noStroke();
    fill(140, 90, 210);
    for (let i = -20; i <= 10; i += 6) {
      ellipse(-5, i, 7, 5);
      ellipse(5, i, 7, 5);
      ellipse(0, i - 2, 7, 5);
    }
  }

  pop();
}

// ==========================================
// 繪製底部【備選答案區】背景外框
// ==========================================
function drawBottomArea() {
  let areaW = width * 0.92;
  let areaH = 130;
  let areaX = width / 2;
  let areaY = height - areaH / 2 - 20;

  stroke(220, 200, 210);
  strokeWeight(1.5);
  fill(238, 230, 234);
  rect(areaX, areaY, areaW, areaH, 12);

  noStroke();
  fill(70, 50, 60);
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("【 花朵名稱備選區 】（請拖曳花名至上方對應的花朵下方）", areaX - areaW / 2 + 15, areaY - areaH / 2 + 12);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
}

// ==========================================
// 繪製可拖曳的花朵名稱選項
// ==========================================
function drawOptions() {
  for (let i = 0; i < options.length; i++) {
    let opt = options[i];

    stroke(200, 170, 185);
    strokeWeight(1);

    if (opt === draggedOption) {
      fill(255, 250, 200);
      stroke(220, 150, 30);
    } else {
      fill(255);
    }

    rect(opt.x, opt.y, opt.w, opt.h, 8);

    noStroke();
    fill(50, 40, 45);
    textSize(14);
    text(opt.text, opt.x, opt.y);
  }
}

// ==========================================
// 滑鼠按下 (開始拖曳選項)
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
// 滑鼠移動 (拖曳選項中)
// ==========================================
function mouseDragged() {
  if (draggedOption) {
    draggedOption.x = mouseX + offsetX;
    draggedOption.y = mouseY + offsetY;
  }
}

// ==========================================
// 滑鼠放開 (判斷吸附或歸位)
// ==========================================
function mouseReleased() {
  if (!draggedOption) return;

  let dropped = false;

  for (let q of questions) {
    let dropY = q.y + q.h / 2 - 30;
    let dropW = q.w - 30;
    let dropH = 36;

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
// 檢查是否顯示交卷按鈕
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
// 計算成績與觸發彩帶邏輯
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
// 繪製測驗結果彈窗介面
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
  text("花朵認知測驗結果", width / 2, height / 2 - 70);

  textSize(32);
  if (score >= 60) {
    fill(46, 125, 50);
    text("總分：" + score + " 分", width / 2, height / 2 - 15);
    textSize(16);
    fill(70);
    text("🌸 恭喜過關！你真是花草大師！", width / 2, height / 2 + 35);
  } else {
    fill(198, 40, 40);
    text("總分：" + score + " 分", width / 2, height / 2 - 15);
    textSize(16);
    fill(70);
    text("💪 還差一點點，再仔細觀察花朵特徵吧！", width / 2, height / 2 + 35);
  }
  textStyle(NORMAL);
}

// ==========================================
// 初始化彩帶粒子
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
// 更新並繪製彩帶粒子
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