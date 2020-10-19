import React, { useContext} from 'react';
import { ContextProvider } from '../context/Context';
import { Link } from 'react-router-dom';

function SlideBar(props) {
    const { user, getIdUser } = useContext(ContextProvider);
    const { username } = props;

    
    return (
      <>
      <div className="posts-left col-lg-4 col-md-12 col-sm-12">
          <p className="sologan">Chào mừng  <Link to={`/profile/${user.uid}`}  onClick={() => getIdUser(user.uid)}><strong>{username}</strong></Link> tới với thế giới của Tớ ! Hãy để lại gì đó để tớ biết cậu từng vào đây nhé !</p>
          <ul className="list-intro">
              <li><Link to="/gioithieu">#giới_thiệu</Link></li>
              <li><Link to="/baiviet">#bài_viết</Link></li>
              <li><Link to="/banthan">#bản_thân</Link></li>
              <li><Link to="/sothich">#sở_thích</Link></li>
              <li><Link to="/giadinh">#gia_đình</Link></li>
          </ul>
      </div> 
      </>
    );
}

export default SlideBar;