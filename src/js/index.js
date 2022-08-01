class BrakeBanner {
  constructor(selector) {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      resizeTo: window, //缩放属性
    });

    document.querySelector(selector).appendChild(this.app.view);

    this.stage = this.app.stage;

    this.loader = new PIXI.Loader();

    this.loader.add("btn.png", "images/btn.png");
    this.loader.add("brake_bike.png", "images/brake_bike.png");
    this.loader.add("brake_handlerbar.png", "images/brake_handlerbar.png");
    this.loader.add("brake_lever.png", "images/brake_lever.png");
    this.loader.add("btn_circle.png", "images/btn_circle.png");

    this.loader.load();

    this.loader.onComplete.add(() => {
      this.show();
    });
  }

  // 按钮
  show() {
    let actionButton = this.createActionButton();
    // 位置
    actionButton.x = actionButton.y = 400;

    const bikeContainer = new PIXI.Container();
    this.stage.addChild(bikeContainer);

    // 缩放
    bikeContainer.scale.x = bikeContainer.scale.y = 0.3;

    const bikeImage = new PIXI.Sprite(this.loader.resources["brake_bike.png"].texture);
    const bikeLeverImage = new PIXI.Sprite(this.loader.resources["brake_lever.png"].texture);
    const bikeHandlerbarImage = new PIXI.Sprite(this.loader.resources["brake_handlerbar.png"].texture);

    bikeContainer.addChild(bikeImage);
    bikeContainer.addChild(bikeLeverImage);
    bikeContainer.addChild(bikeHandlerbarImage);

    bikeLeverImage.pivot.x = 455;
    bikeLeverImage.pivot.y = 455;
    bikeLeverImage.x = 722;
    bikeLeverImage.y = 900;

    this.stage.addChild(actionButton);

    // 点击
    actionButton.interactive = true;
    // 鼠标手势
    actionButton.buttonMode = true;

    actionButton.on("mousedown", () => {
      // bikeLeverImage.rotation = (Math.PI / 180) * -30;
      gsap.to(bikeLeverImage, { duration: 0.5, rotation: (Math.PI / 180) * -30 });
      pause();
    });

    actionButton.on("mouseup", () => {
      // bikeLeverImage.rotation = 0;
      gsap.to(bikeLeverImage, { duration: 0.5, rotation: 0 });
      start();
    });

    let resize = () => {
      bikeContainer.x = window.innerWidth - bikeContainer.width;
      bikeContainer.y = window.innerHeight - bikeContainer.height;
    };

    window.addEventListener("resize", resize);
    resize();

    // 创建粒子
    const particleContainer = new PIXI.Container();
    this.stage.addChild(particleContainer);

    // 中心位置
    (particleContainer.pivot.x = window.innerWidth / 2),
    (particleContainer.pivot.x = window.innerHeight / 2),
    (particleContainer.x = window.innerWidth / 2),
    (particleContainer.x = window.innerHeight / 2),
    (particleContainer.rotation = (35 * Math.PI) / 180);

    let particles = [];
    let colors = ["0xf1cf54", "0xf1cff4", "0xf1af54", "0xf1cba4", "0xf1c604", "0xf1cca4", "0x000000"];

    // 随机生成 15 个圆点
    for (let i = 0; i < 15; i++) {
      let gr = new PIXI.Graphics();
      gr.beginFill(colors[Math.floor(Math.random() * colors.length)]);
      gr.drawCircle(0, 0, 6);
      gr.endFill();

      let pItem = {
        sx: Math.random() * window.innerWidth,
        sy: Math.random() * window.innerHeight,
        gr: gr,
      };

      gr.x = pItem.sx;
      gr.y = pItem.sy;

      particleContainer.addChild(gr);

      particles.push(pItem);
    }

    let speed = 0;
    function loop() {
      speed += 0.5;
      speed = Math.min(speed, 22);
      for (let i = 0; i < particles.length; i++) {
        let pItem = particles[i];

        // 速度
        pItem.gr.y += speed;
        if(speed>=20){
          pItem.gr.scale.y = 40;
          pItem.gr.scale.x = 0.03;
        }

        if (pItem.gr.y > window.innerHeight) pItem.gr.y = 0;
      }
    }

    function start() {
      speed = 0;
      gsap.ticker.add(loop);
    }
    start();

    // 停止的时候有一点回弹的效果
    function pause() {
      gsap.ticker.remove(loop);

      for (let i = 0; i < particles.length; i++) {
        let pItem = particles[i];

        pItem.gr.scale.y = 1;
        pItem.gr.scale.x = 1;

        gsap.to(pItem.gr, {
          duration: 0.5,
          x: pItem.sx,
          y: pItem.sy,
          ease:'elastic.out'
        });
      }
    }
  }

  createActionButton() {
    let actionButton = new PIXI.Container();

    let btnImage = new PIXI.Sprite(this.loader.resources["btn.png"].texture);
    let btnCircle = new PIXI.Sprite(this.loader.resources["btn_circle.png"].texture);
    let btnCircle2 = new PIXI.Sprite(this.loader.resources["btn_circle.png"].texture);

    actionButton.addChild(btnImage);
    actionButton.addChild(btnCircle);
    actionButton.addChild(btnCircle2);

    // 圆心半径
    btnImage.pivot.x = btnImage.pivot.y = btnImage.width / 2;
    btnCircle.pivot.x = btnCircle.pivot.y = btnCircle.width / 2;
    btnCircle2.pivot.x = btnCircle2.pivot.y = btnCircle2.width / 2;

    // 缩放
    btnCircle.scale.x = btnCircle.scale.y = 0.8;
    gsap.to(btnCircle.scale, { duration: 1, x: 1.3, y: 1.3, repeat: -1 });
    gsap.to(btnCircle.scale, { duration: 1, alpha: 0, repeat: -1 });

    return actionButton;
  }
}
