const Notif = ({ message, type }) => {
  if (type === 'loginError') {
    return (
      <div className="loginError">
        <h2>{message}</h2>
      </div>
    )
  }
  if (type === 'addingBlog') {
    return (
      <div className="addingBlog">
        <h2>{message}</h2>
      </div>
    )
  }
}

export default Notif