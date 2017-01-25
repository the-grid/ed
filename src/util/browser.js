export const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

export function pseudoFixedStyle () {
  if (isIOS) {
    return {
      position: 'absolute',
      top: window.scrollY,
      left: 0,
      width: '100vw',
      height: '100vh',
    }
  } else {
    return {
      position: 'fixed',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
    }
  }
}
