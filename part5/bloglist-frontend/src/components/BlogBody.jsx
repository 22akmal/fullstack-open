import blogService from '../services/blogs'
import { Link } from "react-router-dom"

const BlogBody = ({blogs}) => {
  return (
    <div>
      <h2>blogs</h2>
      <div>
        <ul>
          {blogs.map(blog =>
            <li key={blog.id}><Link to={`/blogs/${blog.id}`}>{`${blog.title} by ${blog.author}`}</Link></li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default BlogBody