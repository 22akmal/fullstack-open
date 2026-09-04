const Notification = ({ notif }) => {
  if (notif === null) {
    return null
  }

  const [type, name] = notif

  if (type === 'error') {
    return (
      <div className="error">
        {`Information of ${name} has already been removed from server`}
      </div>
    )
  } else if (type === 'valid error') {
    return (
      <div className="error">
        {name}
      </div>
    )
  } else {
    return (
      <div className="addOrUpdateName">
        {`${type} ${name}`}
      </div>
    )
  }
}

export default Notification