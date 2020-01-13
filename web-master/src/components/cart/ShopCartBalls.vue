<template>
  <div class="ball-container">
    <transition-group tag="div" @before-enter='beforeEnter' @enter='enter' @after-enter='afterEnter'>
      <div class="ball" v-for="(item, index) in balls" :key=item.index v-show="item.show" transition='drop'>
        <div class="inner inner-hook"></div>
        </div>
    </transition-group>
  </div>
</template>

<script>
  export default {
    name: "ShopCartBalls",
    data() {
      return {
        balls: [
          {show:false,index:0},
          {show:false,index:1},
          {show:false,index:2},
          {show:false,index:3},
          {show:false,index:4},
          {show:false,index:5},
        ],
        dropBalls: []
      }
    },
    methods: {
      drop(el) {
        //触发一次事件就会将所有小球进行遍历
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) { //将false的小球放到dropBalls
            ball.show = true;
            ball.el = el; //设置小球的el属性为一个dom对象
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeEnter(el){ //这个方法的执行是因为这是一个vue的监听事件
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect(); //获取小球的相对于视口的位移(小球高度)
            // let y = -(window.innerHeight - rect.top - 22); //负数,因为是从左上角往下的的方向
            let x = rect.right + 100;
            let y = window.innerHeight - rect.top +160;
            // let x = 500;
            // let y =500;
            el.style.display = ''; //清空display
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            //处理内层动画
            let inner = el.getElementsByClassName('inner-hook')[0]; //使用inner-hook类来单纯被js操作
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },

      enter(el, done) { //这个方法的执行是因为这是一个vue的监听事件
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight; //触发重绘html
        this.$nextTick(() => { //让动画效果异步执行,提高性能
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          //处理内层动画
          let inner = el.getElementsByClassName('inner-hook')[0]; //使用inner-hook类来单纯被js操作
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done); //Vue为了知道过渡的完成，必须设置相应的事件监听器。
        });
      },

      afterEnter(el) { //这个方法的执行是因为这是一个vue的监听事件
        let ball = this.dropBalls.shift(); //完成一次动画就删除一个dropBalls的小球
        if (ball) {
          ball.show = false;
          // el.style.display = 'none'; //隐藏小球
        }
      }
    }
  }
</script>

<style scoped>
  .ball-container,
  .ball {
    position:fixed;
    left: 100px;
    bottom: 200px;
    z-index: 200;
    /*transition: all 2.2s cubic-bezier(0.58, 0.33, 0.76, 0.53)*/
    transition: all 2.2s cubic-bezier(0.42,0,1,1);
    /*transition: all .6s cubic-bezier(0.49, -0.29, 0.75, 0.41)*/
  }
  .inner {
    width:16px ;
    height:16px;
    border-radius: 50% ;
    background:rgb(0, 160, 220);
    transition: all 2.2s linear
  }
  .show{
    opacity: 0;
  }

</style>
