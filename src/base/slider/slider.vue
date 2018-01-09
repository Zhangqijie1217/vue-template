<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    data() {
      return {
        dots: [],
        currentPageIndex: 0 // 表示当前是第几页
      }
    },
    props: {
      loop: { // 循环轮播
        type: Boolean,
        default: true
      },
      autoPlay: { // 自动轮播
        type: Boolean,
        default: true
      },
      interval: { // 轮播间隔
        default: 4000
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots() // Dots必须在Slider初始化之前初始化
        this._initSlider()

        if (this.autoPlay) {
          this._play()
        }
      }, 20)

      window.addEventListener('resize', () => { // 监听窗口改变事件
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh() // 当宽度发生变化刷新页面
      })
    },
    methods: {
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children // 获取整个列表有多少元素
        console.log(this.children.length) // 未被复制的长度，也就是小圆点的长度
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth // 获取父容器的宽度
        for (let i = 0; i < this.children.length; i++) { // sliderGroup的宽度
          let child = this.children[i]
          addClass(child, 'slider-item') // 给每个child添加'slider-item'样式
          child.style.width = sliderWidth + 'px' // 设置child宽度
          width += sliderWidth  // 总的group的width需要累加
        }
        if (this.loop && !isResize) {  // 如果this.loop是需要左右两边加个dom   && !isResize是判断
          width += 2 * sliderWidth // 是不是resize过来的，如果是width就不2倍了
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400,
          click: true
        })
        // 小点
        this.slider.on('scrollEnd', () => { // 给slider绑定一个事件，派发一个scrollEnd事件
          let pageIndex = this.slider.getCurrentPage().pageX // 获取pageIndex,实际上pageIndex也就是当前的第几个子元素
          if (this.loop) {
            pageIndex -= 1 // 会添加一个拷贝，所以要减1
          }
          this.currentPageIndex = pageIndex
          if (this.autoPlay) {  // 如果不clearTimeout会有两个轮播
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _play() {
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)  // goToPage也是better-scroll提供的方法，0是代表Y方向
        }, this.interval)
      }
    },
    destroyed() { // 也是个生命周期
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  
  .slider
    min-height: 1px
    position: relative
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>