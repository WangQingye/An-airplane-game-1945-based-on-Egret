/**
 *
 * @author  Wqy
 *
 */

module fighter{
    
    //主游戏容器
    export class GameContainer extends egret.DisplayObjectContainer {
        
        //声明变量
        private stageW:number;   //舞台宽度
        
        private stageH: number;   //舞台高度 
        
        private btnStart;  //开始按钮      
        
        private bg: fighter.BgMap; //背景        
        
        private myFighter: fighter.Airplane; //玩家的飞机        
        
        private myBullets: fighter.Bullet[] = []; //玩家的子弹       
        
        private enemyFighters: fighter.Airplane[] = []; //电脑的飞机
        
        private enemyFightersTimer: egret.Timer = new egret.Timer(1000);  //创建敌机的时间间隔
        
        private enemyBullets: fighter.Bullet[] = [];  //敌机的子弹
        
        private scorePanel: fighter.ScorePanel;  //成绩显示面板
        
        private myScore: number = 0; //最终得分
        
        private _lastTime: number;        
      
        public constructor() {
            super();
            this._lastTime = egret.getTimer();
            this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
        }
        
        private onAddToStage(event: egret.Event) {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
            this.createGameScene();
        }
        
        private createGameScene(): void {
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            //背景
            this.bg = new fighter.BgMap();//创建可滚动的背景
            this.addChild(this.bg);
            
            //开始按钮
            this.btnStart = fighter.createBitmapByName("btnStart");//开始按钮
            this.btnStart.x = (this.stageW - this.btnStart.width) / 2;//居中定位
            this.btnStart.y = (this.stageH - this.btnStart.height) / 2;//居中定位
            this.btnStart.touchEnabled = true;//开启触碰
            this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP,this.gameStart,this);//点击按钮开始游戏
            this.addChild(this.btnStart);
            //我的飞机
            this.myFighter = new fighter.Airplane(RES.getRes("f1"),150,"f1");
            this.myFighter.y = this.stageH - this.myFighter.height - 50;
            this.myFighter.x = (this.stageW - this.myFighter.width) / 2;//居中定位
            this.addChild(this.myFighter);
            //计分板
            this.scorePanel = new fighter.ScorePanel();
            //预创建
            this.preCreatedInstance();
        }
        
        //预创建一些进行游戏需要用到的对象，减少游戏进行中的创建消耗
        private preCreatedInstance(): void {
            var i: number = 0;
            var objArr: any[] = [];
            for(i = 0;i < 20;i++) {
                var bullet = fighter.Bullet.produce("b1");
                objArr.push(bullet);
            }
            for(i = 0;i < 20;i++) {
                bullet = objArr.pop();
                fighter.Bullet.reclaim(bullet);
            }
            for(i = 0;i < 20;i++) {
                var bullet = fighter.Bullet.produce("b2");
                objArr.push(bullet);
            }
            for(i = 0;i < 20;i++) {
                bullet = objArr.pop();
                fighter.Bullet.reclaim(bullet);
            }
            for(i = 0;i < 20;i++) {
                var enemyFighter: fighter.Airplane = fighter.Airplane.produce("f2",500);
                objArr.push(enemyFighter);
            }
            for(i = 0;i < 20;i++) {
                enemyFighter = objArr.pop();
                fighter.Airplane.reclaim(enemyFighter);
            }
        }
        //游戏开始
        private gameStart(): void {
            //初始计分
            this.myScore = 0;
            //移除开始按钮
            this.removeChild(this.btnStart);
            //背景开始移动
            this.bg.start();
            //开启触碰（用户移动飞机）
            this.touchEnabled = true;
             //每一帧都更新画面
            this.addEventListener(egret.Event.ENTER_FRAME,this.gameViewUpdate,this);
            //点击过后开始使用点击移动杆
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchHandler,this);
            //初始化玩家飞机位置
            this.myFighter.x = (this.stageW - this.myFighter.width) / 2;
            //玩家飞机开始发射子弹
            this.myFighter.fire();
            //初始化玩家飞机血量
            this.myFighter.blood = 10;
            //发射子弹
            this.myFighter.addEventListener("createBullet",this.createBulletHandler,this);
            //过一段时间后开始创建敌机
            this.enemyFightersTimer.addEventListener(egret.TimerEvent.TIMER,this.createEnemyFighter,this);
            this.enemyFightersTimer.start();
            if(this.scorePanel.parent == this)
                this.removeChild(this.scorePanel);
        }
        
        //通过点击触发飞机的移动，移动范围为舞台宽度减去飞机宽度
        private touchHandler(evt: egret.TouchEvent): void {            
            //首先判断是否触发touchmove
            if(evt.type == egret.TouchEvent.TOUCH_MOVE) {
                var tx: number = evt.localX;
                tx = Math.max(0,tx);
                tx = Math.min(this.stageW - this.myFighter.width,tx);
                this.myFighter.x = tx;
            }
        }
        
        //创建子弹(包括玩家飞机子弹和敌机子弹)
        private createBulletHandler(evt: egret.Event): void {
            var bullet: fighter.Bullet;
            //玩家飞机
            if(evt.target == this.myFighter) {      
                for(var i: number = 0;i < 2;i++) {
                    bullet = fighter.Bullet.produce("b1");
                    //利用for循环判断左右子弹发射位置
                    bullet.x = i == 0 ? (this.myFighter.x + 10) : (this.myFighter.x + this.myFighter.width - 30);
                    bullet.y = this.myFighter.y + 10;
                    this.addChildAt(bullet,this.numChildren - 1 - this.enemyFighters.length);
                    this.myBullets.push(bullet);
                }
            //敌机
            } else {
                var theFighter: fighter.Airplane = evt.target;
                bullet = fighter.Bullet.produce("b2");
                bullet.x = theFighter.x + 32;
                bullet.y = theFighter.y + 20;
                this.addChildAt(bullet,this.numChildren - 1 - this.enemyFighters.length);
                this.enemyBullets.push(bullet);
            }
        }
        
        //创建敌机
        private createEnemyFighter(evt: egret.TimerEvent): void {
            var enemyFighter: fighter.Airplane = fighter.Airplane.produce("f2",500);            
            //随机敌机产生位置
            enemyFighter.x = Math.random() * (this.stageW - enemyFighter.width);
            //从300距离左右开始产生（前面加-飞机高度是防止随机到飞机高度以下的数值）
            enemyFighter.y = -enemyFighter.height - Math.random() * 300;
            enemyFighter.addEventListener("createBullet",this.createBulletHandler,this);
            enemyFighter.fire();
            this.addChildAt(enemyFighter,this.numChildren - 1);
            this.enemyFighters.push(enemyFighter);
        }
        
        //游戏画面更新
        private gameViewUpdate(evt: egret.Event): void {
            //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
            var nowTime: number = egret.getTimer();
            var fps: number = 1000 / (nowTime - this._lastTime);
            this._lastTime = nowTime;            
            //通过帧数情况计算子弹移动速度
            var speedOffset: number = 60 / fps;
            //玩家飞机的子弹运动
            var i: number = 0;
            var bullet: fighter.Bullet;
            var myBulletsCount: number = this.myBullets.length;
            for(;i < myBulletsCount;i++) {
                bullet = this.myBullets[i];
                //当玩家飞机子弹飞出屏幕上方时，回收子弹
                if(bullet.y < -bullet.height) {
                    this.removeChild(bullet);
                    Bullet.reclaim(bullet);
                    this.myBullets.splice(i,1);
                    i--;
                    myBulletsCount--;
                }
                bullet.y -= 12 * speedOffset;

            }
            //敌人飞机运动
            var theFighter: fighter.Airplane;
            var enemyFighterCount: number = this.enemyFighters.length;
            for(i = 0;i < enemyFighterCount;i++) {
                theFighter = this.enemyFighters[i];
                if(theFighter.y > this.stage.stageHeight) {
                    this.removeChild(theFighter);
                    Airplane.reclaim(theFighter);
                    theFighter.removeEventListener("createBullet",this.createBulletHandler,this);
                    theFighter.stopFire();
                    this.enemyFighters.splice(i,1);
                    i--;
                    enemyFighterCount--;
                }
                theFighter.y += 4 * speedOffset;

            }
            //敌人子弹运动
            var enemyBulletsCount: number = this.enemyBullets.length;
            for(i = 0;i < enemyBulletsCount;i++) {
                bullet = this.enemyBullets[i];
                if(bullet.y > this.stage.stageHeight) {
                    this.removeChild(bullet);
                    Bullet.reclaim(bullet);
                    this.enemyBullets.splice(i,1);
                    i--;
                    enemyBulletsCount--;//数组长度已经改变
                }

                bullet.y += 8 * speedOffset;

            }
            this.gameHitTest();
        }
        
        //子弹与飞机的碰撞测试（掉血机制）
        private gameHitTest(): void {
            var i: number,j: number;
            var bullet: fighter.Bullet;
            var theFighter: fighter.Airplane;
            var myBulletsCount: number = this.myBullets.length;
            var enemyFighterCount: number = this.enemyFighters.length;
            var enemyBulletsCount: number = this.enemyBullets.length;
            //将需消失的子弹和飞机记录
            var delBullets: fighter.Bullet[] = [];
            var delFighters: fighter.Airplane[] = [];
            //我的子弹可以消灭敌机
            for(i = 0;i < myBulletsCount;i++) {
                bullet = this.myBullets[i];
                for(j = 0;j < enemyFighterCount;j++) {
                    theFighter = this.enemyFighters[j];
                    if(fighter.GameUtil.hitTest(theFighter,bullet)) {
                        theFighter.blood -= 2;
                        if(delBullets.indexOf(bullet) == -1)
                            delBullets.push(bullet);
                        if(theFighter.blood <= 0 && delFighters.indexOf(theFighter) == -1)
                            delFighters.push(theFighter);
                    }
                }
            }
            //敌人的子弹可以减我血
            for(i = 0;i < enemyBulletsCount;i++) {
                bullet = this.enemyBullets[i];
                if(fighter.GameUtil.hitTest(this.myFighter,bullet)) {
                    this.myFighter.blood -= 1;
                    if(delBullets.indexOf(bullet) == -1)
                        delBullets.push(bullet);
                }
            }
            //敌机的撞击可以消灭我
            for(i = 0;i < enemyFighterCount;i++) {
                theFighter = this.enemyFighters[i];
                if(fighter.GameUtil.hitTest(this.myFighter,theFighter)) {
                    this.myFighter.blood -= 10;
                }
            }
            if(this.myFighter.blood <= 0) {
                this.gameStop();
            } else {
                while(delBullets.length > 0) {
                    bullet = delBullets.pop();
                    this.removeChild(bullet);
                    if(bullet.textureName == "b1")
                        this.myBullets.splice(this.myBullets.indexOf(bullet),1);
                    else
                        this.enemyBullets.splice(this.enemyBullets.indexOf(bullet),1);
                    fighter.Bullet.reclaim(bullet);
                }
                //回收敌机前，先计分
                this.myScore += delFighters.length;
                while(delFighters.length > 0) {
                    theFighter = delFighters.pop();
                    theFighter.stopFire();
                    theFighter.removeEventListener("createBullet",this.createBulletHandler,this);
                    this.removeChild(theFighter);
                    this.enemyFighters.splice(this.enemyFighters.indexOf(theFighter),1);
                    fighter.Airplane.reclaim(theFighter);
                }
            }
        }
        
        private gameStop(): void {
            this.addChild(this.btnStart);
            this.bg.pause();
            this.removeEventListener(egret.Event.ENTER_FRAME,this.gameViewUpdate,this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchHandler,this);
            this.myFighter.stopFire();
            this.myFighter.removeEventListener("createBullet",this.createBulletHandler,this);
            this.enemyFightersTimer.removeEventListener(egret.TimerEvent.TIMER,this.createEnemyFighter,this);
            this.enemyFightersTimer.stop();
            //清理子弹
            var i: number = 0;
            var bullet: fighter.Bullet;
            while(this.myBullets.length > 0) {
                bullet = this.myBullets.pop();
                this.removeChild(bullet);
                fighter.Bullet.reclaim(bullet);
            }
            while(this.enemyBullets.length > 0) {
                bullet = this.enemyBullets.pop();
                this.removeChild(bullet);
                fighter.Bullet.reclaim(bullet);
            }
            //清理飞机
            var theFighter: fighter.Airplane;
            while(this.enemyFighters.length > 0) {
                theFighter = this.enemyFighters.pop();
                theFighter.stopFire();
                theFighter.removeEventListener("createBullet",this.createBulletHandler,this);
                this.removeChild(theFighter);
                fighter.Airplane.reclaim(theFighter);
            }
            //显示成绩
            this.scorePanel.showScore(this.myScore);
            this.scorePanel.x = (this.stageW - this.scorePanel.width) / 2;
            this.scorePanel.y = 100;
            this.addChild(this.scorePanel);
        }        
    }    
}

