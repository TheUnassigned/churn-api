
const or = fn_arr => {
  return () => {
    return fn_arr[0]()
  }
}

export {
  or
}
