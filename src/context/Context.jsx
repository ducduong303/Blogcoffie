import React, { useState, createContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db, storage } from '../config/firebase';
import firebase from "firebase";
export const ContextProvider = createContext();
function Context(props) {
    const history = useHistory('');
    const [open, setOpen] = useState(true);
    const [user, setUser] = useState([]);
    const [noLikes, setNoLikes] = useState(0);
    const [posts, setPosts] = useState([]);
    const [openComments, setOpentComments] = useState(true)
    const [idPost, setIdPost] = useState(null)
    const [idUser, setIdUser] = useState(null)
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false)


    // Hiệu ứng loadLogin
    const LoaderTrue = () => {
        setLoading(true)
    }
    const LoaderFalse = () => {
        setLoading(false)
    }

    // Toggle đóng mở comments
    const toggleComments = () => {
        setOpentComments(!openComments)
    }

    // Toggle đóng mở login or register
    const toggleOpen = () => {
        setOpen(!open)
    }
    // Lấy id bài Post => làm page detail
    const getIdPost = (id) => {
        setIdPost(id);
    }
    
    // Lấy Id User => làm page profile
    const getIdUser = (id) => {
        setIdUser(id);
    }

    // Xử lý chức năng đăng nhập
    const handleLogin = async (data) => {
        const { email, password } = data
        await auth.signInWithEmailAndPassword(email, password)
            .then((auth) => {
                history.push("/");
                setTimeout(() => {
                    LoaderFalse()
                },400);
            })
            .catch((e) => {
                LoaderFalse();
                if (
                    e.message ===
                    "The password is invalid or the user does not have a password."
                ) {
                    alert("Bạn hãy check lại mật khẩu hoặc tài khoản ");
                } else if (
                    e.message ===
                    "There is no user record corresponding to this identifier. The user may have been deleted."
                ) {
                    history.push("/register");
                    window.scrollTo({
                        top: document.body.scrollHeight,
                        left: 0,
                        behavior: "smooth",
                    });
                } else {
                    alert(e.message);
                }
             
            })
    }

    // Xử lý chức năng đăng ký

    const handleRegister = (data) => {
        const { username, email, password } = data;
        console.log(data);
        auth.createUserWithEmailAndPassword(email, password)
            .then((auth) => {
                if (auth.user) {
                    auth.user.updateProfile({
                        displayName: username,
                    }).then((s) => {
                        history.push("/")
                    })
                }
            })
            .catch((e) => {
                if (e.message === "The email address is already in use by another account.") {
                    alert("Email này đã được đăng ký ở một tài khoản khác")
                }
                else {
                    alert(e.message);
                }
            })

    }

    // Xử lý chức năng đăng xuất
    const handleLogout = (event) => {
        event.preventDefault();
        auth.signOut();
        history.push("/");
    }
    // Xử lý chức năng cập nhật avatar
    const handleAvataUser = (image) => {
        const uploadTask = storage.ref(`avatar/${image.name}`).put(image);
        uploadTask.on("state_changed",
            (snapshot) => {
                // console.log(snapshot);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("avatar")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        if (user) {
                            user.updateProfile({
                                photoURL: url,
                            })
                        }
                    })
            }
        )    
    }

    // Tạo Bài posts
    const handleCreatePost = (data) => {
        const { post, image } = data;
        if (image === "") {
            db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: post.caption,
                imageUrl: image,
                noLikes: noLikes,
                create_at: Date.now(),
                comments: [],
                postBy: {
                    id: user.uid,
                    username: user.displayName,
                    email:user.email,
                    avatar:user.photoURL
                }

            })
        } else {
            const uploadTask = storage.ref(`images/${image.name}`).put(image);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                (error) => {
                    console.log(error);
                    alert(error.message);
                },
                () => {
                    storage
                        .ref("images")
                        .child(image.name)
                        .getDownloadURL()
                        .then(url => {
                            db.collection("posts").add({
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                caption: post.caption,
                                imageUrl: url,
                                noLikes: noLikes,
                                create_at: Date.now(),
                                comments: [],
                                postBy: {
                                    id: user.uid,
                                    username: user.displayName,
                                    email:user.email,
                                    avatar:user.photoURL
                                }
                            });

                            setProgress(0)
                        })
                }
            )
        }
    }

    // Xóa Bài Post
    const handleDeletePost = (id) => {
        if (user === null) {
            alert("đây không phải post của bạn ")
            return;
        }
        db.collection("posts").doc(id).delete()
    }

    // Chức Năng Comments
    const addComments = (id, content) => {
        const post = db.collection("posts").doc(id);
        post.get().then(doc => {
            if (doc.exists) {
                const prevcomments = doc.data().comments || [];
                const comments = {
                    postBy: {
                        avatar: user.displayName[0].toUpperCase(),
                        id: user.uid,
                        name: user.displayName, // tên đăng nhập
                    },
                    contentComments: content,
                    creat: Date.now()
                }
                const commentsUpdate = [...prevcomments, comments];
                post.update({ comments: commentsUpdate });
            }
        })
    }

    // Hiển thị User đăng nhập
    auth.onAuthStateChanged((authUser) => {
        if (authUser) {
            setUser(authUser)
        } else {
            setUser(false);
        }
    })

    // Load bài Post từ firebase về 
    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    // post: doc.data(),
                    create_at: doc.data().create_at,
                    caption: doc.data().caption,
                    noLikes: doc.data().noLikes,
                    username: doc.data().postBy.username,
                    idUser: doc.data().postBy.id,
                    email:doc.data().postBy.email,
                    avatar:doc.data().postBy.avatar,
                    imageUrl: doc.data().imageUrl,
                    comments: doc.data().comments,
                   
                }
            }))
        })
    }, [])




    return (
        <ContextProvider.Provider value={
            {
                LoaderTrue: LoaderTrue,   // Loadtrue chạy
                LoaderFalse: LoaderFalse,  // loadfase dừng
                user: user,  // Thông tin user
                posts: posts, // Thông tin bài Post
                idPost: idPost, // Id bài Post
                idUser: idUser,  // Id user
                progress: progress,  // Thanh progress
                loading: loading, // Trạng thái loading
                open: open, 
                toggleOpen: toggleOpen,
                handleLogin: handleLogin, // Chức năng login
                handleRegister: handleRegister, // Chức năng đăng ký
                handleLogout: handleLogout, // Chức năng đăng xuất
                handleCreatePost: handleCreatePost, // Chắc Năng tạo bài Post
                handleDeletePost: handleDeletePost, // Xóa bài post
                addComments: addComments, // Add Comments
                toggleComments: toggleComments, 
                openComments: openComments,
                getIdPost: getIdPost, // Lấy Id Post
                getIdUser: getIdUser, // Lấy Id user
                handleAvataUser: handleAvataUser // thay avatar
            }
        }>
            {props.children}
        </ContextProvider.Provider>
    );
}

export default Context;