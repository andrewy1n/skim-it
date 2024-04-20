import React, { useRef } from 'react'
import '../css/Modal.css'

function Modal({ open, onClose, title, tldr, content, imgURL }) {
    const modalRef = useRef();

    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    }

    if(!open) { return null; }
    return (
        <div ref={modalRef} onClick={closeModal} className='overlay'>
            <div className='modalContainer'>
                <div className='modalHeader'>
                    <h1>{title}</h1>
                    <p onClick={onClose} className='closeButton'>X</p>
                </div>
                <br />
                <div className='modalContent'>
                    <img className='images'
                    src={imgURL}
                    alt={'lebron my baby'}
                    ></img>
                    <br />
                    <div style={{ whiteSpace: 'pre-line' }}>
                        TL;DR: {tldr}</div>
                    <br />
                    <div>{content}</div>  <br />
                </div>
                <br />
            </div>
        </div>
    );
}

export default Modal;
