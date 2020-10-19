import React, { useContext, useState } from 'react';
import { ContextProvider } from '../context/Context';
import { AiFillCamera } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
function CreatePost(props) {
    const { username } = props
    const history = useHistory("");
    const { user, handleCreatePost ,progress} = useContext(ContextProvider)
    const [image, setImage] = useState('');
    const [post, setPost] = useState({
        caption: "",
    })
    const handleChage = (e) => {
        setPost({
            ...post, [e.target.name]: e.target.value
        })
    }
    const handleFile = (e) => {
        console.log(e.target.files);
        if (e.target.files[0]) {
            const image = e.target.files[0];
            setImage(image)
        }
    }

    const handleSubmitCaptionImage = (e) => {
        e.preventDefault()
        if (!user) {
            setPost({
                caption: "",
            })
            setImage("")
            history.push("/login")
            return;
        }
        if (user && post.caption === "" && image === "") {
            alert("Bạn chưa nhập gì");
            return;
        }
        handleCreatePost({ post, image })
        setPost({
            caption: "",
        })
        setImage("")
        return;
    }
    return (
        <div className="create__posts col-12">
            <div className="create__posts-item col-12">
                <form className="create__posts-form">
                    <div className="create__posts-caption">
                        <textarea
                            className="create__posts-textarea"
                            rows="3"
                            name="caption"
                            value={post.caption}
                            onChange={handleChage}
                            placeholder={`Hi! ${username} cậu hãy viết gì đó  ?`} />
                    </div>
                    <hr />
                    <div className="create__posts-footer">
                        <div className="create__posts-file">
                            <label htmlFor="file" className="create__posts-camera">
                                <AiFillCamera size={25} className="create__posts-icon"></AiFillCamera>
                                <p className="create__posts-toolip">ảnh</p>
                            </label>
                            <input type="file"
                                id="file"
                                className="file"
                                onChange={handleFile} />
                        </div>
                        <button type="submit" className="create__posts-btn" onClick={handleSubmitCaptionImage} >Đăng</button>
                    </div>
                    <progress className="create__posts-progress"   value={progress} max="100"></progress>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;