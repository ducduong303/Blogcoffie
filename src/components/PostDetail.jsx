import React, { useContext, useState, useEffect } from 'react';
import { ContextProvider } from '../context/Context';
import { db } from '../config/firebase';
import moment from 'moment';
import Header from './Header';
import { GoComment } from 'react-icons/go';
import { BsHeart } from 'react-icons/bs';
import { Link, useHistory } from 'react-router-dom';
import { ImEarth } from 'react-icons/im';
import { FiSend } from 'react-icons/fi';

function PostDetail(props) {
    const history = useHistory("");
    const { idPost, addComments, user,} = useContext(ContextProvider);
    const [postDetail, setPostDetail] = useState(null)
    const [comments, setComments] = useState("")

    const postRef = db.collection("posts").doc(idPost)
    const getPost = () => {
        postRef.get().then(doc => {
            setPostDetail({ ...doc.data(), id: doc.id })
        })
    }


    useEffect(() => {
        getPost()
    }, [addComments])

    const handleComments = (id, contents) => {
        if (user) {
            if (contents.length > 0) {
                addComments(id, contents);
                setComments("")
            } else {
                alert("Bạn chưa nhập gì !")
            }
        } else {
            history.push("/login")
        }
    }

    console.log("postDetail",postDetail);
    
    const renderPostDetail = () => {
        return (
            postDetail &&
            <div className="post-detail">
                <div className="container">
                    <div className="row post-detail__item">
                        <div className="col-lg-8">
                            <div className="post-detail__content">
                                <div className="post-detail__content-header">
                                    <div className="post-detail__content-userpost">
                                        {
                                          user.uid === postDetail.postBy.id && user.photoURL === null ? <img src={user.photoURL} alt="*" className="post-detail__content-user"></img>
                                          :   <h3 className="post-detail__content-user">{postDetail.postBy.username.slice(0, 1).toUpperCase()}</h3>
   
                                        }

                                        <div className="post-detail__content-boxusername">
                                            <h5 className="post-detail__content-username">{postDetail.postBy.username}</h5>
                                            <small>{moment(postDetail.create_at).fromNow()}  <ImEarth /></small>
                                        </div>
                                    </div>
                                </div>
                                <h4 className="post-detail__content-caption">{postDetail.caption.charAt(0).toUpperCase() + postDetail.caption.slice(1)}</h4>
                                <img src={postDetail.imageUrl} alt="*" className="post-detail__content-image"></img>
                                <div className="post-detail__content-countLikeComment">
                                    <p className={` count-like`}><BsHeart size={20} className="icon" />{postDetail.noLikes} yêu thích</p>
                                    <p className="count-comment"><GoComment size={20} className="icon" />{postDetail.comments.length} comments</p>
                                </div>

                                <div className="post-detail__content-commentslist">
                                    {
                                        postDetail.comments && postDetail.comments.map((item, index) => {
                                           
                                            
                                            return (
                                                <div className="post-detail__content-commentslist-item" key={index}>
                                                    <div className="post-detail__content-commentslist-box">
                                                        <p className="post-detail__content-commentslist-content">
                                                            {
                                                            user.uid === item.postBy.id && user.photoURL !== null ? 
                                                                    <img src={user.photoURL} alt="*" className="post-detail__content-commentslist-avatar"></img>:
                                                                    <a href="/" className="post-detail__content-commentslist-avatar">{item.postBy.avatar}</a>
                                                            }

                                                            <Link to={`/`} className="post-detail__content-commentslist-user">  {item.postBy.name}</Link>
                                                            {item.contentComments}
                                                        </p>
                                                        <small>{moment(item.creat).fromNow()}</small>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="post-detail__content-commnets">
                                    <textarea
                                        className="input-comment"
                                        placeholder="bình luận gì đó ?"
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                    >
                                    </textarea>
                                    <button className="post-detail__content-commnets-btn" onClick={() => handleComments(postDetail.id, comments)}><FiSend size={20} ></FiSend ></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div >
        )
    }

    return (
        <>
            <Header></Header>
            {renderPostDetail()}
        </>
    );
}

export default PostDetail;