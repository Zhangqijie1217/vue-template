export function addClass(el, className) {
  if (hasClass(el, className)) {  // 如果有这个className就return
    return
  }
  // console.log(hasClass(el, className))
  let newClass = el.className.split(' ') // 把className拆开
  newClass.push(className)
  el.className = newClass.join(' ') // 再连起来
}

export function hasClass(el, className) {  // 判断这个方法是不是有这个className
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}