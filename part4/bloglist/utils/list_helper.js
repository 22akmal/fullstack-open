const dummy = (blogs) => {
  return 1
}

const totalLikes = (data) => {
  if (data.length === 0) return null

  return data.reduce((accu, currentVal) => {
    return accu + currentVal.likes
  }, 0)
}

const favoriteBlog = (data) => {
  if (data.length === 0) return null

  const mostLike = Math.max(...data.map((item) => item.likes))
  const mostFavorite = data.filter((item) => item.likes === mostLike)
  return mostFavorite[0]
}

module.exports = {dummy, totalLikes, favoriteBlog}