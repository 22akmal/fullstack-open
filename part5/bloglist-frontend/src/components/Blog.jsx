import { Card, CardContent, Typography, Link, Button, Box } from "@mui/material"

const Blog = ({ user, blog, handleUpdate, handleDelete }) => {
  if (!blog) {
    return null
  }

  return (
    <Card variant="outlined">
      <CardContent sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
        <Typography variant="h5" component='h2'>
          {`${blog.title}`}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {`by ${blog.author}`}
        </Typography>
        <Link href={blog.url} target="_blank">{blog.url}</Link>
        <Typography variant="body2" color="text.secondary">
          {`Added by ${blog.user.name}`}
        </Typography>
        <Box sx={{display: 'flex', alignItems: 'center', gap:1.5}}>
          <Typography variant="body1">
           {blog.likes} likes 
          </Typography>
          {user && (<Button variant="outlined" size="small" onClick={() => handleUpdate(blog.id)}>like</Button>)}
          {user?.username === blog.user?.username && (
            <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(blog.id, blog.title, blog.author)}>remove</Button>)}
        </Box>
      </CardContent>
    </Card>
  )
}

export default Blog