import React, { useState, useEffect } from 'react';
import Header from './Header';
import { db } from '../config/firebase';
import { FaFacebookSquare } from 'react-icons/fa';
function Intro(props) {
    const [intro, setIntro] = useState("");
    useEffect(() => {
        db.collection("intro").orderBy("create", 'desc').onSnapshot(snapshot => {
            setIntro(snapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    top: doc.data().introBy.top,
                    center: doc.data().introBy.center,
                    bottom: doc.data().introBy.bottom,
                    head: doc.data().introBy.head,
                }
            }))
        })
    }, [])

    return (
        <>
            <Header></Header>
            <div className="intro">
                <div className="container intro__inner">
                    <div className="col-lg-8">
                        <div className="intro__item col-12">
                            <h3>Giới thiệu! </h3>
                            <div className="intro__item-content">
                                {
                                    intro && intro.map((item, index) => {
                                        return (
                                            <div className="intro__item-box" key={index}>
                                                <div className="intro__item-top">
                                                    <h4 className=""><strong className="hastag">#</strong>{item.top}</h4>
                                                </div>
                                                <div className="intro__item-center">
                                                    <h4><strong className="hastag">#</strong>{item.head}</h4>
                                                </div>
                                                <div className="intro__item-bottom">
                                                    <h5>contact: <a href={item.center} target="_blank" rel = "noopener noreferrer"  className="intro-face">Đức Dương <FaFacebookSquare /></a></h5>
                                                    <h5>{item.bottom}</h5>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>


                        </div>
                    </div>
                </div>

            </div>

        </>
    );
}

export default Intro;