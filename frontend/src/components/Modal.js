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
                    <svg xmlns="http://www.w3.org/2000/svg"
                        onClick={onClose} 
                        className='closeButton'
                        viewBox="0 0 384 512">
                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                        </svg>
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
                    {/* <div>{content}</div>  <br /> */}
                </div>
                <br />
                <div className='modalHeader'>
                    <button>I DISLIKE</button>
                    <button>I LIKE</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
