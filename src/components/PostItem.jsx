import React, { useState, useEffect, useContext } from 'react';
import { db } from '../config/firebase';
import moment from 'moment';
import { ContextProvider } from '../context/Context';

// Icon
import { ImEarth } from 'react-icons/im';
import { BsHeart} from 'react-icons/bs';
import { BiLike, BiShare } from 'react-icons/bi';
import { GoComment } from 'react-icons/go';

import { FiSend, FiEdit } from 'react-icons/fi';
import { useHistory, Link } from 'react-router-dom';
import { AiOutlineDelete } from 'react-icons/ai';
function PostItem(props) {
    const { post, userId } = props;
    const { user, addComments, toggleComments, openComments, handleDeletePost, getIdPost, } = useContext(ContextProvider)
    const [comments, setComments] = useState("")
    const history = useHistory("");
    const [editing, setEditing] = useState(true);
    const [captionEdit, setCaptionEdit] = useState(post.caption)
    const [Like, setLike] = useState('textforlike');


    // Lưu giữ trạng thái đã like
    useEffect(() => {
        if (user) {
            db.collection("posts")
                .doc(post.id)
                .collection("likes")
                .doc(userId)
                .get()
                .then(doc2 => {
                    if (doc2.data()) {
                        if (Like === 'textforlike') {
                            setLike('textforlike bluetextforlike')
                        } else {
                            setLike('textforlike')
                        }
                    }
                })
        }

    }, [post.id, userId]);

    // Chức Năng Like 
    const handleLike = (event) => {
        event.preventDefault();
        if (user) {
            if (Like === 'textforlike') {
                setLike('textforlike bluetextforlike')
            } else {
                setLike('textforlike')
            }

            db.collection('posts')
                .doc(post.id)
                .get()
                .then(docc => {
                    const data = docc.data()
                    if (Like === 'textforlike') {
                        db.collection("posts")
                            .doc(post.id)
                            .collection("likes")
                            .doc(userId)
                            .get()
                            .then(doc2 => {
                                if (doc2.data()) {
                                    console.log(doc2.data())
                                } else {
                                    db.collection("posts").doc(post.id).collection("likes").doc(userId).set({
                                        likes: 1
                                    });
                                    db.collection('posts').doc(post.id).update({
                                        noLikes: data.noLikes + 1
                                    });
                                }
                            })

                    } else {
                        db.collection('posts').doc(post.id).collection('likes').doc(userId).delete().then(function () {
                            db.collection('posts').doc(post.id).update({
                                noLikes: data.noLikes - 1
                            });
                        })
                    }
                })
        }
        else {
            history.push("/login")
        }
    }

    // Xử lý input comments
    const handleInputComments = (id, content, username) => {
        if (user) {
            if (content.length > 0) {
                addComments(id, content, username);
                setComments("")
            } else {
                alert("chưa nhập gì")
            }
        } else {
            history.push("/login")
        }
    }

    // Ẩn hiện button
    const getClick = () => {
        return !editing ? <button className="save" onClick={() => handleCaptionEdit()}>Save</button> : <button className="edit" onClick={(e) => setEditing(false)}><FiEdit size={15} /></button>
    }

    // Chức Năng Edit 
    const handleCaptionEdit = () => {
        db.collection("posts").doc(post.id).set({
            caption: captionEdit,
        }, { merge: true })
        setEditing(true)
    }


    
    return (
        <div className="post__item col-12">
            <div className="post__inner col-12">
                <div className="post__item-content">

                    {user ? user.uid === post.idUser || user.email === "dduc1445@gmail.com" ? <button className="delete" onClick={() => handleDeletePost(post.id)}><AiOutlineDelete size={15} /></button> : "" : ""}
                    {user ? user.uid === post.idUser || user.email === "dduc1445@gmail.com" ? getClick() : "" : ""}
                    <div className="post__item-header">
                        {
                            user.uid === post.idUser && user.photoURL !== null ? <img src={user.photoURL} alt="*" className="post__item-user"></img> : <h3 className="post__item-user">{post.username[0].toUpperCase()}</h3>
                        }

                        <div className="post__item-username">
                            <h5 className="username-user">{post.username}</h5>
                            <small>{moment(post.create_at).fromNow()}  <ImEarth /></small>
                        </div>
                    </div>
                    {
                        editing ? <h4 className="post__item-caption">{post.caption.charAt(0).toUpperCase() + post.caption.slice(1)}</h4>
                            :
                            <form onSubmit={handleCaptionEdit} className="form-editing" >
                                <textarea
                                    rows="2"
                                    className="caption-editing"
                                    type="text"
                                    onChange={(e) => setCaptionEdit(e.target.value)}
                                    value={captionEdit}
                                // onKeyUp={(event) => event.key === "Enter" ? handleEidt() : ""}
                                ></textarea>
                            </form>

                    }
                    <Link to={`postdetail/${post.id}`} onClick={() => getIdPost(post.id)}>
                        <img src={post.imageUrl} alt="" className="post__image" />
                    </Link>

                    <div className="post__item-countLikeComment">
                        <p className={`${Like} count-like`}><BsHeart size={20} className="iconlike " /> {post.noLikes} yêu thích</p>
                        <p className="count-comment"><GoComment size={20} className="iconcomment" />{post.comments.length} comments</p>
                    </div>
                    <div className="post__item-likeoptions">
                        <h4 className={Like} onClick={handleLike}><BiLike />thích</h4>
                        <h4 className="dope" onClick={toggleComments}><GoComment></GoComment>bình luận</h4>
                        <h4 onClick={() => alert("xin lỗi chức năng chưa hoàn thiện ")}><BiShare></BiShare>chia sẻ</h4>
                    </div>
                    <div className="post__item-commentslist">
                        {
                            post.comments && post.comments.map((item, index) => {
                                return (
                                    <div className="comments__content" key={index}>
                                        <div className="comments__content-box">
                                            <p className="comments__content-item">
                                                {
                                                    user.uid === item.postBy.id && user.photoURL !== null ? <img src={user.photoURL} alt="*" className="avatar-comments"></img> : <a href="" className="avatar-comments">{item.postBy.avatar}</a>

                                                }
                                                <Link to={`/`} className="user-comments"> {item.postBy.name}</Link>
                                                {item.contentComments}
                                            </p>
                                            <small>{moment(item.creat).fromNow()}</small>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {!openComments ?
                        <div className="post__item-commnets">
                            <textarea
                                value={comments}
                                className="input-comment"
                                placeholder="bình luận gì đó ?"
                                onChange={(e) => setComments(e.target.value)}
                            >
                            </textarea>
                            <button onClick={() => handleInputComments(post.id, comments, post.username)} className="btn-comments"><FiSend size={20} className="btn-submitcomments"></FiSend ></button>
                        </div> : ""
                    }



                </div>
            </div>

        </div>
    );
}

export default PostItem;