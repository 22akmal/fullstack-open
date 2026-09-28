import { Alert } from "@mui/material"

const Notif = ({ notification }) => {
  if (notification.message) {
    return (
      <Alert style={{ marginTop: 10, marginBottom: 10 }} severity={notification.type}>
        {notification.message}</Alert>
    )
  }
}

export default Notif