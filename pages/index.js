import Head from 'next/head'
import CreatePost from '../Components/CreatePost';
import { useState, useEffect } from 'react';
import fire from '../config/fire-config';
import Link from 'next/link';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  fire.auth()
    .onAuthStateChanged((user) => {
      if(user){
        setLoggedIn(true)
      } else {
        setLoggedIn(false)
      }
    });

  useEffect(() => {
    fire.firestore()
      .collection('blog')
      .onSnapshot(snap => {
        const blogs = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBlogs(blogs);
      });
  }, []);

  const handleLogout = () => {
    fire.auth()
      .signOut()
      .then(() => {
        setNotification('Logged out')
        setTimeout(() => {
          setNotification('')
        }, 2000)
      });
  }

  return (
    <div>
      <nav style={{height: "30px", background: "red", borderBottom: "1px solid black",}}>
        {!loggedIn && (
          <div>
            <Link href="/users/register">
              <a>Register</a>
            </Link> |
            <Link href="/users/login">
              <a> Login</a>
            </Link>
          </div>)}
      </nav>
      <Head>
        <title>Blog App</title>
      </Head>
      <h1>Blog</h1>
      {notification}
      {!loggedIn
        ?
          <div>
          <Link href="/users/register">
            <a>Register</a>
          </Link> |
          <Link href="/users/login">
            <a> Login</a>
          </Link>
          </div>
        :
          <button onClick={handleLogout}>Logout</button>
      }
      <ul>
        {blogs.map(blog =>
          <li key={blog.id}>
            <Link href="/blog/[id]" as={'/blog/' + blog.id}>
              <a>{blog.title}</a>
            </Link>
          </li>
        )}
      </ul>
      {loggedIn && <CreatePost />}
    </div>
  )
}
export default Home;
