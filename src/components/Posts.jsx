import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Post from './PostItem';
import { ContextProvider } from '../context/Context';
import CreatePost from './CreatePost';
import SlideBar from './SlideBar';


function Posts(props) {
    const { user, posts } = useContext(ContextProvider)

    // Nếu user undefined chuyển về page login
    const history = useHistory("");
    if (user === undefined) {
        history.push("/login")
    }

    const getPost = () => {
        if (posts) {
            return (
                posts.map((post) => {
                    return (
                        <Post
                            key={post.id}
                            post={post}
                            userId={user.uid}
                        ></Post>
                    )
                })

            )
        }

    }

    return (

        <div className="posts">
            <div className="container posts__inner">
                <div className="posts__box row col-lg-8">
                    {
                        user ? <div className="posts__right col-lg-8 col-md-12 col-sm-12">
                            <CreatePost username={user?.displayName}></CreatePost>
                            {getPost()}
                        </div> : <div className="posts__right col-lg-12 col-md-12 col-sm-12">
                                <CreatePost username={user?.displayName}></CreatePost>
                                {getPost()}
                            </div>
                    }
                    {user ? <SlideBar username={user.displayName}></SlideBar> : ""}
                </div>

            </div>


        </div>

    );
}

export default Posts;