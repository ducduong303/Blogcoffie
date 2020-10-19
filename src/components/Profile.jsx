import React, { useContext, useState, useEffect } from 'react';
import { ContextProvider } from '../context/Context';
import Header from './Header';
import moment from 'moment';
import avatar from "../assets/images/no-img.png";
import { AiOutlineSetting, AiOutlineDelete } from 'react-icons/ai';
import { ImEarth } from 'react-icons/im';
import { GoComment } from 'react-icons/go';
import { BsHeart } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { FiSend } from 'react-icons/fi';

function Profile(props) {
    const { idUser, posts, user, handleDeletePost, addComments, handleAvataUser } = useContext(ContextProvider);
    const [postUser, setPostUser] = useState(null);
    const [comments, setComments] = useState("");

    // Lọc Những  bài post của user
    const getPostUserProfile = () => {
        const Itempost = posts.filter(item => {
            return item.idUser ===  idUser
        })
        setPostUser(Itempost)
    }
    useEffect(() => {
        getPostUserProfile();
    }, [handleDeletePost, user])

    // Xử lý input comments
    const handleInputComments = (id, contents) => {
        if (contents.length > 0) {
            addComments(id, contents);
            setComments("")
        } else {
            alert("chưa nhập gì")
        }
    }

    return (
        <div className="profile">
            <Header></Header>
            <div className="container">
                <div className="profile__box">
                    <div className="col-lg-8">
                        <div className="col-12">
                            <div className="row profile__header">
                                <div className=" profile__avatar-header col-lg-3 col-md-12 col-sm-12">
                                    <label htmlFor="profile-file" className="avatar-file-toolip">
                                        <img src={user.photoURL === null ? avatar : user.photoURL} alt="" className="profile__avatar" />
                                        <p className="avatar-toolip">avatar</p>
                                    </label>
                                    <input type="file"
                                        id="profile-file"
                                        className="profile-file"
                                        onChange={(e) => handleAvataUser(e.target.files[0])}
                                    />
                                </div>
                                <div className=" profile__info col-lg-8 col-md-12 col-sm-12">
                                    <div className="profile__info-box">
                                        <div className="profile__info-editbox">
                                            <p className="profile__info-edit" onClick={() => alert("xin lỗi chức năng này chưa hoàn thiện")}>EDIT PROFILE</p>
                                            <AiOutlineSetting size={20} />
                                        </div>
                                        <h2>{user.displayName}</h2>
                                        <h4>{ user.email}</h4>
                                        <h3>số bài post: {postUser && postUser.length}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {
                            postUser && postUser.map((post, index) => {
                                return (
                                    <div className="profile__post" key={index}>
                                        <div className="profile__post-item">
                                            {user ? user.uid === post.idUser ? <button className="delete" onClick={() => handleDeletePost(post.id)}><AiOutlineDelete size={15} /></button> : "" : ""}
                                            <div className="profile__post-avatar">
                                                {
                                                    user.photoURL === null ? <h3 className="profile__post-user">{post.username[0].toUpperCase()}</h3> :
                                                        <img src={user.photoURL} alt="" className="profile__post-user"></img>
                                                }

                                                <div className="post__item-username">
                                                    <h5 className="username-user">{post.username}</h5>
                                                    <small>{moment(post.create_at).fromNow()}  <ImEarth /></small>
                                                </div>
                                            </div>
                                            <h4 className="profile__post-caption">
                                                {post.caption.charAt(0).toUpperCase() + post.caption.slice(1)}
                                            </h4>
                                            <img src={post.imageUrl} alt=""/>
                                            <div className="profile__post-countLikeComment">
                                                <p className={` count-like`}> <BsHeart size={20} className="icon " />{post.noLikes} yêu thích</p>
                                                <p className="count-comment"><GoComment size={20} className="icon" />{post.comments.length} comments</p>
                                            </div>

                                            {
                                                post.comments.map((item, index) => {
                                                    return (
                                                        <div className="profile__post-commentslist" key={index}>
                                                            <div className="profile__post-commentslist-box">
                                                                <p className="profile__post-commentslist-item">
                                                                    {
                                                                        user.uid === item.postBy.id  && user.photoURL !== null ?    <img src={user.photoURL} alt="" className="avatar-comments"></img> :
                                                                         <a href="/" className="avatar-comments">{item.postBy.avatar}</a> 
                                                                         
                                                                    }

                                                                    <Link to={`/`} className="user-comments">  {item.postBy.name}</Link>
                                                                    {item.contentComments}
                                                                </p>
                                                                <small>{moment(item.creat).fromNow()}</small>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <div className="post__item-commnets">
                                                <textarea
                                                    value={comments}
                                                    className="input-comment"
                                                    placeholder="bình luận gì đó ?"
                                                    onChange={(e) => setComments(e.target.value)}
                                                >
                                                </textarea>
                                                <button className="btn-comments" onClick={() => handleInputComments(post.id, comments)}><FiSend size={20} className="btn-submitcomments"></FiSend ></button>
                                            </div>
                                        </div>

                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;